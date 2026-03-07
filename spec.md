# Specification

## Summary
**Goal:** Move the main bottom navigation (Home, Calendar, Countdown, Notes, Tests) into the left-side menu drawer while keeping the Subjects bar as the only fixed bottom element.

**Planned changes:**
- Remove the fixed bottom button row for Home/Calendar/Countdown/Notes/Tests, leaving the existing SubjectsBar fixed at the bottom with unchanged subject switching/add/delete behavior.
- Expand the left-side TasksDrawer to include navigation items for Home, Calendar, Countdown, Notes, and Tests; preserve active-route styling and close the drawer after navigating.
- Adjust page layout bottom spacing/padding so content is not obscured by the remaining fixed SubjectsBar, without adding excessive blank space.

**User-visible outcome:** The bottom of the app only shows the Subjects bar, and the main app sections (Home, Calendar, Countdown, Notes, Tests) are accessed from the left menu with the current section clearly indicated.
