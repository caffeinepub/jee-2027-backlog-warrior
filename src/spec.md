# Specification

## Summary
**Goal:** Let users change or clear a chapter’s status from within Chapter Details, including resetting back to “Not Started”.

**Planned changes:**
- Update ChapterDetailPanel status controls (Completed / Incomplete / Tough) to support toggling off the currently selected status, clearing it back to “Not Started”.
- Adjust the status button behavior so the currently selected option remains clickable (no disabling that prevents re-selection), enabling both switching between statuses and toggle-to-clear.
- Ensure the Chapter Details status badge updates immediately on change/clear and persists via the existing localStorage-backed chapter data.

**User-visible outcome:** In Chapter Details, users can freely switch between Completed/Incomplete/Tough and can also deselect a chosen status to revert the chapter back to “Not Started”, with the badge updating instantly and the change persisting.
