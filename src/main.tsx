
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './styles/dark.css'
import { applyDarkModeFromStorage } from './lib/theme'

// Apply dark mode from localStorage before rendering
applyDarkModeFromStorage();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
