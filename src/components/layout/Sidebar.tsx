import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Code2, 
  Video, 
  BarChart3, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { cn } from '../ui/GlassCard';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BrainCircuit, label: 'Aptitude Round', path: '/aptitude' },
  { icon: Code2, label: 'Programming Round', path: '/programming' },
  { icon: Video, label: 'Face Interview', path: '/interview' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Resume Analyzer', path: '/resume' },
];

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className={cn(
        "h-screen bg-brand-sidebar border-r border-brand-border flex flex-col transition-all duration-300 z-50 relative overflow-hidden",
        !isOpen && "items-center"
      )}
    >
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-20%] w-[140%] h-[50%] bg-neon-cyan/5 blur-[120px] rounded-full" />
      </div>

      <div className="p-6 flex items-center justify-between relative z-10">
        {isOpen && (
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              AI
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-sans">
              Interview<span className="text-neon-cyan">Planner</span>
            </span>
          </Link>
        )}
        <button 
          onClick={toggle}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto relative z-10 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden",
                isActive 
                  ? "text-white" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-white/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 relative z-10", isActive ? "text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "group-hover:text-neon-cyan")} />
              {isOpen && <span className="font-medium relative z-10">{item.label}</span>}
              {!isOpen && (
                <div className="absolute left-20 bg-brand-sidebar text-white border border-brand-border px-3 py-1.5 rounded-md text-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-2xl backdrop-blur-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {isOpen && user && (
        <div className="p-4 border-t border-brand-border relative z-10">
           <div className="flex items-center gap-3 glass-panel p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple p-[2px]">
                <div className="w-full h-full bg-brand-sidebar rounded-full flex items-center justify-center font-bold text-white text-xs overflow-hidden">
                  {user.name?.[0] || 'U'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name || 'User'}</p>
                <p className="text-[10px] text-neon-cyan uppercase tracking-widest truncate">{user.careerGoal || 'Professional'}</p>
              </div>
              <button 
                onClick={logout}
                className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      )}
      
      {!isOpen && (
        <div className="p-4 border-t border-brand-border flex justify-center relative z-10">
          <button
            onClick={logout}
            className="p-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.aside>
  );
}
