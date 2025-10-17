# iOS App Build - Volunteer Hours Tracker

## Project Overview

Convert the Winefred Volunteer Hours Tracker (Phase 1 PWA) into a native iOS application using Capacitor.

## Parent Project

**Location:** `../` (parent directory)
**Status:** Phase 1 Complete - Production Ready PWA
**Documentation:** See `../README.md` and `../IOS_APP_MIGRATION_REPORT.md`

## Current Phase 1 Assets (to be wrapped)

```
../
├── index.html          (319 lines) - Main UI
├── app.js              (813 lines) - Core logic
├── report-generator.js (738 lines) - Reporting engine
├── styles.css          (857 lines) - Responsive styles
├── manifest.json       (18 lines)  - PWA config
└── tests/              - Test suite (90+ tests passing)
```

## Objective

Create a Capacitor-based iOS app that:
1. Wraps the existing web app in native iOS container
2. Replaces localStorage with native iOS storage (Capacitor Preferences)
3. Adds iOS-specific features (File System, Share, Haptics)
4. Prepares for App Store submission
5. Maintains 100% feature parity with Phase 1 web app

## Requirements

### 1. Project Initialization

- Initialize npm project (`package.json`)
- Install Capacitor core, CLI, and iOS platform
- Configure `capacitor.config.ts`:
  - App ID: `com.winefred.volunteerhours`
  - App Name: `Volunteer Hours`
  - Web directory: Link to parent files (or copy)
- Generate iOS project structure

### 2. Storage Migration

**Current Implementation:**
```javascript
// Uses browser localStorage
localStorage.setItem('volunteerEntries', JSON.stringify(entries));
localStorage.getItem('volunteerEntries');
```

**New Implementation:**
- Install `@capacitor/preferences`
- Create `storage-adapter.js` abstraction layer
- Update `app.js` to use async storage methods
- Maintain backward compatibility for web version
- Test data persistence across app restarts

### 3. iOS-Specific Features

Install and integrate:

**A. File System (`@capacitor/filesystem`):**
- Export volunteer data to iOS Documents folder
- Support native file save dialogs

**B. Share (`@capacitor/share`):**
- Add iOS share sheet integration
- Share reports via native iOS share dialog

**C. Haptics (`@capacitor/haptics`):**
- Add haptic feedback on:
  - Entry deletion
  - Form submission
  - Button taps (optional, subtle)

**D. Splash Screen (`@capacitor/splash-screen`):**
- Configure splash screen with brand colors (#4CAF50)
- 2-second display duration

**E. Status Bar (`@capacitor/status-bar`):**
- Style to match app header
- Dark content on green background

**F. Keyboard (`@capacitor/keyboard`):**
- Proper keyboard handling
- Resize behavior for forms

### 4. App Store Preparation

**Icons:**
- Generate all required iOS icon sizes (1024×1024 down to 29×29)
- Use existing PWA icon as base (green checkmark)
- Tool: Use `cordova-res` or manual generation

**Splash Screen:**
- Design splash screen matching app branding
- Green background (#4CAF50)
- White text/logo

**Metadata:**
- Create `docs/privacy-policy.md`
- Create `docs/terms-of-service.md`
- Prepare app description and keywords

**Info.plist Configuration:**
- App permissions (if any needed)
- URL schemes
- Supported orientations (portrait primary)

### 5. Code Structure

**Files to Create:**

```
ios-app/
├── package.json                    # Dependencies
├── capacitor.config.ts             # Capacitor config
├── storage-adapter.js              # Storage abstraction
├── app-enhanced.js                 # Modified app.js with Capacitor
├── ios/                            # Generated iOS project
│   ├── App/
│   └── Pods/
├── resources/
│   ├── icon.png                    # 1024×1024 app icon
│   └── splash.png                  # Splash screen
├── docs/
│   ├── privacy-policy.md
│   └── terms-of-service.md
├── README.md                       # iOS app specific docs
└── USER_PROMPT.md                  # This file
```

**Files to Link/Copy from Parent:**
- index.html (may need minor modifications)
- styles.css (no changes needed)
- report-generator.js (no changes needed)

### 6. Testing Requirements

**Simulator Testing:**
- Test on iPhone SE (small screen)
- Test on iPhone 14 Pro (standard)
- Test on iPad Pro (tablet)

**Feature Testing:**
- All CRUD operations
- Dashboard statistics
- Search/filter/sort
- Report generation (all formats)
- Data export with native file save
- Share functionality
- Haptic feedback
- Splash screen display
- Offline functionality
- Data persistence across app restarts

**Performance Testing:**
- Launch time < 2 seconds
- Smooth scrolling
- No memory leaks
- Responsive UI

### 7. Deliverables

1. ✅ Fully functional iOS app running in Xcode
2. ✅ All Phase 1 features working natively
3. ✅ Native storage implementation
4. ✅ iOS-specific features integrated
5. ✅ App Store ready assets (icons, splash, metadata)
6. ✅ Documentation for building and running
7. ✅ Test reports showing all features working
8. ✅ README with build instructions

### 8. Technical Specifications

**Minimum iOS Version:** 13.0+
**Xcode Version:** 14.0+
**Capacitor Version:** 5.5.0+
**Node.js Version:** 18.0+

**Plugins Required:**
```json
{
  "@capacitor/core": "^5.5.0",
  "@capacitor/ios": "^5.5.0",
  "@capacitor/preferences": "^5.0.6",
  "@capacitor/filesystem": "^5.1.4",
  "@capacitor/share": "^5.0.6",
  "@capacitor/haptics": "^5.0.6",
  "@capacitor/splash-screen": "^5.0.6",
  "@capacitor/status-bar": "^5.0.6",
  "@capacitor/keyboard": "^5.0.6"
}
```

### 9. Build Commands

**Setup:**
```bash
npm install
npx cap init "Volunteer Hours" "com.winefred.volunteerhours"
npx cap add ios
```

**Development:**
```bash
npx cap sync ios      # Sync web assets to iOS
npx cap open ios      # Open in Xcode
```

**Testing:**
```bash
# Run in Xcode simulator
# Or build for device
```

### 10. Important Constraints

**DO:**
- ✅ Maintain 100% feature parity with Phase 1 web app
- ✅ Use Capacitor plugins for native features
- ✅ Test thoroughly on multiple device sizes
- ✅ Follow iOS Human Interface Guidelines
- ✅ Keep code clean and documented
- ✅ Create comprehensive README

**DON'T:**
- ❌ Remove or break any existing features
- ❌ Change the UI/UX significantly
- ❌ Add dependencies not in requirements
- ❌ Skip testing on physical device (if possible)
- ❌ Ignore iOS design guidelines
- ❌ Delete or modify parent directory files

### 11. References

**Parent Documentation:**
- `../README.md` - Full project documentation
- `../IOS_APP_MIGRATION_REPORT.md` - Detailed iOS migration guide
- `../QUICKSTART.md` - Quick start guide
- `../docs/USER_GUIDE.md` - User documentation

**External Resources:**
- Capacitor Docs: https://capacitorjs.com/docs
- iOS Development: https://developer.apple.com/ios/
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/

### 12. Success Criteria

The project is complete when:

1. ✅ iOS app runs in Xcode simulator without errors
2. ✅ All 90+ automated tests still pass (in web version)
3. ✅ Manual testing confirms all features work natively
4. ✅ Data persists across app restarts using native storage
5. ✅ Native iOS features (share, haptics, file system) work
6. ✅ App icons and splash screen display correctly
7. ✅ Performance meets requirements (< 2s launch, smooth UI)
8. ✅ README documents how to build and run
9. ✅ Privacy policy and terms created
10. ✅ App is ready for App Store submission (architecturally)

### 13. Timeline Estimate

**Estimated Duration:** 2-4 weeks (14-28 days)

**Week 1:** Setup and initialization (Days 1-5)
**Week 2:** Storage migration and iOS features (Days 6-10)
**Week 3:** App Store prep and testing (Days 11-15)
**Week 4:** Polish and documentation (Days 16-20)

### 14. Notes

- This is a **subproject** - keep all iOS-specific code here
- Parent directory (`../`) contains the Phase 1 web app - DO NOT MODIFY
- Create symlinks or copy files as needed to avoid duplication
- Test frequently in Xcode simulator
- Physical device testing highly recommended before "done"
- Ask for clarification if any requirement is unclear

---

**Ready to build the iOS app!** 🚀

See `../IOS_APP_MIGRATION_REPORT.md` for detailed step-by-step instructions.
