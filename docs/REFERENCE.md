# Volunteer Hours Tracker - Reference Manual

**Version 1.0** | Complete Feature Reference

This reference manual provides detailed documentation of every feature, field, and function in the Volunteer Hours Tracker application.

---

## Table of Contents

1. [Application Overview](#application-overview)
2. [Data Model](#data-model)
3. [User Interface Components](#user-interface-components)
4. [Features Reference](#features-reference)
5. [Field Specifications](#field-specifications)
6. [Calculations & Statistics](#calculations--statistics)
7. [Data Management](#data-management)
8. [Technical Specifications](#technical-specifications)

---

## Application Overview

### Purpose
Track volunteer hours, organizations, activities, and impact metrics for individuals and groups.

### Type
Progressive Web Application (PWA)

### Platform Support
- **Desktop**: Windows, macOS, Linux (any modern browser)
- **Mobile**: iOS 14+, Android (Chrome/Safari)
- **Tablet**: iPad, Android tablets

###Storage
- **Method**: Browser localStorage
- **Capacity**: ~5-10MB (thousands of entries)
- **Persistence**: Permanent (until browser data cleared)

### Network Requirements
- **None** - Works completely offline

---

## Data Model

### Volunteer Entry Object

Each volunteer entry contains the following data structure:

```javascript
{
  id: String,              // Unique identifier (timestamp)
  date: String,            // ISO date format (YYYY-MM-DD)
  organization: String,    // Organization name
  activity: String,        // Activity description
  hours: Number,           // Decimal hours (e.g., 2.5)
  category: String,        // Optional category
  description: String,     // Optional details
  createdAt: String        // ISO 8601 timestamp
}
```

### Example Entry

```javascript
{
  id: "1697385600000",
  date: "2024-10-15",
  organization: "Local Food Bank",
  activity: "Food sorting and distribution",
  hours: 3.5,
  category: "Social Services",
  description: "Helped sort donations and prepare 50 food packages",
  createdAt: "2024-10-15T14:30:00.000Z"
}
```

### Data Storage

**Key**: `volunteerEntries`
**Format**: JSON array of entry objects
**Location**: `localStorage` (browser-specific)

---

## User Interface Components

### Header

**Elements:**
- Application title: "Volunteer Hours"
- Total hours display (dynamically updated)

**Behavior:**
- Sticky (remains visible when scrolling)
- Shows real-time total from all entries

### Navigation Tabs

**Tabs:**
1. Dashboard
2. Log Hours
3. History

**Behavior:**
- One active tab at a time
- Click to switch views
- Active tab highlighted with green underline
- Mobile: Scrollable horizontally if needed

### Dashboard Tab

**Components:**
1. **Statistics Grid** (4 cards)
   - Total Hours
   - Total Entries
   - Organizations Count
   - This Month Hours

2. **Hours by Organization Chart**
   - Visual bar chart
   - Top 10 organizations
   - Sorted by hours (descending)
   - Shows organization name, bar, and hours

3. **Recent Activity List**
   - Last 5 entries
   - Shows: Organization, Activity, Hours, Date
   - Most recent first

### Log Hours Tab

**Components:**
- Entry form with 6 fields
- Submit button ("Add Entry" or "Update Entry")
- Cancel button (when editing)

**Form Fields:**
1. Date (required)
2. Organization (required, with autocomplete)
3. Activity (required)
4. Hours (required, numeric)
5. Category (optional, dropdown)
6. Description (optional, textarea)

### History Tab

**Components:**
1. **Search Box** - Text input for keyword search
2. **Filter Controls**
   - Organization dropdown
   - Category dropdown
   - Sort dropdown
3. **Action Buttons**
   - Export Data
   - Clear All
4. **Entries List** - Scrollable list of all entries

**Entry Card:**
- Organization name (header)
- Hours badge
- Activity description
- Date and category
- Optional description
- Edit and Delete buttons

---

## Features Reference

### Feature: Add Volunteer Entry

**Location**: Log Hours tab

**Purpose**: Record new volunteer hours

**Steps:**
1. Fill required fields (date, organization, activity, hours)
2. Optionally fill category and description
3. Click "Add Entry"

**Validation:**
- Date: Required, cannot be future
- Organization: Required, min 1 character
- Activity: Required, min 1 character
- Hours: Required, >= 0.25, numeric

**Result:**
- Entry saved to localStorage
- Success toast notification
- Auto-switch to History tab
- Entry appears in list

**State Changes:**
- Total hours updated
- Entry count incremented
- Organization added to filters (if new)
- Category added to filters (if new)

### Feature: View Dashboard

**Location**: Dashboard tab

**Purpose**: See volunteer statistics and impact

**Displays:**
- 4 summary statistics
- Chart of top organizations
- 5 most recent activities

**Calculations** (see [Calculations section](#calculations--statistics)):
- Total hours: Sum of all entry hours
- Total entries: Count of all entries
- Organizations: Count of unique organizations
- This month: Sum of hours where entry date is in current month

**Update Trigger:**
- On page load
- After adding entry
- After editing entry
- After deleting entry
- When switching to Dashboard tab

### Feature: Search Entries

**Location**: History tab → Search box

**Purpose**: Find entries by keyword

**Search Fields:**
- Organization name
- Activity
- Description
- Category

**Behavior:**
- Case-insensitive
- Partial match
- Real-time (updates as you type)
- Searches all text fields
- Combines with active filters

**Example:**
- Search "food" finds:
  - Organization: "Food Bank"
  - Activity: "Food sorting"
  - Description: "...prepared food packages"

### Feature: Filter Entries

**Location**: History tab → Filter dropdowns

**Filters Available:**
1. **Organization Filter**
   - Shows all unique organizations
   - Select one to show only its entries
   - "All Organizations" shows everything

2. **Category Filter**
   - Shows all used categories
   - Select one to show only that category
   - "All Categories" shows everything

**Behavior:**
- Filters combine (AND logic)
- Works with search
- Updates entry count
- Clears when "All" selected

### Feature: Sort Entries

**Location**: History tab → Sort dropdown

**Sort Options:**
1. **Date (Newest)** - Default
   - Most recent entries first
   - Sorts by `date` field descending

2. **Date (Oldest)**
   - Oldest entries first
   - Sorts by `date` field ascending

3. **Hours (Most)**
   - Highest hours first
   - Sorts by `hours` field descending

4. **Hours (Least)**
   - Lowest hours first
   - Sorts by `hours` field ascending

**Behavior:**
- Applies to filtered/searched results
- Persists while filtering/searching
- Visual indicator shows active sort

### Feature: Edit Entry

**Location**: History tab → Entry card → Edit button

**Purpose**: Modify existing volunteer entry

**Steps:**
1. Click Edit button on entry
2. Form opens with entry data pre-filled
3. Modify any fields
4. Click "Update Entry" or "Cancel"

**Validation:**
- Same rules as adding entry
- All fields can be changed
- ID and createdAt preserved

**Result:**
- Entry updated in localStorage
- Success toast notification
- Returns to History tab
- Statistics recalculated

**Special Behavior:**
- Submit button text changes to "Update Entry"
- Cancel button appears
- Cancel reverts to add mode
- Entry ID stored in hidden field

### Feature: Delete Entry

**Location**: History tab → Entry card → Delete button

**Purpose**: Remove volunteer entry permanently

**Steps:**
1. Click Delete button
2. Confirmation modal appears
3. Click Confirm or Cancel

**Confirmation Dialog:**
- Title: "Delete Entry"
- Message: "Are you sure you want to delete this volunteer entry? This action cannot be undone."
- Buttons: Confirm (red), Cancel (gray)

**Result (if confirmed):**
- Entry removed from localStorage
- Success toast notification
- Entry disappears from list
- Statistics recalculated

**Result (if cancelled):**
- Modal closes
- No changes made

⚠️ **Warning**: This action is permanent and cannot be undone!

### Feature: Export Data

**Location**: History tab → Export Data button

**Purpose**: Download all volunteer entries as JSON file

**Process:**
1. Click Export Data button
2. Browser download dialog appears
3. File saves to default downloads folder

**File Details:**
- **Format**: JSON
- **Filename**: `volunteer-hours-YYYY-MM-DD.json`
- **Content**: Array of all entries
- **Size**: Varies (typically < 1MB for hundreds of entries)

**Use Cases:**
- Backup volunteer data
- Submit hours to organization
- Move data to another system
- Archive old data

**JSON Structure:**
```json
[
  {entry1},
  {entry2},
  ...
]
```

### Feature: Clear All Data

**Location**: History tab → Clear All button

**Purpose**: Delete all volunteer entries

**Steps:**
1. Click Clear All button
2. Confirmation modal appears
3. Review warning
4. Click Confirm or Cancel

**Confirmation Dialog:**
- Title: "Clear All Data"
- Message: "Are you sure you want to delete all X volunteer entries? This action cannot be undone."
- Buttons: Confirm (red), Cancel (gray)

**Result (if confirmed):**
- All entries deleted from localStorage
- Success toast notification
- Dashboard shows zeros
- History shows empty state
- Filters cleared

⚠️ **Warning**: This deletes ALL data permanently! Export first to keep a backup.

---

## Field Specifications

### Date Field

**Type**: Date picker (HTML5)
**Required**: Yes
**Default**: Today's date
**Validation**:
- Must be valid date
- Cannot be in future
- Maximum date: Today

**Format**:
- Display: MMM DD, YYYY (e.g., "Oct 15, 2024")
- Storage: YYYY-MM-DD (e.g., "2024-10-15")

**Examples**:
- ✅ Valid: Any past date or today
- ❌ Invalid: Tomorrow, next week, etc.

### Organization Field

**Type**: Text input with datalist autocomplete
**Required**: Yes
**Min Length**: 1 character
**Max Length**: None (recommended < 255)
**Validation**:
- Must not be empty
- Whitespace trimmed

**Autocomplete**:
- Shows previously used organizations
- Click suggestion to autofill
- Or type new organization name

**Best Practices**:
- Use consistent names
- Capitalize properly
- Avoid abbreviations unless standard

**Examples**:
- ✅ Good: "Local Food Bank", "City Animal Shelter"
- ⚠️ Acceptable: "Food Bank", "Shelter"
- ❌ Avoid: "FB", "that place", "shelter 2"

### Activity Field

**Type**: Text input
**Required**: Yes
**Min Length**: 1 character
**Max Length**: None (recommended < 500)
**Validation**:
- Must not be empty
- Whitespace trimmed

**Best Practices**:
- Be specific
- Use action words
- Include what you did

**Examples**:
- ✅ Good: "Food sorting and distribution", "Dog walking with puppies", "Reading to kindergarten students"
- ⚠️ Acceptable: "Volunteer shift", "Helped out"
- ❌ Avoid: "Work", "Things", "Stuff"

### Hours Field

**Type**: Number input
**Required**: Yes
**Min Value**: 0.25 (15 minutes)
**Step**: 0.25 (15 minute increments)
**Max Value**: None (reasonable limit: 24)
**Validation**:
- Must be numeric
- Must be >= 0.25
- Decimals allowed

**Format**:
- Input: Decimal (use period, not comma)
- Display: Decimal with 1-2 places

**Examples**:
- ✅ Valid: 1, 1.5, 2.25, 8.75
- ❌ Invalid: 0, 0.1, -1, "two"

**Common Values**:
- 0.25 = 15 minutes
- 0.5 = 30 minutes
- 1 = 1 hour
- 1.5 = 1 hour 30 minutes
- 2.5 = 2 hours 30 minutes

### Category Field

**Type**: Dropdown select
**Required**: No
**Default**: None (empty)
**Options**:
1. (None/Empty)
2. Education
3. Environment
4. Health
5. Social Services
6. Arts & Culture
7. Animal Welfare
8. Community Development
9. Other

**Purpose**:
- Organize entries
- Filter by type
- Generate category statistics

**Selection Guide**:
- **Education**: Tutoring, mentoring, teaching, literacy
- **Environment**: Clean-up, conservation, recycling, gardening
- **Health**: Hospitals, clinics, health fairs, wellness
- **Social Services**: Food banks, shelters, community support
- **Arts & Culture**: Museums, theaters, cultural events
- **Animal Welfare**: Shelters, rescues, wildlife
- **Community Development**: Neighborhood improvement, advocacy
- **Other**: Doesn't fit other categories

### Description Field

**Type**: Textarea (multi-line)
**Required**: No
**Rows**: 3
**Max Length**: None (recommended < 1000)
**Validation**: None

**Purpose**:
- Add extra details
- Note special achievements
- Record impact
- Include memorable moments

**Best Practices**:
- Include specific numbers/outcomes
- Note who you worked with
- Mention learning experiences
- Record impact metrics

**Examples**:
- ✅ Good: "Sorted 200 lbs of food donations. Prepared 50 family food packages. Worked with team of 8 volunteers."
- ✅ Good: "Walked 5 shelter dogs (Buddy, Max, Luna, Bailey, Charlie). Helped socialize 2 new arrivals."
- ⚠️ Acceptable: "Regular volunteer shift. Good experience."
- ❌ Poor: "Did stuff"

---

## Calculations & Statistics

### Total Hours

**Formula**: `SUM(hours)` for all entries

**Precision**: Displayed to 1 decimal place

**Example**:
```
Entry 1: 3.5 hours
Entry 2: 2.0 hours
Entry 3: 4.25 hours
Total: 9.8 hours (displays as "9.8")
```

### Total Entries

**Formula**: `COUNT(*)` of all entries

**Display**: Integer

**Example**:
```
3 entries logged = displays "3"
```

### Organizations Count

**Formula**: `COUNT(DISTINCT organization)`

**Display**: Integer

**Example**:
```
Entries:
- Food Bank
- Food Bank
- Animal Shelter
- Library
- Library

Organizations Count: 3 (Food Bank, Animal Shelter, Library)
```

### This Month Hours

**Formula**: `SUM(hours)` WHERE `entry.date.month == current.month AND entry.date.year == current.year`

**Resets**: Automatically on the 1st of each month

**Example** (if today is October 15, 2024):
```
October 5: 3 hours  ✓ counted
October 12: 2 hours ✓ counted
September 28: 4 hours ✗ not counted (last month)
This Month: 5.0 hours
```

### Hours by Organization

**Calculation**:
1. Group entries by organization
2. Sum hours for each organization
3. Sort by hours (descending)
4. Take top 10

**Display**: Bar chart with organization name, visual bar, hours value

**Example**:
```
Food Bank:        7.0 hours ████████████████████
Animal Shelter:   4.5 hours ████████████
Library:          2.0 hours █████
```

---

## Data Management

### localStorage Structure

**Key**: `volunteerEntries`

**Value**: JSON string of array

**Example**:
```javascript
localStorage.setItem('volunteerEntries', JSON.stringify([
  {entry1},
  {entry2}
]));
```

### Storage Capacity

**Typical Limit**: 5-10 MB per origin

**Approximate Capacity**:
- Average entry: ~250 bytes
- Estimated capacity: 20,000 - 40,000 entries
- Practical limit: ~1,000 entries (well within limits)

### Data Persistence

**Persists**:
- Across browser sessions
- After browser restart
- Until explicitly cleared

**Lost when**:
- Browser data/cookies cleared
- Using incognito/private mode
- Browser uninstalled without backup

### Backup Strategy

**Recommended**:
- Export monthly
- Store exports in cloud (Google Drive, Dropbox)
- Keep exports when applying for awards/scholarships

---

## Technical Specifications

### Browser Requirements

**Minimum Versions**:
- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile browsers: iOS 14+, Android Chrome

**Required APIs**:
- localStorage
- ES6 JavaScript (classes, arrow functions, template literals)
- Fetch API (for PWA manifest)
- Date API

### Performance

**Load Time**: < 2 seconds on 3G connection

**Responsiveness**:
- Form interactions: < 100ms
- Tab switching: < 300ms
- Entry filtering/search: < 200ms

**Memory**:
- Typical usage: < 50 MB
- 1000 entries: < 100 MB

### Security

**XSS Protection**:
- All user input HTML-escaped before display
- No `innerHTML` with user content
- No `eval()` or similar functions

**Data Privacy**:
- All data stored locally only
- No network requests
- No tracking or analytics
- No external dependencies

### Accessibility

**WCAG 2.1 Level AA** compliance:
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Touch target sizes (44px minimum)
- Focus indicators

### PWA Features

**Manifest**: `manifest.json`
- Name: "Volunteer Hours Tracker"
- Short name: "VolTracker"
- Icons: SVG checkmark
- Display: Standalone
- Theme color: #4CAF50

**Capabilities**:
- Install to home screen
- Offline functionality
- Standalone window (mobile)

---

## Error Messages

### Validation Errors

**Empty Required Field**:
> "This field is required"

**Invalid Hours**:
> "Hours must be at least 0.25 (15 minutes)"

**Future Date**:
> "Date cannot be in the future"

### Success Messages

**Entry Added**:
> "Entry added successfully"

**Entry Updated**:
> "Entry updated successfully"

**Entry Deleted**:
> "Entry deleted"

**Data Exported**:
> "Data exported successfully"

**All Data Cleared**:
> "All entries cleared"

**Edit Cancelled**:
> "Edit cancelled"

### Error Messages

**Storage Full** (rare):
> "Error saving data - storage may be full"

**Storage Load Error**:
> "Error loading saved data"

---

## Version History

### Version 1.0 (October 2024)
- Initial release
- Core CRUD functionality
- Dashboard statistics
- Search, filter, sort
- Export to JSON
- Mobile responsive
- PWA support
- 50+ automated tests

---

## Quick Reference Tables

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Move to next form field |
| Shift+Tab | Move to previous form field |
| Enter | Submit form (when in field) |
| Escape | Close modal/cancel edit |

### Field Validation Summary

| Field | Required | Min | Max | Type |
|-------|----------|-----|-----|------|
| Date | Yes | Past | Today | Date |
| Organization | Yes | 1 char | - | Text |
| Activity | Yes | 1 char | - | Text |
| Hours | Yes | 0.25 | - | Number |
| Category | No | - | - | Select |
| Description | No | - | - | Textarea |

### Feature Location Quick Reference

| Feature | Tab | Section |
|---------|-----|---------|
| Add Entry | Log Hours | Form |
| Edit Entry | History | Entry Card → Edit |
| Delete Entry | History | Entry Card → Delete |
| View Stats | Dashboard | Top Cards |
| Search | History | Search Box |
| Filter | History | Dropdowns |
| Sort | History | Sort Dropdown |
| Export | History | Export Button |
| Clear All | History | Clear All Button |

---

**End of Reference Manual**

*For step-by-step instructions, see USER_GUIDE.md*
*For common questions, see FAQ.md*
