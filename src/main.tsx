
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { applyDarkModeFromStorage } from './lib/theme'

// Apply theme ASAP before first paint
applyDarkModeFromStorage()

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
