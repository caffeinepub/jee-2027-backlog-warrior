# Specification

## Summary
**Goal:** Roll back the deployed application to the exact behavior and code of version 37, undoing changes from later deployments.

**Planned changes:**
- Restore frontend and backend to the exact deployed artifacts/code corresponding to version 37, removing any behavior introduced after version 37.
- Ensure the deployed app reports and/or is labeled as version 37 (or an unambiguous equivalent identifier mapped to version 37).
- If version 37 cannot be uniquely identified from deployment/build metadata, add a safeguard that blocks rollback until an explicit target identifier (e.g., v37 or a commit hash) is provided/confirmed, and log/record the exact restored identifier.
- Avoid running new data migrations during rollback unless version 37 requires a different stable-state schema; if so, include only the necessary safe migration work to restore version 37 compatibility.

**User-visible outcome:** The live app behaves exactly like version 37 and is identifiable as version 37; if the rollback target is ambiguous, the rollback is blocked until a specific version identifier is confirmed.
