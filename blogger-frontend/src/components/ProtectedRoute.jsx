

import { Navigate } from 'react-router-dom';
import { useAuth } from '../misc/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state if auth is still being determined
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace={true}/>;
  }
  
  // Render children if authenticated
  return children;
}

export default ProtectedRoute;