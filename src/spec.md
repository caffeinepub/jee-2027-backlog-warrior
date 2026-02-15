# Specification

## Summary
**Goal:** Let users customize the Dashboard title, add a simple Notes app, and introduce a Tests area with per-test progress graphs—persisted locally on the device.

**Planned changes:**
- Replace the hardcoded Dashboard hero heading (“Friday”) with an in-place editable title and persist it in LocalStorage.
- Add a Notes page accessible from the hamburger drawer to create, view, edit, and delete notes, persisted in LocalStorage.
- Add a Tests page to create/edit/delete unlimited tests (label + total marks) and manage per-test score entries, persisted in LocalStorage.
- For each test, display a progress chart with per-test customization controls (minimum: line vs bar + selectable accent color) and persist chart settings in LocalStorage.
- Update navigation to include “Tests” in both bottom navigation and the hamburger drawer without breaking existing routes.

**User-visible outcome:** Users can rename the Dashboard heading, take and manage notes in a dedicated Notes page, and track multiple tests with scores and customizable per-test charts—everything saved locally and restored after reload.
