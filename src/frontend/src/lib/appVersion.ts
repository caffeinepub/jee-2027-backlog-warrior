/**
 * Single source of truth for the application version.
 * This file tracks the deployed version identifier for display and audit purposes.
 */

export const APP_VERSION = {
  number: 37,
  label: 'v37',
  description: 'Study Planner - Version 37',
  deployedAt: new Date().toISOString(),
} as const;

/**
 * Validates if a provided rollback target matches the expected version identifier.
 */
export function validateRollbackTarget(target: string): boolean {
  const normalizedTarget = target.toLowerCase().trim();
  return (
    normalizedTarget === 'v37' ||
    normalizedTarget === '37' ||
    normalizedTarget === 'version 37'
  );
}

/**
 * Storage key for tracking the last confirmed rollback target.
 */
export const ROLLBACK_TARGET_STORAGE_KEY = 'app-rollback-target-confirmed';

/**
 * Stores the confirmed rollback target for audit purposes.
 */
export function storeConfirmedRollbackTarget(target: string): void {
  try {
    localStorage.setItem(ROLLBACK_TARGET_STORAGE_KEY, JSON.stringify({
      target,
      confirmedAt: new Date().toISOString(),
      currentVersion: APP_VERSION.number,
    }));
  } catch (error) {
    console.error('Failed to store rollback target:', error);
  }
}

/**
 * Retrieves the last confirmed rollback target from storage.
 */
export function getConfirmedRollbackTarget(): { target: string; confirmedAt: string; currentVersion: number } | null {
  try {
    const stored = localStorage.getItem(ROLLBACK_TARGET_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to retrieve rollback target:', error);
    return null;
  }
}
