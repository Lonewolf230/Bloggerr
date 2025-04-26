import React, { useState, createContext, useContext } from 'react';
import Toast from '../components/Toast';
// Create a context for the toast
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a toast
  const showToast = (message, type = 'info', duration = 3000, position = 'top-right') => {
    const id = Date.now(); // Unique ID for each toast
    setToasts((prev) => [...prev, { id, message, type, duration, position }]);

    // Remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration + 300); // Account for animation delay
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
      ))}
    </ToastContext.Provider>
  );
};
