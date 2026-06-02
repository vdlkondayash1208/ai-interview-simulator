import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initStorage, storage } from '../utils/storage';

export type CareerGoal = 
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Data Analyst'
  | 'AI Engineer'
  | 'DevOps Engineer'
  | 'Mechanical Engineer'
  | 'MBA HR'
  | 'MBA Finance'
  | 'Government Exams';

interface UserStats {
  xp: number;
  streak: number;
  readinessScore: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  careerGoal?: CareerGoal;
  avatar?: string;
  stats?: UserStats;
  history?: any[];
  weakTopics?: string[];
  skills?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  signup: (email: string, name: string) => void;
  setGoal: (goal: CareerGoal) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize mock database if empty
    initStorage();
    
    const saved = localStorage.getItem('ai_interview_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_interview_user', JSON.stringify(user));
      // Save full profile to DB
      storage.saveUser(user);
    } else {
      localStorage.removeItem('ai_interview_user');
    }
  }, [user]);

  const login = (email: string, name: string) => {
    const users = storage.getUsers();
    const existing = users.find((u: any) => u.email === email);
    
    if (existing) {
      setUser(existing);
    } else {
      // Create new
      const newUser: User = { 
        id: Math.random().toString(36).substr(2, 9), 
        email, 
        name,
        stats: { xp: 0, streak: 0, readinessScore: 0 },
        history: [],
        weakTopics: [],
        skills: []
      };
      setUser(newUser);
    }
  };

  const signup = (email: string, name: string) => {
    login(email, name);
  };

  const setGoal = (goal: CareerGoal) => {
    if (user) {
      setUser({ ...user, careerGoal: goal });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_interview_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, setGoal, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
