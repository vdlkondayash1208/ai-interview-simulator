import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, ArrowRight, ArrowLeft, Target, Briefcase, Zap, Code2 } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      signup(email, name);
      navigate('/select-goal'); // Go to more detailed goal selection or directly dashboard
    }, 1500);
  };

  const goals = [
    { id: 'swe', title: 'Software Engineering', icon: <Code2 className="w-6 h-6 text-neon-cyan" /> },
    { id: 'data', title: 'Data Science & AI', icon: <Target className="w-6 h-6 text-neon-purple" /> },
    { id: 'product', title: 'Product Management', icon: <Briefcase className="w-6 h-6 text-neon-blue" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 md:p-8 relative overflow-hidden text-slate-200">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-neon-purple/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-neon-cyan/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-neon-cyan shadow-[0_0_10px_#00f0ff]"></div>
             <div className={`w-3 h-3 rounded-full transition-all ${step >= 2 ? 'bg-neon-purple shadow-[0_0_10px_#b026ff]' : 'bg-brand-border'}`}></div>
             <div className={`w-3 h-3 rounded-full transition-all ${step >= 3 ? 'bg-neon-blue shadow-[0_0_10px_#0047ff]' : 'bg-brand-border'}`}></div>
          </div>
        </div>

        <GlassCard glowColor="cyan" className="p-8 md:p-10 border-t border-l border-white/20 shadow-2xl backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-slate-400">Join the elite AI interview prep platform</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2 relative group">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-bg/50 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-bg/50 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={!name || !email}
                  className="w-full bg-white text-brand-bg font-bold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Select Primary Goal</h2>
                  <p className="text-slate-400">Tailor your interview experience</p>
                </div>

                <div className="grid gap-4">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        goal === g.id 
                          ? 'border-neon-purple bg-neon-purple/10' 
                          : 'border-brand-border hover:border-slate-600 bg-brand-bg/50'
                      }`}
                    >
                      <div className="p-3 bg-brand-bg rounded-lg border border-brand-border">
                        {g.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white">{g.title}</h3>
                        <p className="text-xs text-slate-400">Target roles in {g.title}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="w-1/3 border border-brand-border text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-border/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!goal || isLoading}
                    className="w-2/3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Finish Setup'} <Zap className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 && (
            <div className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-neon-cyan font-bold hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
