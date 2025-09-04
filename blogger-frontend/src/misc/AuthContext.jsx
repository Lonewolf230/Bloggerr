

// import React, { createContext, useState, useContext, useRef } from 'react';
// import { authAPI } from "../api/axios";

// const AuthContext = createContext();

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [loading, setLoading] = useState(false); // Start with false to avoid initial API call
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const hasCheckedAuth = useRef(false);

//     // Only check auth when actually needed (called by ProtectedRoute)
//     const checkAuthStatus = async () => {
//         if (hasCheckedAuth.current) {
//             return isAuthenticated; // Return current state if already checked
//         }
        
//         try {
//             setLoading(true);
//             const response = await authAPI.checkAuth();
            
//             if (response.isAuthenticated && response.user) {
//                 setCurrentUser({
//                     ...response.user,
//                     isAuthenticated: true
//                 });
//                 setIsAuthenticated(true);
//                 hasCheckedAuth.current = true;
//                 return true;
//             } else {
//                 setCurrentUser(null);
//                 setIsAuthenticated(false);
//                 hasCheckedAuth.current = true;
//                 return false;
//             }
//         } catch (error) {
//             console.error("Auth check failed:", error);
//             setCurrentUser(null);
//             setIsAuthenticated(false);
//             hasCheckedAuth.current = true;
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (email, password) => {
//         try {
//             setLoading(true);
//             const response = await authAPI.login(email, password);
            
//             if (response.user) {
//                 setCurrentUser({
//                     ...response.user,
//                     isAuthenticated: true
//                 });
//                 setIsAuthenticated(true);
//                 hasCheckedAuth.current = true; // Mark as checked after successful login
//             }
            
//             return response;
//         } catch (error) {
//             setCurrentUser(null);
//             setIsAuthenticated(false);
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const signup = async (email, password) => {
//         setLoading(true);
//         try {
//             return await authAPI.signup(email, password);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verify = async (email, code) => {
//         setLoading(true);
//         try {
//             return await authAPI.verify(email, code);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const logout = async () => {
//         try {
//             setLoading(true);
//             await authAPI.logout();
//         } catch (error) {
//             console.error("Logout error:", error);
//         } finally {
//             setCurrentUser(null);
//             setIsAuthenticated(false);
//             hasCheckedAuth.current = false; // Reset auth check flag
//             setLoading(false);
//         }
//     };

//     const deleteAccount = async () => {
//         try {
//             setLoading(true);
//             await authAPI.deleteAccount();
//         } catch (error) {
//             console.error("Delete account error:", error);
//             throw error;
//         } finally {
//             setCurrentUser(null);
//             setIsAuthenticated(false);
//             hasCheckedAuth.current = false;
//             setLoading(false);
//         }
//     };

//     // Refresh user data by checking with server
//     const refreshUserData = async () => {
//         try {
//             setLoading(true);
//             const response = await authAPI.getCurrentUser();
            
//             if (response.user) {
//                 setCurrentUser({
//                     ...response.user,
//                     isAuthenticated: true
//                 });
//                 setIsAuthenticated(true);
//                 hasCheckedAuth.current = true;
//                 return true;
//             } else {
//                 setCurrentUser(null);
//                 setIsAuthenticated(false);
//                 hasCheckedAuth.current = true;
//                 return false;
//             }
//         } catch (error) {
//             console.error("Refresh user data error:", error);
//             setCurrentUser(null);
//             setIsAuthenticated(false);
//             hasCheckedAuth.current = true;
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const value = {
//         currentUser,
//         loading,
//         isAuthenticated,
//         login,
//         signup,
//         verify,
//         logout,
//         deleteAccount,
//         refreshUserData,
//         checkAuthStatus
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

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

  // 🔹 Check backend if session is valid
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

  // 🔹 Fetch fresh user data manually
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

  // 🔹 Auth actions
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

  // 🔹 Run only once on mount
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
