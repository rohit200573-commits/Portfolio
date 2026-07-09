import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import and configure Reticle (dev-only)
import { reticle, install } from '@reticlehq/core';

if (location.hostname === 'localhost') {
  install();
  reticle.connect({ projectId: 'portfolio-3adc07f2' });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
