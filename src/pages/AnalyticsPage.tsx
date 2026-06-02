import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Award, Target, AlertTriangle, CheckCircle2, Zap, ArrowRight, BrainCircuit, MessageSquare
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { cn, GlassCard } from '../components/ui/GlassCard';

export default function AnalyticsPage() {
  const { stats } = useProgress();

  const skillData = [
    { subject: 'Aptitude', A: stats.aptitude, fullMark: 100 },
    { subject: 'Programming', A: stats.programming, fullMark: 100 },
    { subject: 'Communication', A: stats.communication, fullMark: 100 },
    { subject: 'Logic', A: 75, fullMark: 100 },
    { subject: 'Verbal', A: 82, fullMark: 100 },
    { subject: 'Confidence', A: 68, fullMark: 100 },
  ];

  const accuracyData = [
    { name: 'Mon', accuracy: 65 },
    { name: 'Tue', accuracy: 72 },
    { name: 'Wed', accuracy: 68 },
    { name: 'Thu', accuracy: 85 },
    { name: 'Fri', accuracy: 78 },
    { name: 'Sat', accuracy: 92 },
    { name: 'Sun', accuracy: 88 },
  ];

  const readinessScore = Math.round(((stats?.aptitude || 85) + (stats?.programming || 92) + (stats?.communication || 78)) / 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Analytics</span></h1>
          <p className="text-slate-400 text-lg">Biological and logical prep metrics extracted from your sessions.</p>
        </div>
        <div className="bg-neon-purple/20 border border-neon-purple/50 px-6 py-3 rounded-xl text-neon-purple font-bold flex items-center gap-3 shadow-[0_0_20px_rgba(176,38,255,0.4)] active:scale-95 transition-all cursor-pointer">
          <Target className="w-6 h-6" /> <span className="text-lg">{readinessScore}% Readiness Index</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart: Skill Balance */}
        <GlassCard glowColor="purple" className="p-8 relative overflow-hidden">
           <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-2">
             <BrainCircuit className="w-6 h-6 text-neon-purple" /> Performance Matrix
           </h3>
           <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em' }} />
                    <Radar name="Skills" dataKey="A" stroke="#b026ff" strokeWidth={3} fill="url(#colorPurple)" fillOpacity={0.5} />
                    <defs>
                      <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b026ff" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#b026ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(176,38,255,0.5)', backgroundColor: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: '14px', backdropFilter: 'blur(10px)' }} itemStyle={{ color: '#b026ff', fontWeight: 'bold' }} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon-purple/5 blur-[100px] rounded-full pointer-events-none" />
        </GlassCard>

        {/* Line Chart: Accuracy Trend */}
        <GlassCard glowColor="cyan" className="p-8">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
               <TrendingUp className="w-6 h-6 text-neon-cyan" /> Accuracy Trajectory
             </h3>
             <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/30">
               <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active</span>
             </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,240,255,0.5)', backgroundColor: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: '14px', backdropFilter: 'blur(10px)' }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#00f0ff" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#0f172a', stroke: '#00f0ff' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#00f0ff', shadow: '0 0 15px #00f0ff' }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <StatsBox title="Weak Areas" items={stats.weakAreas} icon={AlertTriangle} color="text-red-500" bg="bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
         <StatsBox title="Mastered Areas" items={stats.strengths} icon={CheckCircle2} color="text-green-500" bg="bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" />
         
         <div className="bg-gradient-to-br from-neon-purple to-neon-blue p-8 rounded-[32px] text-white flex flex-col justify-between shadow-[0_0_30px_rgba(0,71,255,0.4)] group relative overflow-hidden">
            <div className="relative z-10">
               <Zap className="w-10 h-10 mb-6 fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
               <h3 className="text-2xl font-black mb-3 tracking-tight">AI Strategy Insight</h3>
               <p className="text-white/90 text-sm leading-relaxed font-bold">Focus on System Design and logical concurrency problems to bridge the current gap in your logic index.</p>
            </div>
            <button className="relative z-10 flex items-center gap-2 font-black text-xs uppercase tracking-widest bg-white text-black w-fit px-6 py-3 rounded-xl mt-8 hover:bg-slate-200 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]">
               Execute Roadmap <ArrowRight className="w-4 h-4" />
            </button>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
         </div>
      </div>

      {/* Recommended Topics Table-like view */}
      <GlassCard glowColor="none" className="p-8">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">Subject Breakdown</h3>
            <button className="text-xs font-black text-neon-cyan uppercase tracking-widest hover:text-white transition-colors bg-neon-cyan/10 px-4 py-2 rounded-lg">View All Details</button>
         </div>
         <div className="space-y-4">
            <BreakdownRow title="Quantitative Aptitude" score={stats.aptitude || 85} trend="up" icon={BrainCircuit} color="cyan" />
            <BreakdownRow title="Programming Concepts" score={stats.programming || 92} trend="up" icon={TrendingUp} color="purple" />
            <BreakdownRow title="Behavioral Skills" score={stats.communication || 78} trend="up" icon={MessageSquare} color="blue" />
         </div>
      </GlassCard>
    </div>
  );
}

function StatsBox({ title, items, icon: Icon, color, bg }: any) {
  return (
    <GlassCard glowColor="none" className="p-8 flex flex-col h-full border-none shadow-none bg-brand-bg/50">
       <div className={cn("inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl w-fit border", bg)}>
          <Icon className={cn("w-4 h-4", color)} />
          <span className={cn("text-[10px] font-black uppercase tracking-widest", color)}>{title}</span>
       </div>
       <ul className="space-y-4 flex-1">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-center justify-between group p-3 rounded-xl bg-brand-sidebar border border-brand-border">
               <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{item}</span>
               <div className={cn("w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] transition-colors", color)} />
            </li>
          ))}
       </ul>
    </GlassCard>
  );
}

function BreakdownRow({ title, score, trend, icon: Icon, color }: any) {
  const colors = {
    cyan: 'bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)] text-neon-cyan',
    purple: 'bg-neon-purple shadow-[0_0_10px_rgba(176,38,255,0.5)] text-neon-purple',
    blue: 'bg-neon-blue shadow-[0_0_10px_rgba(0,71,255,0.5)] text-neon-blue'
  };

  return (
    <div className="flex items-center justify-between p-6 bg-brand-sidebar rounded-2xl border border-brand-border group hover:border-white/20 transition-all">
       <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
            <Icon className={cn("w-6 h-6", colors[color as keyof typeof colors].split(' ')[2])} />
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white text-lg tracking-tight">{title}</h5>
            <div className="flex items-center gap-4">
               <div className="w-48 h-2 bg-brand-bg rounded-full overflow-hidden border border-white/5">
                  <div className={cn("h-full rounded-full transition-all duration-1000", colors[color as keyof typeof colors].split(' ')[0], colors[color as keyof typeof colors].split(' ')[1])} style={{ width: `${score}%` }} />
               </div>
               <span className="text-xs font-black text-slate-400 tabular-nums">{score}%</span>
            </div>
          </div>
       </div>
       <div className="text-right">
          <div className={cn("text-sm font-black flex items-center gap-1 justify-end", trend === 'up' ? "text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]")}>
            {trend === 'up' ? "+8.2%" : "-3.1%"}
            <TrendingUp className={cn("w-4 h-4", trend === 'down' && "rotate-180")} />
          </div>
          <p className="text-[10px] uppercase font-black text-slate-500 mt-2 tracking-widest">W/W Change</p>
       </div>
    </div>
  );
}
