import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Zap, BrainCircuit, Code2, Video, Flame, Bot, ChevronRight, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { cn, GlassCard } from '../components/ui/GlassCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats } = useProgress();

  const readinessScore = Math.round(((stats?.aptitude || 85) + (stats?.programming || 92) + (stats?.communication || 78)) / 3);
  const readinessFraction = readinessScore / 100;
  
  const confidence = stats?.communication || 85;
  const wpm = 100 + Math.round((stats?.communication || 50) * 0.4);
  const logicIndex = ((stats?.programming || 80) / 100).toFixed(1);

  const recommendedPractice = [
    {
      category: 'APTITUDE',
      title: stats.aptitude < 70 ? 'Sharpen mental math and pattern questions' : 'Maintain aptitude momentum',
      subtitle: stats.aptitude < 70 ? 'Improve speed and accuracy on timed tests' : 'Keep practicing mixed reasoning sets',
      color: 'cyan',
    },
    {
      category: 'CODING',
      title: stats.programming < 75 ? 'Target data structures and algorithms' : 'Level up with complex systems problems',
      subtitle: stats.programming < 75 ? 'Work on core coding fundamentals and optimization' : 'Practice multi-stage architecture challenges',
      color: 'purple',
    },
    {
      category: 'COMMUNICATION',
      title: stats.communication < 70 ? 'Practice clear STAR answers' : 'Refine your storytelling delivery',
      subtitle: stats.communication < 70 ? 'Focus on concise structure and confidence' : 'Polish tone and pacing for interviews',
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sleek Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-2">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">{user?.name || 'Explorer'}</span></h1>
          <p className="text-slate-400 text-lg">Your interview readiness has increased by <span className="text-neon-cyan font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">12%</span> this week.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-brand-sidebar border border-brand-border px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <span className="font-bold text-white text-sm uppercase tracking-widest">{user?.stats?.streak || 12} Day Streak</span>
          </div>
          <button className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black px-6 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]">
            Start Mock Interview
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        <div className="xl:col-span-8 space-y-8">
          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard icon={<BrainCircuit />} label="Aptitude" value={stats?.aptitude || 85} color="cyan" />
            <MetricCard icon={<Code2 />} label="Programming" value={stats?.programming || 92} color="purple" />
            <MetricCard icon={<Video />} label="Communication" value={stats?.communication || 78} color="blue" />
          </div>

          {/* Large Readiness Meter Card */}
          <GlassCard glowColor="none" className="p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/5 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
              <div className="md:w-2/3 space-y-6">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-neon-purple" />
                  <h2 className="text-3xl font-black text-white">Readiness Meter</h2>
                </div>
                <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                  Your profile suggests you are highly prepared for <span className="text-neon-purple font-bold">Product-Led</span> roles but need work on System Design.
                </p>
                <div className="flex gap-10 pt-4 border-t border-white/5">
                  <div>
                     <p className="text-3xl font-black text-white">{confidence}%</p>
                     <p className="text-[10px] text-neon-cyan uppercase font-black tracking-widest mt-1">Confidence</p>
                  </div>
                  <div>
                     <p className="text-3xl font-black text-white">{wpm}</p>
                     <p className="text-[10px] text-neon-purple uppercase font-black tracking-widest mt-1">WPM Speed</p>
                  </div>
                  <div>
                     <p className="text-3xl font-black text-white">{logicIndex}</p>
                     <p className="text-[10px] text-neon-blue uppercase font-black tracking-widest mt-1">Logic Index</p>
                  </div>
                </div>
              </div>
              
              <div className="w-40 h-40 self-center flex items-center justify-center relative">
                {/* SVG glowing ring */}
                <svg className="w-40 h-40 transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(176,38,255,0.8)]">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-border" />
                  <circle 
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={440} strokeDashoffset={440 * (1 - readinessFraction)} 
                    className="text-neon-purple transition-all duration-1000" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{readinessScore}%</span>
                  <span className="text-[8px] uppercase tracking-widest font-black text-slate-400">Ready</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Strengths & Weakness Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard glowColor="none" className="p-8">
              <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-green-500/20 text-green-500 w-8 h-8 rounded-lg flex items-center justify-center border border-green-500/30">✓</span> Strengths
              </h4>
              <ul className="space-y-4">
                {(stats.strengths.length ? stats.strengths : ['Communication', 'Data Structures', 'Verbal Ability']).map((item, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-center justify-between group bg-brand-bg/50 p-3 rounded-xl border border-brand-border">
                    <span className="font-bold">{item}</span>
                    <span className="text-[9px] bg-green-500/20 text-green-500 px-2.5 py-1 rounded-md border border-green-500/30 uppercase font-black tracking-widest">Mastered</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard glowColor="none" className="p-8">
              <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-red-500/20 text-red-500 w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/30">⚠</span> Weak Areas
              </h4>
              <ul className="space-y-4">
                {(stats.weakAreas.length ? stats.weakAreas : ['Time Management', 'Dynamic Programming', 'Logical Deduction']).map((item, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-center justify-between group bg-brand-bg/50 p-3 rounded-xl border border-brand-border">
                    <span className="font-bold">{item}</span>
                    <span className="text-[9px] bg-red-500/20 text-red-500 px-2.5 py-1 rounded-md border border-red-500/30 uppercase font-black tracking-widest">Focus Needed</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="xl:col-span-4 space-y-8">
          <GlassCard glowColor="none" className="p-8 h-full flex flex-col relative overflow-hidden border-brand-border/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-neon-cyan/10 blur-[80px] rounded-full" />
            
            <h3 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-cyan" /> Recommended Practice
            </h3>
            
            <div className="space-y-4 flex-1 relative z-10">
              {recommendedPractice.map((item) => (
                <PracticeItem
                  key={item.category}
                  category={item.category}
                  title={item.title}
                  subtitle={item.subtitle}
                  color={item.color as 'cyan' | 'purple' | 'blue'}
                />
              ))}
            </div>
            
            {/* AI Assistant Insight Bubble */}
            <div className="mt-8 relative z-10">
              <div className="p-6 bg-brand-bg/80 border border-brand-border rounded-2xl relative shadow-2xl backdrop-blur-md">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-cyan to-neon-purple rounded-l-2xl" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-black shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neon-cyan uppercase tracking-widest mb-2">AI Strategist Insight</p>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      "You've been crushing Javascript! Try tackling a hard Dynamic Programming problem today to boost your logic index."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: 'cyan' | 'purple' | 'blue' }) {
  const colors = {
    cyan: 'bg-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]',
    purple: 'bg-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.5)]',
    blue: 'bg-neon-blue shadow-[0_0_15px_rgba(0,71,255,0.5)]'
  };
  
  const textColors = {
    cyan: 'text-neon-cyan',
    purple: 'text-neon-purple',
    blue: 'text-neon-blue'
  };

  return (
    <GlassCard glowColor={color} className="p-8 cursor-pointer">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 mb-6", textColors[color])}>
        {icon}
      </div>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">{label}</p>
      <h3 className="text-4xl font-black text-white">{value}<span className="text-sm font-bold text-slate-600 ml-1">/100</span></h3>
      <div className="w-full h-1.5 bg-brand-bg rounded-full mt-6 overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors[color])}
        />
      </div>
    </GlassCard>
  );
}

function PracticeItem({ category, title, subtitle, color }: any) {
  const categoryColors = {
    cyan: 'text-neon-cyan',
    purple: 'text-neon-purple',
    blue: 'text-neon-blue'
  };

  return (
    <div className="p-5 bg-brand-sidebar border border-brand-border rounded-xl hover:border-white/20 transition-all cursor-pointer group shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className={cn("text-[10px] font-black uppercase tracking-widest", categoryColors[color as keyof typeof categoryColors])}>{category}</p>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
      </div>
      <p className="text-base text-white font-bold group-hover:text-neon-cyan transition-colors">{title}</p>
      <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>
    </div>
  );
}
