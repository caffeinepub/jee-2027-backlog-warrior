# Specification

## Summary
**Goal:** Add a new editable “Inside” section to the Dashboard (Home) page, following the existing “Quick Note” interaction pattern, with content persisted in localStorage.

**Planned changes:**
- Add a new Dashboard card/section titled “Inside” that displays a freeform text block in read-only mode and supports Edit/Save/Cancel to modify it.
- Persist the “Inside” content to localStorage under a new dedicated storage key (not reusing existing Dashboard keys).
- Place the “Inside” section into the existing Dashboard layout in a responsive, non-overlapping position that works on mobile and desktop.

**User-visible outcome:** The Dashboard includes an “Inside” card where users can view and edit a text block, and their saved content remains after reloading the page.
