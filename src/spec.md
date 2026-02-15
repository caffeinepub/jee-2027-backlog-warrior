# Specification

## Summary
**Goal:** Add a per-subject chapter completion graph with slow fill animation on completion, and fix the production crash causing “Minified React error #185”.

**Planned changes:**
- Add a Subject Completion Graph to each Subject page (default and user-created subjects) showing chapter-by-chapter Completed vs Not Completed status, placed above the chapter grid (or similarly prominent location).
- Animate a chapter’s graph segment to fill slowly when its status changes to Completed, and ensure the graph updates immediately and matches persisted LocalStorage state after reload.
- Reproduce the “Minified React error #185” in a non-minified/dev environment to obtain the full error details, identify the root cause, and implement a frontend fix that removes the crash during normal navigation and interactions without breaking existing subject/dashboard/customize pages or LocalStorage persistence.

**User-visible outcome:** Each Subject page shows an English-labeled chapter completion graph that animates newly completed chapters, and the app no longer crashes in production with “Minified React error #185” during typical use.
