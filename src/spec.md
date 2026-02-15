# Specification

## Summary
**Goal:** Polish the study planner UI with a cohesive dark-blue dashboard theme, subtle animations/graphics, clearer overlays, improved charts, notifications, and reliable persistence.

**Planned changes:**
- Apply a consistent dark-blue theme across Home/Dashboard, Calendar, Subjects, Notes, and Tests with accessible contrast and harmonized component colors (cards, text, borders, accents).
- Add subtle icon animations for common interactive icons (hover/tap/state changes), respecting prefers-reduced-motion.
- Introduce lightweight background and panel-opening decorative graphics that enhance the dark-blue theme without obscuring content.
- Add in-place editing in each subject detail area for lectures, target hours, and finish date (where applicable) with validation and persistence.
- Add delete actions for every chapter and subject wherever they appear, including confirmation prompts and consistent destructive styling.
- Standardize completion vs incompletion indicators (colors/labels/icons) across lists, detail panels, and charts.
- Add a Notifications section on the Home/Dashboard showing two grouped lists: all incomplete items and items due today.
- Fix overlapping UI layers for sheets/drawers/dialogs using proper overlay/backdrop blur and z-index so opened panels are fully readable and scrollable.
- Add a Light/Dark mode toggle in Settings/Customize and persist the preference.
- Make bottom navigation horizontally scrollable on small screens with clear overflow affordance.
- Improve and expand graphs (add at least one new dashboard-relevant visualization) and enhance chart animations while respecting prefers-reduced-motion.
- Ensure all user changes (edits, completions, deletes, settings) persist across refresh and reopen; avoid any automatic data resets unless explicitly user-confirmed.

**User-visible outcome:** The app displays a unified dark-blue (and optional light) theme with subtle animated icons and graphics, reliable modals/panels, editable subject details, delete actions, clear completion indicators, a dashboard Notifications area, improved/expanded charts, a scrollable bottom nav on small screens, and all changes preserved after closing or reloading the app.
