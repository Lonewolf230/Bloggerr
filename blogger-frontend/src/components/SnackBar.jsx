import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import axios from 'axios';
import { followAPI } from '../api/axios';

const Snackbar = ({ 
  message, 
  isOpen, 
  onClose, 
  type = 'success',
  duration = 5000, 
  hasUndo = false,
  undoEndpoint = null,
  undoPayload = null,
  undoCallback = null
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [timeoutId, setTimeoutId] = useState(null);

  // Update visibility when isOpen prop changes
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // Auto close after duration
      const id = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Allow time for exit animation
      }, duration);
      setTimeoutId(id);
    } else {
      setVisible(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, duration, onClose]);

  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#333';
    }
  };

  // Handle undo action
  const handleUndo = async () => {
    if (timeoutId) clearTimeout(timeoutId);
    
    try {
      // If undoEndpoint provided, make API call
      if (undoEndpoint=='follow') {
        // await axios.post(undoEndpoint, undoPayload);
        console.log('Undo operation:', undoPayload.username);
        await followAPI.followUser(undoPayload.username)
      }
      else if (undoEndpoint=='unfollow') {
        await followAPI.unfollowUser(undoPayload.username)
      }
      
      // If callback provided, call it
      if (undoCallback && typeof undoCallback === 'function') {
        undoCallback();
      }
      
      // Close snackbar
      setVisible(false);
      setTimeout(onClose, 300);
    } catch (error) {
      console.error('Error in undo operation:', error);
    }
  };

  // Handle close
  const handleClose = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: visible ? '20px' : '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '12px 24px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '80%',
        transition: 'bottom 0.3s ease-in-out',
      }}
    >
      <div style={{ marginRight: '20px' }}>{message}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {hasUndo && (
          <button
            onClick={handleUndo}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              marginRight: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.8rem'
            }}
          >
            UNDO
          </button>
        )}
        <MdClose 
          style={{ cursor: 'pointer', fontSize: '20px' }} 
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default Snackbar;