# Specification

## Summary
**Goal:** Make “rollback to version 37” reliably restore a clean v37 baseline by deterministically clearing newer-version client state, running reconciliation before any UI rehydrates, and providing an in-app verification/retry path.

**Planned changes:**
- Update the rollback-to-v37 flow to remove all app-owned localStorage keys defined in `frontend/src/lib/appLocalStorage.ts`, while preserving required rollback/audit markers.
- Ensure rollback reconciliation/reset executes before any routes/pages/components that read localStorage can render or re-persist state, so the first post-rollback UI reflects the restored baseline immediately.
- Add a simple status panel on the Customize page showing rollback active/inactive and (when active) whether v37 reconciliation completed, plus a safe retry/force-restore action if reconciliation is incomplete (English UI text).

**User-visible outcome:** After confirming rollback to v37, the app reloads directly into a fresh v37 baseline (no prior user data remains), continues to indicate “v37 (Rollback)”, and the Customize page clearly shows rollback/reconciliation status with a retry option if needed.
