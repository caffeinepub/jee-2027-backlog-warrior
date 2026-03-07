# Countdown Timer Manual Verification Checklist

## Test Scenarios

### 1. Create Timer
- [ ] Click "New Timer" button
- [ ] Enter a timer label (e.g., "Test Timer 1")
- [ ] Verify timer is created and automatically selected
- [ ] Check console for any errors

### 2. Select Timer
- [ ] Create multiple timers (at least 3)
- [ ] Open the Select dropdown
- [ ] Click on different timers
- [ ] Verify the selected timer changes in the UI
- [ ] Check console for any errors

### 3. Rename Timer
- [ ] Select a timer
- [ ] Click the Edit (pencil) icon next to the Select dropdown
- [ ] Enter a new label
- [ ] Click "Save"
- [ ] Verify the label updates in: (1) Select trigger, (2) Select list, (3) Countdown display title
- [ ] Try to save an empty label (should be blocked)
- [ ] Check console for any errors

### 4. Delete Non-Selected Timer
- [ ] Create at least 2 timers
- [ ] Select timer A
- [ ] Open the Select dropdown
- [ ] Hover over timer B to reveal the delete button
- [ ] Click the delete button for timer B
- [ ] Confirm deletion in the dialog
- [ ] Verify timer B is removed from the list
- [ ] Verify timer A remains selected
- [ ] Check console for any errors

### 5. Delete Selected Timer
- [ ] Create at least 2 timers
- [ ] Select a timer
- [ ] Open the Select dropdown
- [ ] Hover over the selected timer to reveal the delete button
- [ ] Click the delete button
- [ ] Confirm deletion in the dialog
- [ ] Verify the timer is removed
- [ ] Verify another timer is automatically selected
- [ ] Check console for any errors

### 6. Delete Last Timer
- [ ] Create a single timer
- [ ] Open the Select dropdown
- [ ] Hover over the timer to reveal the delete button
- [ ] Click the delete button
- [ ] Confirm deletion in the dialog
- [ ] Verify the timer is removed
- [ ] Verify the empty state is displayed
- [ ] Verify no timer is selected
- [ ] Check console for any errors

### 7. Set Target Date/Time
- [ ] Select a timer
- [ ] Set a future date and time in the date picker
- [ ] Verify the countdown starts immediately
- [ ] Verify the countdown updates every second
- [ ] Check console for any errors

### 8. Page Reload Persistence
- [ ] Create multiple timers with different labels and target dates
- [ ] Reload the page
- [ ] Verify all timers are restored
- [ ] Verify the previously selected timer is still selected
- [ ] Check console for any errors

### 9. Edge Cases
- [ ] Try creating a timer with only whitespace (should be blocked)
- [ ] Try renaming a timer to only whitespace (should be blocked)
- [ ] Create 10+ timers and verify UI remains usable
- [ ] Set a past date and verify "Time is up!" message appears
- [ ] Check console for any errors

## Expected Behavior
- No runtime errors in console during any operation
- All UI updates happen immediately without page reload
- Confirmation dialogs appear for all delete operations
- Empty/whitespace-only labels are blocked with disabled save buttons
- localStorage is updated correctly after each operation
- Selected timer is maintained or gracefully handled after deletions
