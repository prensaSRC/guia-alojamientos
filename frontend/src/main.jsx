import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GUIA_ACTIVA } from './guia.js'

// Título de pestaña según el rubro compilado (VITE_RUBRO)
document.title = GUIA_ACTIVA.titulo;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)