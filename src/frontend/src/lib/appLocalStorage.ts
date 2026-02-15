/**
 * Centralized utility for managing this app's LocalStorage keys.
 * Provides scoped reset functionality to clear only app-specific data.
 */

// All known LocalStorage keys used by this application
const APP_STORAGE_KEYS = [
  'jee-chapters-data',
  'jee-subjects-data',
  'jee-todos-data',
  'jee-resources-data',
  'jee-tests-data',
  'jee-calendar-entries',
  'jee-currently-working',
  'jee-dashboard-title',
  'jee-dashboard-note',
  'dashboard-inside',
  'jee-customization-settings',
  'jee-customization-presets',
  'jee-notes-data',
  'jee-study-log',
  'countdown-target-date',
] as const;

/**
 * Clears only this app's LocalStorage entries, preserving unrelated storage.
 * This allows the app to reset to default seeded state without affecting other apps.
 */
export function clearAppLocalStorage(): void {
  try {
    APP_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('App LocalStorage cleared successfully');
  } catch (error) {
    console.error('Failed to clear app LocalStorage:', error);
  }
}

/**
 * Gets all app storage keys for reference.
 */
export function getAppStorageKeys(): readonly string[] {
  return APP_STORAGE_KEYS;
}
