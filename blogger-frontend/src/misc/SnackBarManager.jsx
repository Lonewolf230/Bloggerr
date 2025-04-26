import React, { createContext, useState, useContext } from 'react';
import Snackbar from '../components/SnackBar';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success',
    hasUndo: false,
    undoEndpoint: null,
    undoPayload: null,
    undoCallback: null,
    duration: 5000
  });

  const showSnackbar = ({
    message,
    type = 'success',
    hasUndo = false,
    undoEndpoint = null,
    undoPayload = null,
    undoCallback = null,
    duration = 5000
  }) => {
    setSnackbar({
      open: true,
      message,
      type,
      hasUndo,
      undoEndpoint,
      undoPayload,
      undoCallback,
      duration
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        hasUndo={snackbar.hasUndo}
        undoEndpoint={snackbar.undoEndpoint}
        undoPayload={snackbar.undoPayload}
        undoCallback={snackbar.undoCallback}
        duration={snackbar.duration}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
};