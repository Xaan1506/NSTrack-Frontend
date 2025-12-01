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

const AppContent = () => {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-[rgb(3,7,18)] text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <ProgressProvider>
      <div
        className={`App min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
          }`}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={!isAuthenticated ? <LoginPage setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!isAuthenticated ? <SignupPage setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/forgot-password"
              element={!isAuthenticated ? <ForgotPasswordPage setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />}
            />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/friends" element={isAuthenticated ? <FriendsPage /> : <Navigate to="/login" />} />
            <Route path="/language/:lang" element={isAuthenticated ? <LanguagePage /> : <Navigate to="/login" />} />
            <Route path="/roadmap" element={isAuthenticated ? <RoadmapPage /> : <Navigate to="/login" />} />
            <Route path="/problems" element={isAuthenticated ? <ProblemsPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
