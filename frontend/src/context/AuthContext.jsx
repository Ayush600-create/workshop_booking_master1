import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // Ensure CSRF cookie is set before calling me
      await api.get('/csrf/');
      const res = await api.get('/me/');
      if (res.data.authenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/login/', { username, password });
      if (res.data.success) {
        await checkAuth();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout/');
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
