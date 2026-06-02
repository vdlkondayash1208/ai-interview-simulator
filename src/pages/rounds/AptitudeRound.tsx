import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, BrainCircuit, Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft,
  ChevronRight, Timer, ShieldAlert, Trophy, Lightbulb
} from 'lucide-react';
import { storage } from '../../utils/storage';
import { cn, GlassCard } from '../../components/ui/GlassCard';
import { toast } from 'sonner';
import { useProgress } from '../../context/ProgressContext';

type Mode = 'selection' | 'practice' | 'attack' | 'results';

export default function AptitudeRound() {
  const { addInterviewResult } = useProgress();
  const [mode, setMode] = useState<Mode>('selection');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isAttackMode, setIsAttackMode] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  useEffect(() => {
    const q = storage.getAptitudeQuestions() || [];
    setQuestions([...q].sort(() => Math.random() - 0.5));
  }, []);

  // Anti-cheating logic
  useEffect(() => {
    if (mode === 'attack') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          setTabSwitches(prev => {
            const next = prev + 1;
            if (next >= 3) {
              setMode('results');
              toast.error("Interview Terminated Due to Malpractice");
            } else {
              toast.warning(`Warning ${next}/3: Tab switching is forbidden!`);
            }
            return next;
          });
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [mode]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (mode === 'practice' || mode === 'attack') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  const handleModeSelect = (selectedMode: Mode) => {
    if (questions.length === 0) {
      toast.error('No questions available in mock DB.');
      return;
    }
    setMode(selectedMode);
    setIsAttackMode(selectedMode === 'attack');
    setTimer(0);
    setCurrentIdx(0);
    setAnswers({});
    setTabSwitches(0);
    setShowExplanation(false);
    
    // Reshuffle for each new attempt to prevent repeated same questions
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (optionIdx: number) => {
    const qId = questions[currentIdx].id;
    if (answers[qId] !== undefined) return;
    setAnswers({ ...answers, [qId]: optionIdx });
    if (mode === 'practice') {
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
    } else {
      finishRound();
    }
  };

  const finishRound = () => {
    const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correctCount/questions.length)*100) || 0;
    addInterviewResult('aptitude', score);
    setMode('results');
  };

  if (mode === 'selection') {
    return (
      <div className="max-w-5xl mx-auto space-y-12 py-10 relative">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-white/10 backdrop-blur-xl">
            <BrainCircuit className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Aptitude <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Round</span></h1>
          <p className="text-slate-400 text-lg">Master logical reasoning, quantitative analysis, and verbal ability.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard glowColor="cyan" className="flex flex-col justify-between group cursor-pointer" onClick={() => handleModeSelect('practice')}>
            <div>
              <div className="w-16 h-16 bg-neon-cyan/10 rounded-2xl flex items-center justify-center text-neon-cyan mb-8 group-hover:scale-110 transition-transform duration-500 border border-neon-cyan/20">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Practice Mode</h3>
              <ul className="space-y-3 mb-8 text-slate-400">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-cyan" /> Untimed practice session</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-cyan" /> Instant feedback & solutions</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-cyan" /> Question-wise explanations</li>
              </ul>
            </div>
            <div className="w-full bg-brand-bg/50 border border-brand-border py-4 rounded-xl font-bold text-white group-hover:bg-neon-cyan group-hover:text-black group-hover:border-neon-cyan transition-all flex items-center justify-center gap-2">
              Start Practice <ChevronRight className="w-5 h-5" />
            </div>
          </GlassCard>

          <GlassCard glowColor="purple" className="flex flex-col justify-between group cursor-pointer relative overflow-hidden" onClick={() => handleModeSelect('attack')}>
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-neon-purple/20 border border-neon-purple/30 text-neon-purple px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(176,38,255,0.4)]">
              <Zap className="w-3 h-3 fill-neon-purple" /> Critical Round
            </div>
            <div>
              <div className="w-16 h-16 bg-neon-purple/10 rounded-2xl flex items-center justify-center text-neon-purple mb-8 group-hover:scale-110 transition-transform duration-500 border border-neon-purple/20">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">Attack Mode</h3>
              <ul className="space-y-3 mb-8 text-slate-400">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple" /> Real-time simulation</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple" /> Anti-cheating monitoring</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-neon-purple" /> Strict countdown timer</li>
              </ul>
            </div>
            <div className="w-full bg-gradient-to-r from-neon-purple to-neon-blue py-4 rounded-xl font-bold text-white group-hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(176,38,255,0.4)]">
              Launch Attack <Zap className="w-5 h-5 fill-white" />
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correctCount/questions.length)*100) || 0;
    
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-32 h-32 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center text-white mx-auto shadow-[0_0_40px_rgba(0,240,255,0.5)] p-1"
        >
          <div className="w-full h-full bg-brand-bg rounded-full flex items-center justify-center">
            <Trophy className="w-16 h-16 text-transparent fill-neon-cyan" />
          </div>
        </motion.div>
        
        <div>
          <h2 className="text-5xl font-black text-white mb-2">Round Completed!</h2>
          <p className="text-slate-400 text-lg">You scored {score}% in this session.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <GlassCard glowColor="none" className="p-6 text-center">
            <p className="text-4xl font-black text-white">{correctCount}/{questions.length}</p>
            <p className="text-xs font-bold text-neon-cyan uppercase tracking-widest mt-2">Accuracy</p>
          </GlassCard>
          <GlassCard glowColor="none" className="p-6 text-center">
            <p className="text-4xl font-black text-white">{Math.floor(timer / 60)}m {timer % 60}s</p>
            <p className="text-xs font-bold text-neon-purple uppercase tracking-widest mt-2">Time Taken</p>
          </GlassCard>
          <GlassCard glowColor="none" className="p-6 text-center">
            <p className="text-4xl font-black text-red-500">{tabSwitches}</p>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-2">Alerts</p>
          </GlassCard>
        </div>

        <button 
          onClick={() => handleModeSelect('selection')}
          className="bg-white text-black px-12 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-slate-200 transition-all inline-flex items-center gap-2"
        >
          Return to Dashboard <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className={cn("max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500", isAttackMode && "fixed inset-0 z-50 bg-brand-bg p-8 overflow-y-auto")}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <button onClick={() => setMode('selection')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quit Session
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-brand-sidebar border border-brand-border px-5 py-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <Timer className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono font-bold tracking-tighter text-lg">
              {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}
            </span>
          </div>
          {isAttackMode && (
            <div className="bg-red-500/10 px-5 py-2.5 rounded-xl flex items-center gap-2 border border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">Tab Monitor Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-brand-sidebar rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_rgba(0,240,255,0.8)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard glowColor="none" className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {q.category}
              </span>
              <span className="bg-neon-purple/10 border border-neon-purple/20 text-neon-purple px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {q.difficulty}
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-white leading-relaxed mb-10">
              {q.question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {q.options.map((option: string, idx: number) => {
                const isSelected = answers[q.id] === idx;
                const isCorrect = idx === q.correctAnswer;
                const showFeedback = mode === 'practice' && answers[q.id] !== undefined;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answers[q.id] !== undefined}
                    className={cn(
                      "group p-5 rounded-2xl border-2 text-left transition-all flex items-start justify-between",
                      answers[q.id] === undefined 
                        ? "border-brand-border bg-brand-bg/50 hover:border-neon-cyan/50 hover:bg-neon-cyan/5" 
                        : isSelected
                          ? isCorrect ? "border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                          : isCorrect && showFeedback ? "border-green-500 bg-green-500/10" : "border-brand-border bg-brand-bg/20 opacity-50"
                    )}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <span className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors shrink-0",
                        isSelected 
                          ? isCorrect ? "bg-green-500 text-black" : "bg-red-500 text-white"
                          : "bg-brand-sidebar text-slate-400 group-hover:bg-neon-cyan/20 group-hover:text-neon-cyan"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={cn(
                        "font-bold text-lg leading-relaxed min-w-0",
                        isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                      )}>
                        {option}
                      </span>
                    </div>
                    <div className="flex items-start">
                      {showFeedback && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                      {showFeedback && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20 mt-4">
                  <div className="flex items-center gap-2 mb-2 text-green-400">
                    <Lightbulb className="w-5 h-5" />
                    <h4 className="font-black uppercase tracking-widest text-xs">Explanation</h4>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    This is the correct answer based on logical derivation rules applied to the premises provided.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end pt-4">
            <button 
              onClick={nextQuestion}
              disabled={answers[q.id] === undefined}
              className="bg-white text-black px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              {currentIdx === questions.length - 1 ? 'Finish Round' : 'Next Question'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <GlassCard glowColor="none" className="p-6">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Question Context</h4>
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-bold uppercase">Target Company</span>
                <span className="text-white font-black">{q.company || 'General'}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard glowColor="none" className="p-6">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Round Progress</h4>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all",
                    currentIdx === i ? "bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,240,255,0.5)] scale-110" : answers[questions[i].id] !== undefined ? "bg-white/10 text-white" : "bg-brand-sidebar border border-brand-border text-slate-500"
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
