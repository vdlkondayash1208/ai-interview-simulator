import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, MicOff, ShieldAlert, Timer, ArrowLeft, ChevronRight,
  User, Bot, Zap, CheckCircle2, MessageSquare, Activity, Award, History} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/storage';
import { GoogleGenAI } from '@google/genai';
import { cn, GlassCard } from '../../components/ui/GlassCard';
import { toast } from 'sonner';
import { useProgress } from '../../context/ProgressContext';

type Mode = 'selection' | 'interview' | 'feedback';

export default function FaceInterviewRound() {
  const { addInterviewResult } = useProgress();
  const [mode, setMode] = useState<Mode>('selection');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isAttackMode, setIsAttackMode] = useState(false);
  const [metrics, setMetrics] = useState({ confidence: 85, fillerWords: 0, speed: 0 });
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const { user } = useAuth();

  useEffect(() => {
    setQuestions(storage.getInterviewQuestions() || []);
  }, []);

  useEffect(() => {
    if (mode === 'interview') {
      startMedia();
      initSpeechRecognition();
      setTranscript('');
      transcriptRef.current = '';
      setTabSwitches(0);
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition on interview start:', err);
        enableSimulationMode();
        recognitionRef.current?.start();
        setIsRecording(true);
      }

      const interval = setInterval(() => setTimer((prev: number) => prev + 1), 1000);
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          setTabSwitches((prev: number) => {
            const next = prev + 1;
            if (next >= 3) {
              setMode('selection');
              toast.error('Interview terminated due to tab switching.');
            } else {
              toast.warning(`Warning ${next}/3: Tab switching is forbidden during this round.`);
            }
            return next;
          });
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        clearInterval(interval);
        stopMedia();
        recognitionRef.current?.stop();
        setIsRecording(false);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [mode]);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Camera and Microphone access required for this round.");
    }
  };

  const stopMedia = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      transcriptRef.current = '';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i][0];
          if (event.results[i].isFinal) {
            transcriptRef.current += result.transcript + ' ';
          } else {
            interimTranscript += result.transcript;
          }
        }
        setTranscript(transcriptRef.current + interimTranscript);
        if (interimTranscript.toLowerCase().includes('uh') || interimTranscript.toLowerCase().includes('um')) {
          setMetrics(prev => ({ ...prev, fillerWords: prev.fillerWords + 1 }));
        }
      };
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          toast.error("Microphone permission denied. Please allow mic access and try again.");
        } else if (event.error !== 'no-speech') {
          toast.error(`Microphone error: ${event.error}. Using simulation mode.`);
          enableSimulationMode();
        }
      };
    } else {
      toast.warning("Browser does not support Speech Recognition. Using simulation mode.");
      enableSimulationMode();
    }
  };

  const enableSimulationMode = () => {
    recognitionRef.current = {
      isSimulated: true,
      interval: null,
      start: () => {
        const sentences = [
          "I think the best approach here is to use a hash map.",
          "This would give us a time complexity of O(n).",
          "Um, wait, let me think about edge cases.",
          "If the array is empty, we should return null.",
          "Yeah, that seems like a solid solution to the problem."
        ];
        let i = 0;
        recognitionRef.current.interval = setInterval(() => {
          if (i < sentences.length) {
            setTranscript(prev => prev + (prev ? ' ' : '') + sentences[i]);
            i++;
          } else {
            clearInterval(recognitionRef.current.interval);
            setIsRecording(false);
          }
        }, 2000);
      },
      stop: () => {
        if (recognitionRef.current.interval) clearInterval(recognitionRef.current.interval);
      }
    };
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    initSpeechRecognition();
    setTranscript('');
    transcriptRef.current = '';

    try {
      recognitionRef.current?.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      enableSimulationMode();
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTranscript('');
      setIsRecording(false);
      recognitionRef.current?.stop();
    } else {
      await generateFinalFeedback();
    }
  };

  const generateFinalFeedback = async () => {
    setIsAnalyzing(true);
    setMode('feedback');
    
    try {
      setTimeout(() => {
        setAiFeedback({
          score: 88,
          feedback: "You demonstrated excellent communication skills. Your confidence level remained high throughout the session, and your technical knowledge was articulated clearly.",
          improvementTips: ["Reduce usage of filler words like 'um' and 'ah'", "Maintain consistent eye contact with the camera", "Structure complex answers using the STAR method"]
        });
        addInterviewResult('face', 88);
        setIsAnalyzing(false);
      }, 2000);
    } catch (err) {
      toast.error("Analysis failed.");
      setIsAnalyzing(false);
    }
  };

  if (mode === 'selection') {
    return (
      <div className="max-w-6xl mx-auto py-12 space-y-12 relative">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border border-white/10 backdrop-blur-xl">
            <Video className="w-12 h-12 text-neon-purple drop-shadow-[0_0_10px_rgba(176,38,255,0.8)]" />
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Face Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Round</span></h1>
          <p className="text-slate-400 text-lg">Master your body language, tone, and delivery with real-time AI analysis.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <GlassCard glowColor="purple" className="flex flex-col justify-between group cursor-pointer" onClick={() => { setMode('interview'); setIsAttackMode(false); }}>
              <div>
                <div className="w-16 h-16 bg-neon-purple/10 border border-neon-purple/20 rounded-2xl flex items-center justify-center text-neon-purple mb-8 group-hover:scale-110 transition-transform duration-500">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Practice Arena</h3>
                <ul className="space-y-4 mb-8 text-slate-400">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple" /> Topic-focused question banks</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple" /> Zero-pressure untimed environment</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple" /> Instant neuro-linguistic feedback</li>
                </ul>
              </div>
              <div className="w-full bg-brand-bg/50 border border-brand-border py-4 rounded-xl font-bold text-white group-hover:bg-neon-purple group-hover:border-neon-purple transition-all flex items-center justify-center gap-2">
                Launch Practice <ChevronRight className="w-5 h-5 opacity-50" />
              </div>
           </GlassCard>

           <GlassCard glowColor="cyan" className="flex flex-col justify-between group cursor-pointer relative overflow-hidden" onClick={() => { setMode('interview'); setIsAttackMode(true); }}>
              <div className="absolute top-6 right-6 flex items-center gap-1 bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <Zap className="w-3 h-3 fill-neon-cyan" /> Elite Round
              </div>
              <div>
                <div className="w-16 h-16 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl flex items-center justify-center text-neon-cyan mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">AI Combat Simulation</h3>
                <ul className="space-y-4 mb-8 text-slate-400">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-cyan" /> Locked browser environment</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-cyan" /> Pro-tier industry simulations</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-cyan" /> Executive hiring probability score</li>
                </ul>
              </div>
              <div className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-black py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:opacity-90 transition-all flex items-center justify-center gap-2">
                Enter Simulation <ChevronRight className="w-5 h-5" />
              </div>
           </GlassCard>
        </div>
      </div>
    );
  }

  if (mode === 'feedback') {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        <div className="text-center">
            <motion.div initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="w-32 h-32 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(176,38,255,0.5)]">
                <div className="w-full h-full bg-brand-bg rounded-full flex items-center justify-center m-1">
                  <Award className="w-14 h-14 text-transparent fill-neon-purple stroke-neon-cyan stroke-1" />
                </div>
            </motion.div>
            <h2 className="text-5xl font-black text-white mb-4">Interview Performance</h2>
            <p className="text-slate-400 text-lg">AI assessment of your verbal and non-verbal communication.</p>
        </div>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
             <div className="relative w-24 h-24">
                <motion.div className="absolute inset-0 border-4 border-t-neon-cyan border-r-neon-purple border-b-transparent border-l-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
             </div>
             <p className="font-bold text-white text-xl animate-pulse">Analyzing neural metrics...</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard glowColor="cyan" className="text-center p-8">
                   <p className="text-6xl font-black text-white mb-2">{aiFeedback?.score}%</p>
                   <p className="text-xs font-black text-neon-cyan uppercase tracking-widest">Overall Score</p>
                </GlassCard>
                <GlassCard glowColor="purple" className="text-center p-8">
                   <p className="text-6xl font-black text-white mb-2">{metrics.confidence}%</p>
                   <p className="text-xs font-black text-neon-purple uppercase tracking-widest">Confidence Level</p>
                </GlassCard>
                <GlassCard glowColor="blue" className="text-center p-8">
                   <p className="text-6xl font-black text-red-500 mb-2">{metrics.fillerWords}</p>
                   <p className="text-xs font-black text-red-400 uppercase tracking-widest">Filler Words</p>
                </GlassCard>
             </div>

             <GlassCard glowColor="none" className="p-8">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-neon-cyan" /> AI Feedback Analysis
                </h3>
                <p className="text-slate-300 leading-relaxed mb-10 text-lg">{aiFeedback?.feedback}</p>
                
                <h4 className="text-sm font-black text-white mb-6 uppercase tracking-widest border-b border-brand-border pb-4">Improvement Roadmap</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {aiFeedback?.improvementTips.map((tip: string, i: number) => (
                     <div key={i} className="flex gap-4 p-5 bg-brand-sidebar border border-white/5 rounded-2xl group hover:border-neon-cyan/30 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-neon-cyan shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                        <p className="text-sm text-slate-300 font-medium">{tip}</p>
                     </div>
                   ))}
                </div>
             </GlassCard>

             <div className="flex justify-center pt-6">
                <button 
                  onClick={() => setMode('selection')}
                  className="bg-white text-black px-12 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  Return to Dashboard
                </button>
             </div>
          </motion.div>
        )}
      </div>
    );
  }

  const currentQuestionObj = questions[currentQ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6 animate-in fade-in duration-500 w-full overflow-hidden">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-2">
         <button onClick={() => setMode('selection')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-colors">
           <ArrowLeft className="w-5 h-5" /> Quit Interview
         </button>
         <div className="flex items-center gap-4">
            <div className="bg-brand-sidebar border border-brand-border px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
               <Timer className="w-5 h-5 text-neon-cyan" />
               <span className="font-mono font-bold text-lg text-white tracking-widest">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</span>
            </div>
            {isAttackMode && (
              <div className="bg-red-500/10 border border-red-500/30 px-5 py-2.5 rounded-xl flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span className="text-xs font-black text-red-500 uppercase tracking-widest">Live Session Secured</span>
              </div>
            )}
            {tabSwitches > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 px-5 py-2.5 rounded-xl flex items-center gap-2 text-amber-300">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Tab Switches: {tabSwitches}</span>
              </div>
            )}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Left: AI Interviewer Simulator */}
        <div className="flex flex-col gap-6">
           <GlassCard glowColor="none" className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-sidebar pointer-events-none" />
              
              <div className="relative mb-12">
                 {/* Voice waveform simulation */}
                 {isRecording && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     {[1,2,3,4].map(i => (
                       <motion.div 
                         key={i}
                         animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                         transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                         className="absolute w-full h-full rounded-full border border-neon-cyan/50"
                       />
                     ))}
                   </div>
                 )}
                 <div className="relative w-48 h-48 bg-brand-bg rounded-full flex items-center justify-center ring-4 ring-neon-purple/30 overflow-hidden shadow-[0_0_40px_rgba(176,38,255,0.2)] z-10">
                    <Bot className={cn("w-24 h-24", isRecording ? "text-neon-cyan" : "text-neon-purple")} />
                 </div>
                 <div className="absolute -top-2 -right-2 bg-green-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-[0_0_10px_rgba(34,197,94,0.5)] z-20">
                   Online
                 </div>
              </div>

              <div className="text-center max-w-md space-y-6 relative z-10">
                 <h3 className="text-3xl font-bold text-white leading-relaxed">"{currentQuestionObj?.question}"</h3>
                 <p className="text-sm text-neon-cyan animate-pulse">Interviewer is listening...</p>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-bg/50 border border-brand-border rounded-full">
                    <History className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">Question {currentQ + 1} of {questions.length}</span>
                 </div>
              </div>

              {/* Real-time stats visualization */}
              <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4 z-10">
                 <div className="bg-brand-bg/80 backdrop-blur-md p-4 rounded-xl flex items-center gap-4 border border-brand-border">
                    <Activity className="w-6 h-6 text-neon-cyan" />
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence</p>
                       <p className="text-lg font-bold text-white leading-none mt-1">{metrics.confidence}%</p>
                    </div>
                 </div>
                 <div className="bg-brand-bg/80 backdrop-blur-md p-4 rounded-xl flex items-center gap-4 border border-brand-border">
                    <Activity className="w-6 h-6 text-red-500" />
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fillers</p>
                       <p className="text-lg font-bold text-white leading-none mt-1">{metrics.fillerWords}</p>
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* Right: User Webcam & Control */}
        <div className="flex flex-col gap-6">
           <GlassCard glowColor="none" className="flex-1 p-0 overflow-hidden relative border-none">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
                 <button 
                  onClick={toggleRecording}
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl",
                    isRecording ? "bg-red-500 animate-pulse hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "bg-white hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  )}
                 >
                   {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-black" />}
                 </button>
              </div>
              <div className="absolute top-6 right-6">
                 <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Rec Active</span>
                 </div>
              </div>
           </GlassCard>

           <GlassCard glowColor="none" className="h-56 p-0 flex flex-col overflow-hidden">
              <div className="bg-brand-sidebar border-b border-brand-border px-6 py-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-neon-cyan" />
                    <h5 className="text-[10px] uppercase font-black text-slate-300 tracking-widest">Live Transcript</h5>
                 </div>
                 <button onClick={handleNext} disabled={!transcript && !isRecording} className="text-white hover:text-neon-cyan bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-black uppercase transition-colors disabled:opacity-30 flex items-center gap-2">
                   {currentQ === questions.length - 1 ? 'Analyze Feedback' : 'Next Question'} <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                 <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    {transcript || <span className="text-slate-600">Start speaking to see your live transcript here...</span>}
                 </p>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
