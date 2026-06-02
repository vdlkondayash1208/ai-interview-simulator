import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { Bot, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GlassCard, cn } from '../../components/ui/GlassCard';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(email, email.split('@')[0]);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 md:p-8 relative overflow-hidden text-slate-200">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-neon-cyan/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-purple/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 relative z-10 items-center">
        {/* Left Side - Animated Illustration */}
        <motion.div 
          className="hidden md:flex flex-col justify-center items-center text-center p-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan to-neon-purple rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700 animate-gradient" />
            <div className="relative bg-brand-sidebar border border-white/10 p-8 rounded-3xl">
              <Bot className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
            Future of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Interview Prep</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Experience the most realistic AI-driven mock interviews. Master your skills, land your dream job.
          </p>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GlassCard glowColor="purple" className="p-8 md:p-12 border-t border-l border-white/20 shadow-2xl backdrop-blur-2xl bg-brand-sidebar/40">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-400">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 relative group">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all placeholder:text-slate-600"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2 relative group">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <a href="#" className="text-xs text-neon-purple hover:text-neon-cyan transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-neon-purple transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-brand-border bg-brand-bg text-neon-purple focus:ring-neon-purple focus:ring-offset-brand-bg"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-400">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-neon-cyan font-bold hover:underline">
                Create one now
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
