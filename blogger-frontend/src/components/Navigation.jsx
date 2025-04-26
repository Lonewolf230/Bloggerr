import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile ({user.username})</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Login/Register</Link></li>
        )}
      </ul>
    </nav>
  );
}