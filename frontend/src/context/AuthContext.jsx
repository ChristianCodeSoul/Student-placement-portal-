import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get('/auth/profile')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    toast.success("You're logged in!");
    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const refreshProfile = async () => {
    const res = await api.get('/auth/profile');
    setUser(res.data);
    return res.data;
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
