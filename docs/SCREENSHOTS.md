# Screenshot Requirements Guide

This document describes all screenshots needed for the user documentation.

## Quick Start: Automated Capture 🚀

The fastest way to capture all screenshots is using the automated Python script:

```bash
# 1. Start the app server
cd /home/tony/winefred
./start-server.sh

# 2. In another terminal, run the automated capture
cd docs
./capture-all-screenshots.sh
```

This will automatically:
- ✅ Open the app in Chrome
- ✅ Add sample volunteer entries
- ✅ Navigate through all screens
- ✅ Capture all 33 screenshots (34 total, 1 requires manual mobile capture)
- ✅ Save to `docs/images/` with correct filenames

**Requirements:**
- Python 3.7+
- Google Chrome
- ChromeDriver (installed automatically by script or via `apt install chromium-chromedriver`)

**Time:** ~2-3 minutes for all screenshots

---

## Manual Capture (Alternative Method)

If you prefer to capture screenshots manually or the automated script doesn't work, follow the instructions below.

## Directory Structure

All screenshots should be saved to: `docs/images/`

Create the directory:
```bash
mkdir -p docs/images
```

## Required Screenshots

### 1. Main Interface Screenshots

#### main-interface.png
- **Purpose**: Show the three main tabs (Dashboard, Log Hours, History)
- **Instructions**:
  - Open the app in browser
  - Capture full interface showing the tab navigation at the top
  - Ensure all three tabs are visible
  - Recommended size: 1200x800px

#### dashboard-stats.png
- **Purpose**: Show the four statistics cards at the top of Dashboard
- **Instructions**:
  - Navigate to Dashboard tab
  - Focus on the four stat cards: Total Hours, Total Entries, Organizations, This Month
  - Ensure there's sample data showing (add a few entries if needed)
  - Recommended size: 1000x400px

#### org-chart.png
- **Purpose**: Display the "Hours by Organization" bar chart
- **Instructions**:
  - Navigate to Dashboard tab
  - Scroll to the chart section
  - Ensure chart shows data for multiple organizations
  - Capture the full chart with legend
  - Recommended size: 1000x600px

#### recent-activity.png
- **Purpose**: Show the recent activity section
- **Instructions**:
  - Navigate to Dashboard tab
  - Scroll to Recent Activity section
  - Ensure at least 3-5 recent entries are showing
  - Recommended size: 1000x500px

### 2. Log Hours Form Screenshots

#### date-picker.png
- **Purpose**: Show the date input field
- **Instructions**:
  - Navigate to Log Hours tab
  - Click on the Date field to open the date picker
  - Capture the date picker interface
  - Recommended size: 400x400px

#### organization-field.png
- **Purpose**: Show the organization input with autocomplete
- **Instructions**:
  - Navigate to Log Hours tab
  - Click in the Organization field
  - Type a few letters to show autocomplete suggestions
  - Capture field with suggestions visible
  - Recommended size: 600x300px

#### activity-field.png
- **Purpose**: Show the activity/project input field
- **Instructions**:
  - Navigate to Log Hours tab
  - Focus on Activity field with sample text
  - Show field with placeholder or example text
  - Recommended size: 600x150px

#### hours-field.png
- **Purpose**: Show the hours input field
- **Instructions**:
  - Navigate to Log Hours tab
  - Enter a sample number in Hours field (e.g., 2.5)
  - Capture the field with value
  - Recommended size: 400x150px

#### category-dropdown.png
- **Purpose**: Show the category selection dropdown
- **Instructions**:
  - Navigate to Log Hours tab
  - Click on Category dropdown to open it
  - Capture with all category options visible:
    - Education
    - Environment
    - Health
    - Social Services
    - Arts & Culture
    - Animal Welfare
    - Community Development
    - Other
  - Recommended size: 500x400px

#### description-field.png
- **Purpose**: Show the optional description textarea
- **Instructions**:
  - Navigate to Log Hours tab
  - Enter sample text in Description field
  - Capture field with example description
  - Recommended size: 600x200px

#### add-entry-button.png
- **Purpose**: Show the "Add Entry" submit button
- **Instructions**:
  - Navigate to Log Hours tab
  - Ensure form is filled out
  - Focus on the green "Add Entry" button
  - Recommended size: 300x100px

### 3. Tutorial-Specific Screenshots

These screenshots are specifically for the TUTORIAL.md walkthrough experience:

#### tutorial-opening.png
- **Purpose**: Show opening the app in a browser
- **Instructions**:
  - Show browser window with app loaded
  - Capture clean, welcoming first view
  - Recommended size: 1000x600px

#### tutorial-mobile-install.png
- **Purpose**: Show "Add to Home Screen" process
- **Instructions**:
  - Capture phone screenshot of Share menu
  - Show "Add to Home Screen" option highlighted
  - Or create diagram showing the process
  - Recommended size: 400x700px (mobile aspect ratio)

#### tutorial-log-hours-tab.png
- **Purpose**: Highlight the Log Hours tab
- **Instructions**:
  - Show tab navigation with Log Hours tab active/highlighted
  - Clear visual emphasis on which tab to click
  - Recommended size: 800x200px

#### tutorial-completed-form.png
- **Purpose**: Show a fully filled out entry form
- **Instructions**:
  - Navigate to Log Hours tab
  - Fill in all fields with the Food Bank example:
    - Date: October 10, 2025
    - Organization: Local Food Bank
    - Activity: Food sorting and distribution
    - Hours: 3.5
    - Category: Social Services
    - Description: Sorted 200 lbs of food donations and prepared 50 packages
  - Capture entire form before submission
  - Recommended size: 800x900px

#### tutorial-success-message.png
- **Purpose**: Show success confirmation after adding entry
- **Instructions**:
  - Add an entry
  - Capture the green success message that appears
  - Show transition to History tab with new entry
  - Recommended size: 1000x400px

#### tutorial-dashboard-tab.png
- **Purpose**: Highlight the Dashboard tab
- **Instructions**:
  - Show tab navigation with Dashboard tab active/highlighted
  - Clear visual emphasis on which tab to click
  - Recommended size: 800x200px

#### tutorial-updated-dashboard.png
- **Purpose**: Show dashboard after adding 3 entries
- **Instructions**:
  - Add the 3 example entries (Food Bank, Animal Shelter, Library)
  - Capture full dashboard showing:
    - Total Hours: 7
    - Total Entries: 3
    - Organizations: 3
    - Chart with all 3 organizations
  - Recommended size: 1200x900px

#### tutorial-entry-2.png
- **Purpose**: Show second example entry (Animal Shelter)
- **Instructions**:
  - Navigate to Log Hours
  - Fill in Animal Shelter example
  - Capture form before submission
  - Recommended size: 800x700px

#### tutorial-entry-3.png
- **Purpose**: Show third example entry (Public Library)
- **Instructions**:
  - Navigate to Log Hours
  - Fill in Library example
  - Capture form before submission
  - Recommended size: 800x700px

#### tutorial-search-results.png
- **Purpose**: Show search results filtering
- **Instructions**:
  - Navigate to History tab
  - Type "dog" in search box
  - Show only Animal Shelter entry appearing
  - Recommended size: 1000x600px

#### tutorial-filtered-results.png
- **Purpose**: Show filtered results by organization
- **Instructions**:
  - Navigate to History tab
  - Select "Local Food Bank" from organization filter
  - Show only Food Bank entries
  - Recommended size: 1000x600px

#### tutorial-editing.png
- **Purpose**: Show editing an entry in progress
- **Instructions**:
  - Click Edit on Food Bank entry
  - Change hours from 3.5 to 4
  - Capture form in edit mode with changed value
  - Show both "Update Entry" and "Cancel" buttons
  - Recommended size: 800x700px

#### tutorial-update-button.png
- **Purpose**: Highlight the Update Entry button
- **Instructions**:
  - In edit mode, focus on the "Update Entry" button
  - Show it as distinct from Add Entry
  - Recommended size: 400x150px

#### tutorial-updated-entry.png
- **Purpose**: Show entry after it's been updated
- **Instructions**:
  - After updating Food Bank entry to 4 hours
  - Show the entry card displaying new hours
  - Recommended size: 600x300px

#### tutorial-download.png
- **Purpose**: Show file download confirmation
- **Instructions**:
  - After clicking Export Data
  - Capture browser download bar or notification
  - Show the downloaded filename (volunteer-hours-2025-10-14.json)
  - Recommended size: 800x200px

### 4. History Tab Screenshots

#### history-view.png
- **Purpose**: Show the complete history view with entries
- **Instructions**:
  - Navigate to History tab
  - Ensure several entries are displayed
  - Show search box, filters, and entry cards
  - Capture full view
  - Recommended size: 1200x900px

#### search-box.png
- **Purpose**: Show the search functionality
- **Instructions**:
  - Navigate to History tab
  - Type a search term in the search box
  - Show filtered results
  - Recommended size: 800x500px

#### filters.png
- **Purpose**: Show organization and category filter dropdowns
- **Instructions**:
  - Navigate to History tab
  - Click on one of the filter dropdowns
  - Show dropdown with options
  - Recommended size: 600x400px

#### sort-options.png
- **Purpose**: Show the sort dropdown
- **Instructions**:
  - Navigate to History tab
  - Click on "Sort By" dropdown
  - Show all sort options:
    - Date (Newest)
    - Date (Oldest)
    - Hours (Most)
    - Hours (Least)
  - Recommended size: 500x300px

#### edit-entry.png
- **Purpose**: Show the edit mode for an entry
- **Instructions**:
  - Navigate to History tab
  - Click "Edit" button on an entry
  - Capture the form in edit mode with "Update Entry" and "Cancel" buttons
  - Recommended size: 800x600px

#### delete-confirmation.png
- **Purpose**: Show the delete confirmation modal
- **Instructions**:
  - Navigate to History tab
  - Click "Delete" button on an entry
  - Capture the confirmation popup
  - Ensure "Confirm" and "Cancel" buttons are visible
  - Recommended size: 500x300px

#### export-button.png
- **Purpose**: Show the Export Data button
- **Instructions**:
  - Navigate to History tab
  - Scroll to bottom or locate Export button
  - Capture button and surrounding context
  - Recommended size: 400x200px

## Screenshot Capture Methods

### Option 1: Browser DevTools
1. Open app in Chrome/Firefox
2. Press F12 to open DevTools
3. Click device toolbar icon (responsive mode)
4. Set viewport to recommended size
5. Use browser's screenshot tool or press `Ctrl+Shift+P` and type "screenshot"

### Option 2: OS Screenshot Tools
- **Windows**: Windows + Shift + S (Snipping Tool)
- **macOS**: Cmd + Shift + 4 (select area)
- **Linux**: gnome-screenshot -a or spectacle

### Option 3: Browser Extensions
- **Awesome Screenshot**: Full page and partial screenshots
- **Nimbus Screenshot**: Annotate and crop
- **FireShot**: Full page captures

## Image Editing

After capturing screenshots:

1. **Crop**: Remove unnecessary whitespace
2. **Resize**: Ensure readable text but not too large (max 1200px width)
3. **Format**: Save as PNG for UI screenshots (better quality)
4. **Optimize**: Use tools like tinypng.com to reduce file size
5. **Name**: Use exact filenames listed above

## Testing Sample Data

Before capturing screenshots, add sample volunteer entries:

```javascript
// Example entries to add for screenshots
[
  {
    date: "2025-10-10",
    organization: "Local Food Bank",
    activity: "Food sorting and distribution",
    hours: 3.5,
    category: "Social Services",
    description: "Sorted 200 lbs of food donations and prepared 50 packages"
  },
  {
    date: "2025-10-08",
    organization: "Animal Shelter",
    activity: "Dog walking and kennel cleaning",
    hours: 2,
    category: "Animal Welfare",
    description: "Walked 5 dogs and cleaned 10 kennels"
  },
  {
    date: "2025-10-05",
    organization: "Public Library",
    activity: "Reading program for children",
    hours: 1.5,
    category: "Education",
    description: "Read to 15 children in after-school program"
  },
  {
    date: "2025-09-28",
    organization: "Local Food Bank",
    activity: "Food drive organization",
    hours: 4,
    category: "Social Services",
    description: "Organized food drive at local school"
  },
  {
    date: "2025-09-20",
    organization: "Community Garden",
    activity: "Garden maintenance",
    hours: 2.5,
    category: "Environment",
    description: "Weeded beds and planted fall vegetables"
  }
]
```

## Checklist

Use this checklist when capturing screenshots:

### Base Screenshots (Used in USER_GUIDE.md and REFERENCE.md)
- [ ] Created `docs/images/` directory
- [ ] Added sample volunteer entries
- [ ] Captured main-interface.png
- [ ] Captured dashboard-stats.png
- [ ] Captured org-chart.png
- [ ] Captured recent-activity.png
- [ ] Captured date-picker.png
- [ ] Captured organization-field.png
- [ ] Captured activity-field.png
- [ ] Captured hours-field.png
- [ ] Captured category-dropdown.png
- [ ] Captured description-field.png
- [ ] Captured add-entry-button.png
- [ ] Captured history-view.png
- [ ] Captured search-box.png
- [ ] Captured filters.png
- [ ] Captured sort-options.png
- [ ] Captured edit-entry.png
- [ ] Captured delete-confirmation.png
- [ ] Captured export-button.png

### Tutorial Screenshots (Used in TUTORIAL.md)
- [ ] Captured tutorial-opening.png
- [ ] Captured tutorial-mobile-install.png
- [ ] Captured tutorial-log-hours-tab.png
- [ ] Captured tutorial-completed-form.png
- [ ] Captured tutorial-success-message.png
- [ ] Captured tutorial-dashboard-tab.png
- [ ] Captured tutorial-updated-dashboard.png
- [ ] Captured tutorial-entry-2.png
- [ ] Captured tutorial-entry-3.png
- [ ] Captured tutorial-search-results.png
- [ ] Captured tutorial-filtered-results.png
- [ ] Captured tutorial-editing.png
- [ ] Captured tutorial-update-button.png
- [ ] Captured tutorial-updated-entry.png
- [ ] Captured tutorial-download.png

### Final Steps
- [ ] Optimized all images (use tinypng.com or similar)
- [ ] Verified all filenames match documentation references
- [ ] Tested that all images display correctly in TUTORIAL.md
- [ ] Tested that all images display correctly in USER_GUIDE.md
- [ ] Tested that all images display correctly in REFERENCE.md

## Notes

- Screenshots should show a clean, professional interface
- Use realistic data (avoid "test" or "foo" in entries)
- Ensure good contrast and readability
- Capture in light mode (default theme)
- Images will be referenced in TUTORIAL.md, USER_GUIDE.md, and REFERENCE.md using relative paths:
  ```markdown
  ![Description](images/filename.png)
  ```
- Tutorial screenshots tell a story - follow the walkthrough steps in TUTORIAL.md for best results
- Total screenshots needed: 34 images (19 base + 15 tutorial-specific)
