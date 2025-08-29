// Theme utility for dark mode toggle functionality

export function enableDarkMode() {
  // Add dark-mode class to document element
  document.documentElement.classList.add('dark-mode');
  // Store dark mode preference
  localStorage.setItem('darkMode', 'true');
}

export function disableDarkMode() {
  // Remove dark-mode class from document element
  document.documentElement.classList.remove('dark-mode');
  // Remove dark mode preference
  localStorage.setItem('darkMode', 'false');
}

export function applyDarkMode(enabled: boolean) {
  if (enabled) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

export function applyDarkModeFromStorage() {
  // Check localStorage for dark mode preference
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  applyDarkMode(isDarkMode);
  return isDarkMode;
}

export function isDarkModeEnabled(): boolean {
  return localStorage.getItem('darkMode') === 'true';
}