import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response?.isAuthenticated && response?.user) {
        setCurrentUser({ ...response.user, isAuthenticated: true });
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response?.user) {
        setCurrentUser({ ...response.user, isAuthenticated: true });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Refresh user data failed:", err);
      return false;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response?.user) {
        setCurrentUser({ ...response.user, isAuthenticated: true });
        setIsAuthenticated(true);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      return await authAPI.signup(email, password);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (email, code) => {
    setLoading(true);
    try {
      return await authAPI.verify(email, code);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await authAPI.deleteAccount();
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    verify,
    logout,
    deleteAccount,
    refreshUserData,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
