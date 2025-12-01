import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../App';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setIsAuthenticated(true);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (e) {
      // invalid token
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(loadUserFromStorage());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (tokenValue, userObj) => {
    if (tokenValue) localStorage.setItem('token', tokenValue);
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
    }
    setIsAuthenticated(!!tokenValue);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, validateToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
