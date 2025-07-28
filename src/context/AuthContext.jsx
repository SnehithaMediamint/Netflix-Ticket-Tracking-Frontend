import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedName = localStorage.getItem('name');

    if (storedToken && storedRole && storedName) {
      try {
        return {
          token: storedToken,
          role: parseInt(storedRole), // Ensure role is parsed
          name: storedName,
        };
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        return null; // Clear if parsing fails
      }
    }
    return null;
  });

  // Update localStorage when user state changes (optional, can be done in login/logout)
  useEffect(() => {
    if (user) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('role', user.role.toString());
      localStorage.setItem('name', user.name);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    // localStorage updates are handled by useEffect or can be explicit here as well
  };

  const logout = () => {
    setUser(null);
    // localStorage removals are handled by useEffect or can be explicit here as well
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);