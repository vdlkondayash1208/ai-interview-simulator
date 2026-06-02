import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../ui/GlassCard';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-brand-border bg-brand-bg/50 backdrop-blur-xl flex items-center justify-between px-6 z-40 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-neon-cyan hover:bg-white/5 rounded-xl transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative max-w-md w-full hidden md:block group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-neon-cyan transition-colors" />
            <input 
              type="text" 
              placeholder="Search AI insights, resources, history..." 
              className="w-full bg-brand-sidebar border border-brand-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-neon-purple transition-colors group">
          <div className="absolute inset-0 bg-neon-purple/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
          <Bell className="w-5 h-5 relative z-10" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)] z-10"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-brand-border/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white tracking-tight">{user?.name || 'Guest User'}</p>
            <p className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple uppercase tracking-widest font-bold">Premium Pro</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center border-2 border-brand-border">
              <span className="text-white font-bold text-sm">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
