import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ScoreData {
  aptitude: number;
  programming: number;
  communication: number;
  totalInterviews: number;
  streak: number;
  weakAreas: string[];
  strengths: string[];
  lastUpdate: string;
}

interface ProgressContextType {
  stats: ScoreData;
  updateStats: (newStats: Partial<ScoreData>) => void;
  addInterviewResult: (type: 'aptitude' | 'programming' | 'face', score: number) => void;
}

const defaultStats: ScoreData = {
  aptitude: 0,
  programming: 0,
  communication: 0,
  totalInterviews: 0,
  streak: 0,
  weakAreas: ['Time Management', 'Dynamic Programming', 'Logical Deduction'],
  strengths: ['Communication', 'Data Structures', 'Verbal Ability'],
  lastUpdate: new Date().toISOString(),
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<ScoreData>(() => {
    const saved = localStorage.getItem('ai_interview_stats');
    return saved ? JSON.parse(saved) : defaultStats;
  });

  useEffect(() => {
    localStorage.setItem('ai_interview_stats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (newStats: Partial<ScoreData>) => {
    setStats(prev => ({ ...prev, ...newStats, lastUpdate: new Date().toISOString() }));
  };

  const addInterviewResult = (type: 'aptitude' | 'programming' | 'face', score: number) => {
    setStats(prev => {
      const updated = { ...prev };
      if (type === 'aptitude') updated.aptitude = Math.round((prev.aptitude + score) / (prev.aptitude === 0 ? 1 : 2));
      if (type === 'programming') updated.programming = Math.round((prev.programming + score) / (prev.programming === 0 ? 1 : 2));
      if (type === 'face') updated.communication = Math.round((prev.communication + score) / (prev.communication === 0 ? 1 : 2));
      updated.totalInterviews += 1;

      const strengths = new Set(updated.strengths);
      const weakAreas = new Set(updated.weakAreas);

      const updateCategory = (category: string, isStrong: boolean) => {
        if (isStrong) {
          weakAreas.delete(category);
          strengths.add(category);
        } else {
          strengths.delete(category);
          weakAreas.add(category);
        }
      };

      if (type === 'aptitude') {
        updateCategory('Quantitative Aptitude', updated.aptitude >= 70);
      }
      if (type === 'programming') {
        updateCategory('Programming Concepts', updated.programming >= 70);
      }
      if (type === 'face') {
        updateCategory('Communication', updated.communication >= 70);
      }

      updated.strengths = Array.from(strengths);
      updated.weakAreas = Array.from(weakAreas);
      return updated;
    });
  };

  return (
    <ProgressContext.Provider value={{ stats, updateStats, addInterviewResult }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
