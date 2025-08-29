const DARK_LINK_ID = 'dark-theme-stylesheet';

// Resolve the built URL for the stylesheet so Vite can include it
const darkHref = new URL('../styles/dark.css', import.meta.url).toString();

function addDarkStylesheet() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(DARK_LINK_ID)) return;
  const link = document.createElement('link');
  link.id = DARK_LINK_ID;
  link.rel = 'stylesheet';
  link.href = darkHref;
  document.head.appendChild(link);
}

function removeDarkStylesheet() {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(DARK_LINK_ID);
  if (el) el.remove();
}

export function enableDarkMode() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('dark');
  addDarkStylesheet();
  try { localStorage.setItem('theme', 'dark'); } catch {}
}

export function disableDarkMode() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('dark');
  removeDarkStylesheet();
  try { localStorage.setItem('theme', 'light'); } catch {}
}

export function applyDarkMode(enabled: boolean) {
  if (enabled) enableDarkMode();
  else disableDarkMode();
}

export function applyDarkModeFromStorage() {
  try {
    const stored = localStorage.getItem('theme');
    applyDarkMode(stored === 'dark');
  } catch {
    // ignore
  }
}
