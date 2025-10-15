# Manual Verification Checklist

## How to Test

1. Open `http://localhost:8080` in your browser
2. Open `http://localhost:8080/tests/test.html` to run automated tests

## Feature Verification

### Basic Functionality
- [ ] App loads without errors
- [ ] Header displays "Volunteer Hours" title
- [ ] Three tabs are visible: Dashboard, Log Hours, History
- [ ] Dashboard shows 0 hours initially

### Adding Entries
- [ ] Click "Log Hours" tab
- [ ] Fill in all required fields:
  - Date (should default to today)
  - Organization (e.g., "Local Food Bank")
  - Activity (e.g., "Food sorting")
  - Hours (e.g., "3.5")
  - Category (optional, e.g., "Social Services")
  - Description (optional)
- [ ] Click "Add Entry" button
- [ ] Toast notification appears saying "Entry added successfully"
- [ ] Automatically switches to History tab
- [ ] Entry appears in the history list

### Dashboard Statistics
- [ ] Click "Dashboard" tab
- [ ] Total Hours reflects added entries
- [ ] Total Entries count is correct
- [ ] Organizations count is correct
- [ ] This Month hours are calculated correctly
- [ ] "Hours by Organization" chart displays correctly
- [ ] "Recent Activity" shows last 5 entries

### Editing Entries
- [ ] Go to History tab
- [ ] Click "Edit" button on an entry
- [ ] Form populates with entry data
- [ ] Button text changes to "Update Entry"
- [ ] "Cancel" button appears
- [ ] Modify some fields
- [ ] Click "Update Entry"
- [ ] Toast shows "Entry updated successfully"
- [ ] Changes are reflected in the history

### Deleting Entries
- [ ] Go to History tab
- [ ] Click "Delete" button on an entry
- [ ] Confirmation modal appears
- [ ] Click "Confirm"
- [ ] Entry is removed from list
- [ ] Toast shows "Entry deleted"
- [ ] Statistics update accordingly

### Search and Filter
- [ ] Add multiple entries with different organizations and categories
- [ ] Use search box to find entries by keyword
- [ ] Filter by organization dropdown
- [ ] Filter by category dropdown
- [ ] Change sort order (date/hours, ascending/descending)
- [ ] Verify results update correctly

### Data Persistence
- [ ] Add several entries
- [ ] Refresh the page
- [ ] All entries should still be present
- [ ] Statistics should be accurate

### Export Data
- [ ] Click "Export Data" button
- [ ] JSON file downloads with current date in filename
- [ ] Open file and verify it contains all entries in JSON format

### Clear All Data
- [ ] Click "Clear All" button
- [ ] Confirmation modal appears
- [ ] Click "Confirm"
- [ ] All entries are deleted
- [ ] Dashboard shows zero stats
- [ ] Toast shows "All entries cleared"

### Mobile Responsiveness
- [ ] Resize browser window to mobile width (< 480px)
- [ ] Verify layout adapts properly
- [ ] All buttons are accessible
- [ ] Text remains readable
- [ ] Forms are easy to fill out
- [ ] Test on actual mobile device if possible

### Edge Cases
- [ ] Try to add entry with 0.25 hours (minimum)
- [ ] Try very long organization name (should handle gracefully)
- [ ] Try very long description (should handle gracefully)
- [ ] Add entry without optional category
- [ ] Add entry without optional description
- [ ] Try adding many entries (50+) - should perform well

### PWA Features
- [ ] Check manifest.json loads
- [ ] App icon displays correctly
- [ ] App can be "installed" on mobile devices
- [ ] Works in standalone mode

### Security
- [ ] Try entering `<script>alert('xss')</script>` in text fields
- [ ] Verify it's escaped and doesn't execute
- [ ] No console errors about XSS

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (Chrome Mobile, Safari iOS)

## Performance

- [ ] App loads in < 2 seconds
- [ ] Adding entry is instantaneous
- [ ] Filtering/sorting is smooth even with many entries
- [ ] No memory leaks (check with multiple add/delete cycles)

## Automated Tests

Run the test suite at `http://localhost:8080/tests/test.html`:
- [ ] All tests pass
- [ ] No console errors
- [ ] Test coverage is comprehensive

## Issues Found

Document any issues discovered during testing:

1. _No issues found yet_

## Sign-off

- [ ] All critical features work correctly
- [ ] No blocking bugs found
- [ ] App is ready for use
- [ ] Documentation is complete

**Tested by:** _________________
**Date:** _________________
**Result:** ☐ Pass ☐ Fail (with notes)
