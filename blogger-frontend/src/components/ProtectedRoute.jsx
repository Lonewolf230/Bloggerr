

// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../misc/AuthContext';

// function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading) {
//     return <div>Loading...</div>;
//   }
  
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace={true}/>;
//   }
  
//   return children;
// }

// export default ProtectedRoute;

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../misc/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // Only check if we haven't checked before and aren't currently authenticated
      if (!hasChecked && !isAuthenticated) {
        await checkAuthStatus();
        setHasChecked(true);
      }
    };

    verifyAuth();
  }, [checkAuthStatus, isAuthenticated, hasChecked]);

  // Show loading while checking authentication or during auth operations
  if (loading || (!hasChecked && !isAuthenticated)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated after checking, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace={true} />;
  }

  return children;
}

export default ProtectedRoute;