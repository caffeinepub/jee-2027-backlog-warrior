export function applyDarkModeOverride(override: { enabled: boolean; mode: 'light' | 'dark' }) {
  const root = document.documentElement;
  
  if (override.enabled) {
    // User has explicitly chosen a mode
    if (override.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } else {
    // Default to dark mode when override is disabled
    root.classList.add('dark');
  }
}
