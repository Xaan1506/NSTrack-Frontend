import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import FriendsPage from './pages/FriendsPage';
import LanguagePage from './pages/LanguagePage';
import RoadmapPage from './pages/RoadmapPage';
import ProblemsPage from './pages/ProblemsPage';
import ProfilePage from './pages/ProfilePage';
import BubbleGame from './pages/BubbleGame';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Resolve backend URL with runtime override support:
// Priority:
// 1. window._env_.REACT_APP_BACKEND_URL (set at runtime by /env.js)
// 2. window.REACT_APP_BACKEND_URL (older conventions)
// 3. build-time process.env.REACT_APP_BACKEND_URL
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    if (window._env_ && window._env_.REACT_APP_BACKEND_URL) {
      return window._env_.REACT_APP_BACKEND_URL;
    }
    if (window.REACT_APP_BACKEND_URL) {
      return window.REACT_APP_BACKEND_URL;
    }
  }
  return process.env.REACT_APP_BACKEND_URL || '';
};

const BACKEND_URL = getBackendUrl();
// Normalize and expose API base (keeps previous behavior of `${BACKEND_URL}/api`)
const normalizedBackend = BACKEND_URL ? BACKEND_URL.replace(/\/+$/, '') : '';
export const API = normalizedBackend ? `${normalizedBackend}/api` : '';
console.log('Backend URL (resolved):', BACKEND_URL);


export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-[rgb(3,7,18)] text-white' : 'bg-white text-gray-900'}`}>
      <div className="text-cyan-400 text-xl">Loading...</div>
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { theme } = useTheme();

  // AppContent no longer keeps top-level auth state; routing uses RequireAuth

  return (
    <ProgressProvider>
      <div
        className={`App min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
          }`}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/friends" element={<RequireAuth><FriendsPage /></RequireAuth>} />
            <Route path="/language/:lang" element={<RequireAuth><LanguagePage /></RequireAuth>} />
            <Route path="/roadmap" element={<RequireAuth><RoadmapPage /></RequireAuth>} />
            <Route path="/problems" element={<RequireAuth><ProblemsPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

            <Route path="/bubble-game" element={<BubbleGame />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" theme={theme === 'dark' ? 'dark' : 'light'} />
      </div>
    </ProgressProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
