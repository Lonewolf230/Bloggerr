

import { Navigate } from 'react-router-dom';
import { useAuth } from '../misc/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace={true}/>;
  }
  
  return children;
}

export default ProtectedRoute;