// Authentication context for login, registration, and persistent localStorage sessions.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'smartflashcard_auth';

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    initialized: false
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);

    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthState({
          user: parsedAuth.user || null,
          token: parsedAuth.token || null,
          initialized: true
        });
        return;
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setAuthState((currentState) => ({
      ...currentState,
      initialized: true
    }));
  }, []);

  const persistAuth = (payload) => {
    const nextAuth = {
      user: {
        id: payload._id,
        name: payload.name,
        email: payload.email
      },
      token: payload.token
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuthState({
      user: nextAuth.user,
      token: nextAuth.token,
      initialized: true
    });
  };

  const login = (payload) => persistAuth(payload);
  const register = (payload) => persistAuth(payload);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      user: null,
      token: null,
      initialized: true
    });
  };

  const value = useMemo(() => ({
    user: authState.user,
    token: authState.token,
    isAuthenticated: Boolean(authState.token),
    initialized: authState.initialized,
    login,
    register,
    logout
  }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
