import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, CareerGoal } from '../../context/AuthContext';
import { BrainCircuit, CheckCircle2, ArrowRight, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils/utils';

const goals: CareerGoal[] = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'AI Engineer',
  'DevOps Engineer',
  'Mechanical Engineer',
  'MBA HR',
  'MBA Finance',
  'Government Exams'
];

export default function GoalSelectionPage() {
  const { user, setGoal } = useAuth();
  const [selected, setSelected] = useState<CareerGoal | null>(null);
  const navigate = useNavigate();

  const handleComplete = () => {
    if (selected) {
      setGoal(selected);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full pt-12 pb-24">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-blue-500/40">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white mb-4">Hello, {user?.name}!</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">Select your career goal to personalize your roadmap.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {goals.map((goal) => (
            <button
              key={goal}
              onClick={() => setSelected(goal)}
              className={cn(
                "p-6 rounded-3xl border-2 text-left transition-all relative group",
                selected === goal 
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20" 
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-[#111]"
              )}
            >
              {selected === goal && (
                <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-blue-600" />
              )}
              <span className={cn(
                "font-bold text-lg block mb-1",
                selected === goal ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
              )}>
                {goal}
              </span>
              <span className="text-sm text-gray-500">Track specialized path</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleComplete}
            disabled={!selected}
            className="group inline-flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-2xl text-xl font-black shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all"
          >
            Finish Setup <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
