# Volunteer Hours Tracker - Frequently Asked Questions (FAQ)

**Version 1.0** | Last Updated: October 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Data & Privacy](#data--privacy)
3. [Using the App](#using-the-app)
4. [Technical Issues](#technical-issues)
5. [Features & Limitations](#features--limitations)
6. [Export & Backup](#export--backup)

---

## Getting Started

### Do I need to create an account?

**No!** The Volunteer Hours Tracker works completely without any account, registration, or login. Just open the app and start using it immediately. Your data is stored locally on your device.

### Can I use this on my phone?

**Yes!** The app is designed to work on mobile devices. For the best experience:
- Open the app in your mobile browser (Chrome, Safari, Firefox)
- Tap your browser's menu and select "Add to Home Screen"
- The app will work like a native mobile app, even offline

### Does this work offline?

**Yes!** The app is a Progressive Web Application (PWA) that works completely offline. Once you've loaded the app once, it will continue to work even without an internet connection.

### Can I use this on multiple devices?

Currently, each device stores its own data separately. If you want to use the app on multiple devices, you'll need to:
- Export your data from one device
- Manually import it on another device

**Note:** Phase 2 (coming soon) will add cloud sync capabilities.

---

## Data & Privacy

### Where is my data stored?

Your data is stored in your web browser's **local storage** on your device. It never leaves your device and is not sent to any server.

### Is my data secure?

- ✅ Your data stays on your device (not sent anywhere)
- ✅ No tracking or analytics
- ✅ No accounts or passwords to compromise
- ✅ XSS protection built-in
- ⚠️ Browser data can be cleared by accident
- ⚠️ If someone has access to your device, they can access your data

**Best Practice:** Export your data regularly as a backup!

### What happens if I clear my browser data?

**Your volunteer hours will be deleted.** When you clear browser data/cache, you also delete local storage where your volunteer entries are saved.

**To prevent data loss:**
- Don't use Private/Incognito browsing mode
- Export your data regularly
- Store exports in cloud storage (Google Drive, Dropbox, etc.)

### Can other people see my volunteer hours?

No. Your data is completely private to your device and browser. Even if multiple people use the same computer, each browser profile has its own separate data.

### What data does the app collect?

**None.** The app:
- ❌ Does NOT collect analytics
- ❌ Does NOT track your usage
- ❌ Does NOT send data to any server
- ❌ Does NOT use cookies for tracking
- ✅ Only stores your volunteer entries locally

---

## Using the App

### How do I enter volunteer hours in minutes?

Use decimal hours:
- 15 minutes = 0.25 hours
- 30 minutes = 0.5 hours
- 45 minutes = 0.75 hours
- 1 hour 30 minutes = 1.5 hours
- 2 hours 15 minutes = 2.25 hours

**Formula:** `minutes ÷ 60 = decimal hours`

### Can I log hours for past dates?

**Yes!** You can enter volunteer hours for any past date. The date picker allows you to select any date in the past.

**You cannot:** Enter hours for future dates (the app prevents this).

### Can I edit an entry after I've added it?

**Yes!**
1. Go to the History tab
2. Find the entry you want to edit
3. Click the "Edit" button
4. Make your changes
5. Click "Update Entry"

### Can I delete an entry by mistake?

The app has a confirmation popup when you click "Delete" to prevent accidental deletions. However, **once you confirm the deletion, it cannot be undone.**

### Why do I need to enter an organization name every time?

The app learns from your entries! After you've entered an organization once, it will suggest it in the future. Just start typing and select from the suggestions.

**Tip:** Use consistent names (always "Food Bank" not sometimes "The Food Bank" or "Food bank") for better organization.

### What's the difference between Activity and Description?

- **Activity** (required): What you did (e.g., "Food sorting", "Dog walking")
- **Description** (optional): Extra details (e.g., "Sorted 200 lbs, prepared 50 packages")

Think of Activity as the title, and Description as the notes.

### Do I have to select a category?

**No**, categories are optional. However, using categories helps you:
- Organize your volunteer work
- Filter entries by type
- See statistics by category (future feature)

### Can I add custom categories?

Not currently. The app provides these categories:
- Education
- Environment
- Health
- Social Services
- Arts & Culture
- Animal Welfare
- Community Development
- Other

**Use "Other"** for activities that don't fit the standard categories.

---

## Technical Issues

### The app won't load or is blank

**Try these solutions:**

1. **Check JavaScript**: Make sure JavaScript is enabled in your browser
2. **Try another browser**: Test in Chrome, Firefox, or Safari
3. **Clear cache**: Clear your browser cache (but note this may delete your data!)
4. **Check console**: Press F12 and look for error messages in the Console tab
5. **Update browser**: Make sure you're using a modern browser version

**Minimum browser versions:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### My data disappeared!

**Common causes:**

1. **Browser data cleared**: Check if browser cache/data was cleared
2. **Different browser**: Make sure you're using the same browser
3. **Different profile**: Check if you're in a different browser profile
4. **Incognito mode**: Incognito/private mode doesn't save data permanently

**Solutions:**
- Check if you have a recent export file you can restore from
- Look in browser's "Restore previous session" if it crashed
- Check if another browser profile has the data

### The app is slow or freezing

**Possible causes:**

1. **Too many entries**: Hundreds of entries can slow down the app
2. **Old browser**: Update to the latest browser version
3. **Low memory**: Close other tabs/applications

**Solutions:**
- Export old entries and clear them from the app
- Use a modern browser (Chrome, Firefox, Safari)
- Restart your browser
- Try on a different device

### I can't enter decimal hours

Make sure you're using a **period (.)** not a comma:
- ✅ Correct: `2.5`
- ❌ Wrong: `2,5`

Also note the minimum is 0.25 hours (15 minutes).

### The form won't submit

Check that you've filled in all **required fields**:
- Date (must not be in the future)
- Organization (must not be empty)
- Activity (must not be empty)
- Hours (must be at least 0.25)

The "Add Entry" button will be disabled if any required field is invalid.

### Chart isn't showing my data

**Possible causes:**

1. **No data**: You need to add some volunteer entries first
2. **Browser compatibility**: Chart.js requires a modern browser
3. **JavaScript error**: Check browser console (F12) for errors

---

## Features & Limitations

### Can multiple people share one account?

There are no accounts in this version. Each browser/device has its own separate data.

If multiple people use the same browser profile, they'll see the same data (not recommended).

**Better approach:**
- Each person uses their own browser profile, or
- Each person installs the app on their own phone/device

### Can I track volunteer hours for a group or organization?

The current version is designed for individual tracking.

**Workaround:**
- Create a shared device with the app installed
- Everyone logs their hours on that device

**Coming soon:** Phase 4 will add team/organization features!

### Can I generate reports or certificates?

Not in the current version. You can:
- View your statistics on the Dashboard
- Export your data as JSON
- Take screenshots of your Dashboard for sharing

**Coming soon:** Phase 4 will add PDF reports and certificates!

### Is there a limit to how many hours I can log?

**No technical limit!** However:
- The app may slow down with hundreds of entries
- Browser storage limits are typically 5-10 MB (thousands of entries)

### Can I track hours for multiple years?

**Yes!** There's no time limit. You can track volunteer hours indefinitely.

### Can I sync across devices?

Not in the current version. Each device stores data separately.

**Coming soon:** Phase 3 will add Google Drive sync!

### Can I export to Excel or PDF?

Currently, the app exports to JSON format only.

**To use in Excel:**
1. Export your data (JSON file)
2. Open Excel
3. Data → Get Data → From File → From JSON
4. Select your export file
5. Excel will convert it to a table

**Coming soon:** Phase 4 will add direct CSV and PDF export!

---

## Export & Backup

### How do I export my data?

1. Go to the **History** tab
2. Click **Export Data** button
3. A JSON file will download with your data
4. Filename format: `volunteer-hours-YYYY-MM-DD.json`

### What is JSON format?

JSON (JavaScript Object Notation) is a standard data format that's:
- Human-readable (you can open it in a text editor)
- Machine-readable (can be imported into other systems)
- Widely supported (Excel, Google Sheets, databases, etc.)

### How often should I export my data?

**Recommended schedule:**
- Weekly: If you log hours frequently
- Monthly: For regular backups
- Before: Clearing browser data, updating your browser, or changing devices

**Best practice:** Store exports in cloud storage (Google Drive, Dropbox) for safekeeping.

### Can I import data back into the app?

Not currently through the UI. However, if you have a JSON export, you can manually import it:

1. Press F12 to open browser console
2. Paste this code (replace with your data):
```javascript
const data = [/* paste your JSON data here */];
localStorage.setItem('volunteerEntries', JSON.stringify(data));
location.reload();
```

**Coming soon:** Phase 2 will add a user-friendly import feature!

### What if my export file is corrupted?

If you can't open your export:
1. Try opening in a text editor to verify it's valid JSON
2. Check file size (should not be 0 bytes)
3. Try exporting again
4. Restore from an older export if available

### Can I share my export with my school/employer?

**Yes!** The export contains all your volunteer data and can be:
- Emailed as an attachment
- Uploaded to Google Drive/Dropbox
- Converted to Excel/Sheets for review
- Submitted for volunteer hour requirements

---

## Still Have Questions?

### Additional Resources

- **User Guide**: See `USER_GUIDE.md` for step-by-step instructions
- **Reference Manual**: See `REFERENCE.md` for complete feature documentation
- **Screenshot Guide**: See `SCREENSHOTS.md` for visual reference
- **Technical Docs**: See main `README.md` for developer information

### Reporting Issues

If you've found a bug or have a feature request:
1. Check the documentation first
2. Try the troubleshooting steps above
3. Contact your organization's administrator
4. Report issues to the developer team

### Future Features

The app is under active development! Planned features include:

**Phase 2 - Backend & Auth** (Coming Q4 2025)
- User accounts with secure login
- Cloud storage of data
- Data import/restore functionality

**Phase 3 - Google Integration** (Coming Q1 2026)
- Google Drive sync
- Export to Google Sheets
- Calendar integration

**Phase 4 - Advanced Features** (Coming Q2 2026)
- Organization/team features
- PDF reports and certificates
- Achievement badges
- Email reports
- Custom categories

**Phase 5 - DevOps & Scale** (Coming Q3 2026)
- Mobile apps (iOS/Android)
- Advanced analytics
- API access
- Multi-language support

---

**Thank you for using Volunteer Hours Tracker!**

*Last updated: October 2025 | Version 1.0*
