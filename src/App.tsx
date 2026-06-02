import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import GoalSelectionPage from './pages/auth/GoalSelectionPage';
import Dashboard from './pages/Dashboard';
import AptitudeRound from './pages/rounds/AptitudeRound';
import ProgrammingRound from './pages/rounds/ProgrammingRound';
import FaceInterviewRound from './pages/rounds/FaceInterviewRound';
import AnalyticsPage from './pages/AnalyticsPage';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MainLayout from './components/layout/MainLayout';
import { AnimatePresence } from 'motion/react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && !user?.careerGoal && location.pathname !== '/select-goal') {
    return <Navigate to="/select-goal" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Semi-Protected Routes */}
        <Route 
          path="/select-goal" 
          element={
            <ProtectedRoute>
              <GoalSelectionPage />
            </ProtectedRoute>
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aptitude"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AptitudeRound />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/programming"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProgrammingRound />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FaceInterviewRound />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AnalyticsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ResumeAnalyzer />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
