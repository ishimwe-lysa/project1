import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sbtms_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sbtms_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then((r) => { setUser({ ...r.data }); localStorage.setItem('sbtms_user', JSON.stringify(r.data)); })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const persist = (token, u) => {
    localStorage.setItem('sbtms_token', token);
    localStorage.setItem('sbtms_user', JSON.stringify(u));
    setUser(u);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  };
  const adminLogin = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  };
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data.token, data.user);
    return data.user;
  };
  const logout = () => {
    localStorage.removeItem('sbtms_token');
    localStorage.removeItem('sbtms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
