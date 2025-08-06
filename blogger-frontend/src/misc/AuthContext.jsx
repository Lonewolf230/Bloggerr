
import { authAPI } from "../api/axios";
import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const loadUserFromTokens = (firstTime) => {
    const accessToken = Cookies.get("accessToken");
    const idToken = Cookies.get("idToken");
    
    if (accessToken) {
      try {
        let username = null;
        let email = null;
        if (idToken) {
          const decodedToken = jwtDecode(idToken);
          username = decodedToken["cognito:username"];
          email = decodedToken['email'];
        }

        setCurrentUser({
          isAuthenticated: true,
          username,
          email,
          firstTime
        });
        return true;
      } catch (error) {
        console.error("Error decoding token:", error);
        setCurrentUser(null);
        return false;
      }
    } else {
      setCurrentUser(null);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      loadUserFromTokens();
      setLoading(false);
    };

    initAuth();
  }, []);
  
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    loadUserFromTokens(response.firstTime);
    return response;
  };
  
  const signup = async (email, password) => {
    return await authAPI.signup(email, password);
  };
  
  const verify = async (email, code) => {
    return await authAPI.verify(email, code);
  };
  
  const logout = async () => {
    try {
      await authAPI.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  // Added refresh user data function
  const refreshUserData = () => {
    return loadUserFromTokens();
  };
  
  const value = {
    currentUser,
    loading,
    login,
    signup,
    verify,
    logout,
    refreshUserData,
    isAuthenticated: !!currentUser?.isAuthenticated
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

