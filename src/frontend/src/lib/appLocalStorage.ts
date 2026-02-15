/**
 * Centralized utility for managing this app's LocalStorage keys.
 * Provides scoped reset functionality to clear only app-specific data.
 */

// All known LocalStorage keys used by this application
const STORAGE_KEYS = [
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
  'countdown-timers-list',
  'countdown-selected-timer-id',
  'jee-subject-details',
] as const;

// Export storage keys as a structured object
export const APP_STORAGE_KEYS = {
  CHAPTERS: 'jee-chapters-data',
  SUBJECTS: 'jee-subjects-data',
  TODOS: 'jee-todos-data',
  RESOURCES: 'jee-resources-data',
  TESTS: 'jee-tests-data',
  CALENDAR_ENTRIES: 'jee-calendar-entries',
  WORKING_CHAPTERS: 'jee-currently-working',
  DASHBOARD_TITLE: 'jee-dashboard-title',
  DASHBOARD_NOTE: 'jee-dashboard-note',
  DASHBOARD_INSIDE: 'dashboard-inside',
  CUSTOMIZATION_SETTINGS: 'jee-customization-settings',
  CUSTOMIZATION_PRESETS: 'jee-customization-presets',
  NOTES: 'jee-notes-data',
  STUDY_LOG: 'jee-study-log',
  COUNTDOWN_TARGET_DATE: 'countdown-target-date',
  COUNTDOWN_TIMERS_LIST: 'countdown-timers-list',
  COUNTDOWN_SELECTED_TIMER_ID: 'countdown-selected-timer-id',
  SUBJECT_DETAILS: 'jee-subject-details',
} as const;

/**
 * Clears only this app's LocalStorage entries, preserving unrelated storage.
 * This allows the app to reset to default seeded state without affecting other apps.
 * 
 * @param excludeKeys - Optional array of keys to preserve during clearing
 */
export function clearAppLocalStorage(excludeKeys: string[] = []): void {
  try {
    const excludeSet = new Set(excludeKeys);
    STORAGE_KEYS.forEach(key => {
      if (!excludeSet.has(key)) {
        localStorage.removeItem(key);
      }
    });
    console.log('App LocalStorage cleared successfully', excludeKeys.length > 0 ? `(preserved ${excludeKeys.length} keys)` : '');
  } catch (error) {
    console.error('Failed to clear app LocalStorage:', error);
  }
}

/**
 * Gets all app storage keys for reference.
 */
export function getAppStorageKeys(): readonly string[] {
  return STORAGE_KEYS;
}
