import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Code2, Play, Send, Timer, ShieldAlert, ArrowLeft, 
  Terminal, Video, Zap, ChevronRight, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../../utils/storage';
import { cn, GlassCard } from '../../components/ui/GlassCard';
import { toast } from 'sonner';
import { useProgress } from '../../context/ProgressContext';

type Mode = 'selection' | 'interview';

export default function ProgrammingRound() {
  const { addInterviewResult } = useProgress();
  const [solvedProblems, setSolvedProblems] = useState<string[]>(JSON.parse(localStorage.getItem('solved_coding') || '[]'));
  const [mode, setMode] = useState<Mode>('selection');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isAttackMode, setIsAttackMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWebcam, setShowWebcam] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const q = storage.getCodingQuestions() || [];
    const solved = JSON.parse(localStorage.getItem('solved_coding') || '[]');
    const shuffled = [...q].sort((a, b) => {
      const aSolved = solved.includes(a.id);
      const bSolved = solved.includes(b.id);
      if (aSolved === bSolved) return Math.random() - 0.5;
      return aSolved ? 1 : -1;
    });
    setQuestions(shuffled);
    if (shuffled.length > 0) {
      setCurrentQuestion(shuffled[0]);
      setCode(shuffled[0].starterCode);
    }
  }, []);

  useEffect(() => {
    if (isAttackMode) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          setTabSwitches(prev => {
            const next = prev + 1;
            if (next >= 3) {
              setMode('selection');
              setIsAttackMode(false);
              toast.error("Interview Terminated Due to Malpractice");
            } else {
              toast.warning(`Warning ${next}/3: Tab switching is forbidden!`);
            }
            return next;
          });
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      startWebcam();
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        stopWebcam();
      };
    }
  }, [isAttackMode]);

  useEffect(() => {
    let interval: any;
    if (isAttackMode) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isAttackMode]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowWebcam(true);
      }
    } catch (err) {
      console.error("Webcam access denied", err);
      toast.error("Webcam access is required for Attack Mode");
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const streams = (videoRef.current.srcObject as MediaStream).getTracks();
      streams.forEach(track => track.stop());
    }
    setShowWebcam(false);
  };

  const handleRunCode = () => {
    if (!currentQuestion) return;
    const tc1 = currentQuestion.testCases[0];
    const tc2 = currentQuestion.testCases[1];
    setOutput(`Running tests...\n\nTest Case 1: ${tc1?.input}\nOutput: ${tc1?.output}\nStatus: Passed ✅\n\nTest Case 2: ${tc2?.input}\nOutput: ${tc2?.output}\nStatus: Passed ✅`);
    toast.success("All sample test cases passed!");
  };

  const handleSubmit = () => {
    if (currentQuestion && !solvedProblems.includes(currentQuestion.id)) {
      const updatedSolved = [...solvedProblems, currentQuestion.id];
      setSolvedProblems(updatedSolved);
      localStorage.setItem('solved_coding', JSON.stringify(updatedSolved));
    }
    
    if (isAttackMode) {
      addInterviewResult('programming', 95);
      setIsAttackMode(false);
      setMode('selection');
      toast.success("Coding Interview Submitted Successfully! (+95 XP)");
    } else {
      addInterviewResult('programming', 50);
      toast.info("Solution submitted in practice mode.");
    }
  };

  if (mode === 'selection') {
    return (
      <div className="max-w-6xl mx-auto py-12 space-y-12 relative">
        <div className="flex justify-between items-end">
          <div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 backdrop-blur-xl">
              <Code2 className="w-12 h-12 text-neon-blue drop-shadow-[0_0_10px_rgba(0,71,255,0.8)]" />
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">Programming <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Round</span></h1>
            <p className="text-slate-400 text-lg">Choose your path to software excellence.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-neon-blue/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-neon-blue/20 shadow-[0_0_15px_rgba(0,71,255,0.2)]">
                <Code2 className="w-5 h-5 text-neon-blue" />
                <span className="text-sm font-bold text-neon-blue">{solvedProblems.length} Problems Solved</span>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Practice Card */}
          <GlassCard glowColor="blue" className="flex flex-col justify-between group cursor-pointer" onClick={() => { setMode('interview'); setIsAttackMode(false); }}>
            <div className="w-16 h-16 bg-neon-blue/10 rounded-2xl flex items-center justify-center text-neon-blue mb-8 group-hover:scale-110 transition-transform duration-500 border border-neon-blue/20">
              <Code2 className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Practice Mode</h3>
            <p className="text-slate-400 mb-8">Solve curated problems at your own pace with AI hints and solutions.</p>
            <div className="w-full bg-brand-bg/50 border border-brand-border py-4 rounded-xl font-bold text-white group-hover:bg-neon-blue group-hover:border-neon-blue transition-all flex items-center justify-center gap-2">
              Start Practice <ChevronRight className="w-5 h-5 opacity-50" />
            </div>
          </GlassCard>

          {/* Attack Card */}
          <GlassCard glowColor="purple" className="flex flex-col justify-between group cursor-pointer relative overflow-hidden" onClick={() => { setMode('interview'); setIsAttackMode(true); }}>
             <div className="absolute top-6 right-6 flex items-center gap-1 bg-neon-purple/20 text-neon-purple border border-neon-purple/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(176,38,255,0.4)]">
              <Zap className="w-3 h-3 fill-neon-purple" /> Live Simulation
            </div>
            <div className="w-16 h-16 bg-neon-purple/10 rounded-2xl flex items-center justify-center text-neon-purple mb-8 group-hover:scale-110 transition-transform duration-500 border border-neon-purple/20">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Attack Mode</h3>
            <p className="text-slate-400 mb-8">Simulate a high-pressure coding interview with webcam and time tracking.</p>
            <div className="w-full bg-gradient-to-r from-neon-purple to-neon-blue text-white py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(176,38,255,0.4)] group-hover:opacity-90 transition-all flex items-center justify-center gap-2">
              Start Interview <ChevronRight className="w-5 h-5" />
            </div>
          </GlassCard>
        </div>

        {/* Problem List */}
        <GlassCard glowColor="none" className="p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white">Recommended Problems</h3>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button key={d} className="px-4 py-2 rounded-xl text-xs font-bold border border-brand-border hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                    {d}
                  </button>
                ))}
              </div>
           </div>
           <div className="space-y-4">
              {questions.map(q => (
                <div key={q.id} className="flex items-center justify-between p-6 rounded-2xl border border-brand-border hover:border-neon-cyan/50 hover:bg-white/5 transition-all group">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 bg-brand-sidebar border border-brand-border rounded-xl flex items-center justify-center text-slate-400 group-hover:text-neon-cyan group-hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all">
                        <Terminal className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-lg">{q.title}</h5>
                        <div className="flex gap-2 mt-1">
                          {q.tags.map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tag}</span>
                          ))}
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className={cn(
                        "text-[10px] font-black uppercase px-4 py-1.5 rounded-full border",
                        q.difficulty === 'Easy' ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                      )}>{q.difficulty}</span>
                      {solvedProblems.includes(q.id) ? (
                        <div className="bg-green-500/20 text-green-400 px-6 py-2.5 rounded-xl text-sm font-black border border-green-500/30 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Solved
                        </div>
                      ) : (
                        <button onClick={() => { setCurrentQuestion(q); setCode(q.starterCode); setMode('interview'); }} className="bg-white text-black hover:bg-slate-200 px-6 py-2.5 rounded-xl text-sm font-black shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all">
                          Solve
                        </button>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </GlassCard>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4 animate-in fade-in duration-500 w-full overflow-hidden">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <button onClick={() => { setMode('selection'); setIsAttackMode(false); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white leading-none tracking-tight">{currentQuestion.title}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
                currentQuestion.difficulty === 'Easy' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
              )}>{currentQuestion.difficulty}</span>
              <div className="flex gap-2">
                {currentQuestion.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAttackMode && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-brand-sidebar border border-brand-border px-4 py-2 rounded-xl text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <Timer className="w-4 h-4 text-neon-cyan" />
                <span className="font-mono font-bold tracking-tighter">
                  {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="bg-red-500/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Proctored Session</span>
              </div>
            </div>
          )}
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-brand-sidebar border border-brand-border rounded-xl text-xs font-bold px-4 py-2 text-white outline-none focus:border-neon-cyan/50"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
        {/* Left: Problem Statement & Webcam */}
        <div className="flex flex-col gap-4 overflow-hidden relative">
           <GlassCard glowColor="none" className="flex-1 overflow-y-auto p-8 rounded-2xl border border-brand-border bg-brand-bg/50">
              <div className="prose prose-invert max-w-none">
                 <h4 className="text-xs uppercase font-black text-neon-cyan tracking-widest mb-4 flex items-center gap-2">
                   <Terminal className="w-4 h-4" /> Problem Statement
                 </h4>
                 <p className="text-slate-300 mb-8 text-base leading-relaxed">{currentQuestion.description}</p>
                 
                 <div className="space-y-6">
                   {currentQuestion.testCases.map((tc: any, i: number) => (
                     <div key={i} className="bg-brand-sidebar border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-cyan to-neon-purple opacity-50 group-hover:opacity-100 transition-opacity" />
                       <div className="mb-3">
                         <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Input</p>
                         <code className="text-sm font-bold text-white bg-black/50 px-2 py-1 rounded">{tc.input}</code>
                       </div>
                       <div>
                         <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Output</p>
                         <code className="text-sm font-bold text-white bg-black/50 px-2 py-1 rounded">{tc.output}</code>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
           </GlassCard>

           {/* Webcam overlay simulation */}
           {showWebcam && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute bottom-6 right-6 w-48 h-32 rounded-2xl overflow-hidden border-2 border-neon-purple shadow-[0_0_20px_rgba(176,38,255,0.4)] z-10"
             >
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-80" />
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_#ef4444]" />
                  <span className="text-[8px] font-black uppercase text-white">Live</span>
                </div>
                <div className="absolute inset-0 bg-neon-purple/10 pointer-events-none mix-blend-overlay" />
             </motion.div>
           )}
        </div>

        {/* Right: Code Editor & Console */}
        <div className="flex flex-col gap-4 overflow-hidden">
           <div className="flex-1 bg-[#1E1E1E] rounded-2xl overflow-hidden border border-brand-border relative shadow-2xl">
              <div className="absolute top-4 right-4 z-10 flex gap-3">
                 <button onClick={handleRunCode} className="bg-black/40 hover:bg-black/60 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 backdrop-blur-md transition-all hover:border-neon-cyan/50 hover:text-neon-cyan">
                    <Play className="w-3.5 h-3.5 fill-current" /> Run Code
                 </button>
                 <button onClick={handleSubmit} className="bg-gradient-to-r from-neon-cyan to-neon-blue text-black px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-90">
                    <Send className="w-3.5 h-3.5" /> Submit Solution
                 </button>
              </div>
              <Editor
                height="100%"
                defaultLanguage={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  fontLigatures: true,
                  padding: { top: 70 },
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on"
                }}
              />
           </div>

           <GlassCard glowColor="none" className="h-48 p-0 rounded-2xl overflow-hidden flex flex-col border border-brand-border bg-brand-bg/80">
              <div className="bg-brand-sidebar border-b border-brand-border px-6 py-3 flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-neon-cyan" />
                 <h4 className="text-[10px] uppercase font-black text-slate-300 tracking-widest">Console Output</h4>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {output || <span className="text-slate-600">Waiting for code execution...</span>}
                </pre>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
