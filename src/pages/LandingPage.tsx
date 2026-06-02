import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ShieldCheck, Code2, Video, Rocket, ArrowRight, Zap, Target, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 selection:bg-indigo-500/30 selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-[#0B0F1A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Interview Planner</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white px-4 py-2 transition-colors">Login</Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Master your interview readiness</span>
            </div>
            <h1 className="text-6xl md:text-[5.5rem] font-bold text-white tracking-tighter leading-[1.05] max-w-5xl mx-auto">
              Master your <span className="text-indigo-500">Career Rounds</span> <br />
              with AI-Powered Precision.
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The ultimate preparation engine for your next big break. Personalized roadmaps, real-time feedback, and hyper-realistic simulations.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started for Free <Rocket className="w-5 h-5" />
              </Link>
              <button className="px-10 py-4 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">
                View Roadmap
              </button>
            </div>
          </motion.div>
        </div>

        {/* Deep Indigo Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0">
          <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-[#0B0F1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Built for modern prep.</h2>
             <p className="text-slate-400 max-w-xl mx-auto">A comprehensive suite of tools designed to cover every technical and behavioral aspect of your interview.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BrainCircuit}
              title="Aptitude Mastery"
              desc="Practice 10,000+ top-tier questions. Real-time accuracy metrics and speed logic tests."
            />
            <FeatureCard 
              icon={Code2}
              title="Real-time Coding"
              desc="Solve industry problems in our high-performance IDE with AI analysis."
            />
            <FeatureCard 
              icon={Video}
              title="AI Face Interview"
              desc="Hyper-realistic rounds with confidence sensing, eye-contact tracking, and vocal analysis."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Corporate Guard"
              desc="Tab-switching alerts and strict monitoring to simulate real-world company conditions."
            />
            <FeatureCard 
              icon={Target}
              title="Ready-Score™ Dashboard"
              desc="Proprietary algorithm that calculates your hiring probability across top companies."
            />
            <FeatureCard 
              icon={Zap}
              title="Resume AI Scanner"
              desc="Scan your profile against industry standards to instantly identify skill gaps."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm transition-all group hover:bg-slate-800/50 hover:border-indigo-500/30 shadow-xl shadow-black/20"
    >
      <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-600/20 transition-all">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
