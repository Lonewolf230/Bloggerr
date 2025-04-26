// import { authAPI } from "../api/axios";
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import Cookies from 'js-cookie';
// import {jwtDecode} from "jwt-decode"

// // Create authentication context
// const AuthContext = createContext();

// // Custom hook to use the auth context
// export const useAuth = () => useContext(AuthContext);

// // Provider component
// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // Check if user is authenticated on mount
//   // useEffect(() => {
//   //   const initAuth = async () => {
//   //     const accessToken = Cookies.get('accessToken')
//   //     const idToken=Cookies.get('idToken')
//   //     if (accessToken) {
//   //       // Here you would typically fetch the user profile
//   //       // For now, we'll just set a basic user object
//   //       setCurrentUser({
//   //         isAuthenticated: true,
//   //       });
//   //     }
//   //     setLoading(false);
//   //   };
    
//   //   initAuth();
//   // }, []);

//   useEffect(() => {
//     const initAuth = async () => {
//       const accessToken = Cookies.get("accessToken"); // Check if accessToken exists
//       const idToken = Cookies.get("idToken"); // Fetch idToken for username
      
//       if (accessToken) {
//         try {
//           let username = null;
//           let email=null
//           if (idToken) {
//             const decodedToken = jwtDecode(idToken);
//             console.log(decodedToken)
//             username = decodedToken["cognito:username"]; // Extract username
//             email=decodedToken['email']
//           }


//           setCurrentUser({
//             isAuthenticated: true,
//             username,
//             email // Store username
//           });
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           setCurrentUser(null);
//         }
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);
  
//   // Auth methods
//   const login = async (email, password) => {
//     const response = await authAPI.login(email, password);
//     setCurrentUser({
//       isAuthenticated: true,
//       // Add more user details if available from the response
//     });
//     return response;
//   };
  
//   const signup = async (email, password) => {
//     return await authAPI.signup(email, password);
//   };
  
//   const verify = async (email, code) => {
//     return await authAPI.verify(email, code);
//   };
  
//   const logout = async () => {
//     await authAPI.logout();
//     setCurrentUser(null);
//   };
  
//   const value = {
//     currentUser,
//     loading,
//     login,
//     signup,
//     verify,
//     logout,
//     isAuthenticated: !!currentUser?.isAuthenticated
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };



// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is authenticated on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       const accessToken = Cookies.get("accessToken"); // Check if accessToken exists
//       const idToken = Cookies.get("idToken"); // Fetch idToken for username
      
//       if (accessToken) {
//         try {
//           let username = null;
//           if (idToken) {
//             const decodedToken = jwtDecode(idToken);
//             username = decodedToken["cognito:username"]; // Extract username
//           }

//           setCurrentUser({
//             isAuthenticated: true,
//             username, // Store username
//           });
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           setCurrentUser(null);
//         }
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   // Auth methods
//   const login = async (email, password) => {
//     const response = await authAPI.login(email, password);
//     let username = null;
//     if (response.data.idToken) {
//       const decodedToken = jwtDecode(response.data.idToken);
//       console.log(decodedToken)
//       username = decodedToken["cognito:username"];
//     }

//     setCurrentUser({
//       isAuthenticated: true,
//       username,
//     });

//     return response;
//   };

//   const signup = async (email, password) => {
//     return await authAPI.signup(email, password);
//   };

//   const verify = async (email, code) => {
//     return await authAPI.verify(email, code);
//   };

//   const logout = async () => {
//     await authAPI.logout();
//     Cookies.remove("idToken");
//     Cookies.remove("accessToken");
//     setCurrentUser(null);
//   };

//   const value = {
//     currentUser,
//     loading,
//     login,
//     signup,
//     verify,
//     logout,
//     isAuthenticated: !!currentUser?.isAuthenticated,
//     username: currentUser?.username || null, // Expose username
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

import { authAPI } from "../api/axios";
import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Create authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const loadUserFromTokens = () => {
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
          email
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
  
  // Auth methods
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    loadUserFromTokens();
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
      // We don't need to navigate here - let the component handle that
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

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate() // Add useNavigate here
  
//   const loadUserFromTokens = () => {
//     const accessToken = Cookies.get("accessToken");
//     const idToken = Cookies.get("idToken");
    
//     if (accessToken && idToken) {
//       try {
//         const decodedToken = jwtDecode(idToken);
//         const username = decodedToken["cognito:username"];
//         const email = decodedToken['email'];

//         setCurrentUser({
//           isAuthenticated: true,
//           username,
//           email
//         });
//         return true;
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         // Clean up invalid tokens
//         Cookies.remove('accessToken');
//         Cookies.remove('idToken');
//         Cookies.remove('refreshToken');
//         setCurrentUser(null);
//         return false;
//       }
//     } else {
//       setCurrentUser(null);
//       return false;
//     }
//   };

//   useEffect(() => {
//     loadUserFromTokens();
//     setLoading(false);
//   }, []);
  
//   // Auth methods
//   const login = async (email, password) => {
//     try {
//       const response = await authAPI.login(email, password);
//       const success = loadUserFromTokens();
//       if (success) {
//         navigate('/home', { replace: true });
//       }
//       return response;
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   };
  
//   const logout = async () => {
//     try {
//       await authAPI.logout();
//       setCurrentUser(null);
//       navigate('/', { replace: true });
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Even if logout API fails, clear local state
//       Cookies.remove('accessToken');
//       Cookies.remove('idToken');
//       Cookies.remove('refreshToken');
//       setCurrentUser(null);
//       navigate('/', { replace: true });
//     }
//   };
  
//   // Other methods...
  
//   const value = {
//     currentUser,
//     loading,
//     login,
//     signup,
//     verify,
//     logout,
//     refreshUserData,
//     isAuthenticated: !!currentUser?.isAuthenticated
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };