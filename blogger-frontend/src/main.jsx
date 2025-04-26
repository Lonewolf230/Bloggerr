import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Buffer} from 'buffer'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './misc/AuthContext.jsx'
window.Buffer=Buffer


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
