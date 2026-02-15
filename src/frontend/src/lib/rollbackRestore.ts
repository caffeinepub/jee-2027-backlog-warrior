/**
 * Centralized rollback/restore runtime controller for v37.
 * Manages rollback state, triggers reconciliation, and enforces v37 behavior.
 */

import { clearAppLocalStorage } from './appLocalStorage';
import { storeConfirmedRollbackTarget } from './appVersion';

const ROLLBACK_ACTIVE_KEY = 'app-rollback-v37-active';
const ROLLBACK_RECONCILED_KEY = 'app-rollback-v37-reconciled';

/**
 * Checks if v37 rollback mode is currently active.
 */
export function isRollbackActive(): boolean {
  try {
    const stored = localStorage.getItem(ROLLBACK_ACTIVE_KEY);
    return stored === 'true';
  } catch (error) {
    console.error('Failed to check rollback status:', error);
    return false;
  }
}

/**
 * Checks if rollback reconciliation has already been performed.
 */
export function isRollbackReconciled(): boolean {
  try {
    const stored = localStorage.getItem(ROLLBACK_RECONCILED_KEY);
    return stored === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Gets the current rollback reconciliation status.
 */
export function getRollbackStatus(): {
  active: boolean;
  reconciled: boolean;
  needsReconciliation: boolean;
} {
  const active = isRollbackActive();
  const reconciled = isRollbackReconciled();
  return {
    active,
    reconciled,
    needsReconciliation: active && !reconciled,
  };
}

/**
 * Marks rollback reconciliation as complete.
 */
function markRollbackReconciled(): void {
  try {
    localStorage.setItem(ROLLBACK_RECONCILED_KEY, 'true');
  } catch (error) {
    console.error('Failed to mark rollback reconciled:', error);
  }
}

/**
 * Activates rollback to v37 by clearing app storage and forcing a reload.
 * This ensures the app runs in v37 compatibility mode.
 */
export function activateRollbackToV37(confirmedTarget: string): void {
  try {
    // Store the confirmed rollback target for audit
    storeConfirmedRollbackTarget(confirmedTarget);
    
    // Mark rollback as active
    localStorage.setItem(ROLLBACK_ACTIVE_KEY, 'true');
    
    // Clear rollback reconciliation marker to trigger reconciliation on next load
    localStorage.removeItem(ROLLBACK_RECONCILED_KEY);
    
    // Force immediate reload to trigger reconciliation
    window.location.reload();
  } catch (error) {
    console.error('Failed to activate rollback:', error);
    throw new Error('Rollback activation failed. Please try again.');
  }
}

/**
 * Performs one-time reconciliation when rollback is active.
 * Clears app-owned localStorage to restore v37 baseline state.
 * This function is idempotent and safe to call multiple times.
 */
export function reconcileRollbackIfNeeded(): void {
  if (!isRollbackActive()) {
    return;
  }

  if (isRollbackReconciled()) {
    return;
  }

  try {
    console.log('Performing v37 rollback reconciliation...');
    
    // Preserve rollback/audit markers during clearing
    const rollbackActive = localStorage.getItem(ROLLBACK_ACTIVE_KEY);
    const rollbackTarget = localStorage.getItem('app-rollback-target-confirmed');
    
    // Clear all app-owned localStorage except rollback markers
    clearAppLocalStorage([ROLLBACK_ACTIVE_KEY, 'app-rollback-target-confirmed']);
    
    // Restore rollback markers (defensive, in case clearAppLocalStorage had issues)
    if (rollbackActive) {
      localStorage.setItem(ROLLBACK_ACTIVE_KEY, rollbackActive);
    }
    if (rollbackTarget) {
      localStorage.setItem('app-rollback-target-confirmed', rollbackTarget);
    }
    
    // Mark reconciliation complete
    markRollbackReconciled();
    
    console.log('v37 rollback reconciliation complete');
  } catch (error) {
    console.error('Rollback reconciliation failed:', error);
  }
}

/**
 * Pre-render-safe reconciliation helper that runs synchronously before any component renders.
 * Guarantees one-time restore semantics without render-time races.
 */
export function reconcileRollbackBeforeRender(): void {
  reconcileRollbackIfNeeded();
}

/**
 * Forces a retry of the rollback reconciliation process.
 * Clears the reconciliation marker and reloads to trigger a fresh reconciliation.
 */
export function retryRollbackReconciliation(): void {
  if (!isRollbackActive()) {
    throw new Error('Cannot retry reconciliation: rollback is not active');
  }

  try {
    console.log('Retrying v37 rollback reconciliation...');
    
    // Clear reconciliation marker to force re-run
    localStorage.removeItem(ROLLBACK_RECONCILED_KEY);
    
    // Force reload to trigger reconciliation
    window.location.reload();
  } catch (error) {
    console.error('Failed to retry rollback reconciliation:', error);
    throw new Error('Reconciliation retry failed. Please try again.');
  }
}

/**
 * Deactivates rollback mode and restores normal operation.
 */
export function deactivateRollback(): void {
  try {
    localStorage.removeItem(ROLLBACK_ACTIVE_KEY);
    localStorage.removeItem(ROLLBACK_RECONCILED_KEY);
    
    // Reload to restore normal behavior
    window.location.reload();
  } catch (error) {
    console.error('Failed to deactivate rollback:', error);
    throw new Error('Rollback deactivation failed. Please try again.');
  }
}
