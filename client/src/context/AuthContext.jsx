// File: src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchDashboardUser } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetchDashboardUser();
        if (res.user) setUser(res.user);
      } catch (err) {
        if (import.meta.env.DEV) console.log('Not logged in');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
