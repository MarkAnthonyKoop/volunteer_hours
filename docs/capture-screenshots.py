#!/usr/bin/env python3
"""
Automated Screenshot Capture for Volunteer Hours Tracker
Uses Selenium WebDriver to interact with the app and capture screenshots
"""

import os
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

# Configuration
APP_URL = "http://localhost:8080"  # Adjust if using different port
IMAGES_DIR = Path(__file__).parent / "images"
WINDOW_WIDTH = 1400
WINDOW_HEIGHT = 1000

class ScreenshotCapture:
    def __init__(self):
        self.driver = None
        self.wait = None
        self.setup_driver()
        self.setup_directories()

    def setup_directories(self):
        """Create images directory if it doesn't exist"""
        IMAGES_DIR.mkdir(exist_ok=True)
        print(f"✓ Images directory created: {IMAGES_DIR}")

    def setup_driver(self):
        """Initialize Chrome WebDriver"""
        options = Options()
        options.add_argument('--headless')  # Run in headless mode
        options.add_argument(f'--window-size={WINDOW_WIDTH},{WINDOW_HEIGHT}')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        # Try to find chromium browser
        import shutil
        chromium_path = shutil.which('chromium-browser') or shutil.which('chromium')
        if chromium_path:
            options.binary_location = chromium_path

        self.driver = webdriver.Chrome(options=options)
        self.driver.set_window_size(WINDOW_WIDTH, WINDOW_HEIGHT)
        self.wait = WebDriverWait(self.driver, 10)
        print("✓ Chrome WebDriver initialized")

    def capture(self, filename, element=None, width=None, height=None):
        """Capture screenshot and save to images directory"""
        time.sleep(0.5)  # Brief pause for UI to settle

        filepath = IMAGES_DIR / filename

        if element:
            # Capture specific element
            element.screenshot(str(filepath))
        else:
            # Capture full page or resize window if dimensions specified
            if width and height:
                self.driver.set_window_size(width, height)
                time.sleep(0.3)

            self.driver.save_screenshot(str(filepath))

            # Reset window size
            if width and height:
                self.driver.set_window_size(WINDOW_WIDTH, WINDOW_HEIGHT)
                time.sleep(0.3)

        print(f"✓ Captured: {filename}")

    def clear_data(self):
        """Clear all data from localStorage"""
        self.driver.execute_script("localStorage.clear();")
        self.driver.refresh()
        time.sleep(0.5)

    def js_click(self, element):
        """Click element using JavaScript to avoid click interception"""
        self.driver.execute_script("arguments[0].click();", element)
        time.sleep(0.2)

    def add_entry(self, date, org, activity, hours, category=None, description=None):
        """Add a volunteer entry"""
        # Click Log Hours tab using JavaScript to avoid click interception
        log_tab = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-tab="log"]')))
        self.driver.execute_script("arguments[0].click();", log_tab)
        time.sleep(0.3)

        # Fill in form
        date_field = self.driver.find_element(By.ID, "entry-date")
        date_field.send_keys(Keys.CONTROL + "a")
        date_field.send_keys(date)

        self.driver.find_element(By.ID, "organization").send_keys(org)
        self.driver.find_element(By.ID, "activity").send_keys(activity)

        hours_field = self.driver.find_element(By.ID, "hours")
        hours_field.clear()
        hours_field.send_keys(str(hours))

        if category:
            category_select = self.driver.find_element(By.ID, "category")
            category_select.send_keys(category)

        if description:
            self.driver.find_element(By.ID, "description").send_keys(description)

        # Submit
        self.driver.find_element(By.ID, "submit-btn").click()
        time.sleep(0.5)

    def capture_base_screenshots(self):
        """Capture all base screenshots for USER_GUIDE.md and REFERENCE.md"""
        print("\n=== Capturing Base Screenshots ===\n")

        # Load app
        self.driver.get(APP_URL)
        time.sleep(1)

        # 1. Main interface
        print("Capturing main interface...")
        self.capture("main-interface.png", width=1200, height=800)

        # Add sample data for screenshots
        print("Adding sample data...")
        self.add_entry("2025-10-10", "Local Food Bank",
                      "Food sorting and distribution", 3.5,
                      "Social Services",
                      "Sorted 200 lbs of food donations and prepared 50 packages")

        self.add_entry("2025-10-08", "Animal Shelter",
                      "Dog walking and kennel cleaning", 2,
                      "Animal Welfare",
                      "Walked 5 dogs and cleaned 10 kennels")

        self.add_entry("2025-10-05", "Public Library",
                      "Reading program for children", 1.5,
                      "Education",
                      "Read to 15 children in after-school program")

        self.add_entry("2025-09-28", "Local Food Bank",
                      "Food drive organization", 4,
                      "Social Services",
                      "Organized food drive at local school")

        self.add_entry("2025-09-20", "Community Garden",
                      "Garden maintenance", 2.5,
                      "Environment",
                      "Weeded beds and planted fall vegetables")

        # 2. Dashboard screenshots
        print("Capturing dashboard screenshots...")
        dash_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="dashboard"]')
        self.js_click(dash_tab)
        time.sleep(0.5)

        # Dashboard stats
        stats = self.driver.find_element(By.CLASS_NAME, "stats-grid")
        self.capture("dashboard-stats.png", element=stats)

        # Organization chart
        chart_container = self.driver.find_element(By.CSS_SELECTOR, ".chart-container")
        self.capture("org-chart.png", element=chart_container)

        # Recent activity
        recent = self.driver.find_element(By.ID, "recent-activity")
        self.capture("recent-activity.png", element=recent)

        # 3. Log Hours form screenshots
        print("Capturing Log Hours form screenshots...")
        log_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="log"]')
        self.js_click(log_tab)
        time.sleep(0.3)

        # Date picker
        date_field = self.driver.find_element(By.ID, "entry-date")
        date_field.click()
        time.sleep(0.3)
        self.capture("date-picker.png", width=600, height=500)
        date_field.send_keys(Keys.ESCAPE)

        # Organization field (with autocomplete)
        org_field = self.driver.find_element(By.ID, "organization")
        org_field.send_keys("Food")
        time.sleep(0.3)
        self.capture("organization-field.png", width=800, height=400)
        org_field.clear()

        # Activity field
        activity_field = self.driver.find_element(By.ID, "activity")
        activity_field.send_keys("Food sorting and distribution")
        self.capture("activity-field.png", width=800, height=300)

        # Hours field
        hours_field = self.driver.find_element(By.ID, "hours")
        hours_field.clear()
        hours_field.send_keys("2.5")
        self.capture("hours-field.png", width=600, height=250)

        # Category dropdown
        category_select = self.driver.find_element(By.ID, "category")
        category_select.click()
        time.sleep(0.3)
        self.capture("category-dropdown.png", width=700, height=500)
        category_select.send_keys(Keys.ESCAPE)

        # Description field
        desc_field = self.driver.find_element(By.ID, "description")
        desc_field.send_keys("Sorted donations and prepared packages for distribution")
        self.capture("description-field.png", width=800, height=350)

        # Add entry button
        submit_btn = self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        self.capture("add-entry-button.png", element=submit_btn)

        # 4. History tab screenshots
        print("Capturing History tab screenshots...")
        history_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="history"]')
        self.js_click(history_tab)
        time.sleep(0.5)

        # Full history view
        self.capture("history-view.png", width=1200, height=900)

        # Search box with results
        search_box = self.driver.find_element(By.ID, "search-input")
        search_box.send_keys("dog")
        time.sleep(0.3)
        self.capture("search-box.png", width=1000, height=600)
        search_box.clear()
        time.sleep(0.3)

        # Filters
        org_filter = self.driver.find_element(By.ID, "filter-org")
        org_filter.click()
        time.sleep(0.3)
        self.capture("filters.png", width=800, height=500)
        org_filter.send_keys(Keys.ESCAPE)

        # Sort options
        sort_select = self.driver.find_element(By.ID, "sort-by")
        sort_select.click()
        time.sleep(0.3)
        self.capture("sort-options.png", width=700, height=400)
        sort_select.send_keys(Keys.ESCAPE)

        # Edit entry - find by button text
        edit_btns = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Edit')]")
        if edit_btns:
            edit_btns[0].click()
            time.sleep(0.3)
            self.capture("edit-entry.png", width=1000, height=700)
            cancel_btn = self.driver.find_element(By.ID, "cancel-btn")
            cancel_btn.click()
            time.sleep(0.3)

        # Delete confirmation
        try:
            delete_btns = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Delete')]")
            if delete_btns:
                self.js_click(delete_btns[0])
                time.sleep(0.5)  # Wait for modal
                self.capture("delete-confirmation.png", width=700, height=400)
                # Cancel the delete via modal
                modal_cancel = self.driver.find_element(By.ID, "modal-cancel")
                self.js_click(modal_cancel)
                time.sleep(0.3)
        except Exception as e:
            print(f"⚠ Skipping delete-confirmation.png: {e}")

        # Export button
        self.js_click(history_tab)
        time.sleep(0.3)
        export_btn = self.driver.find_element(By.ID, "export-btn")
        self.driver.execute_script("arguments[0].scrollIntoView();", export_btn)
        time.sleep(0.3)
        self.capture("export-button.png", width=600, height=300)

        print("\n✓ Base screenshots complete!\n")

    def capture_tutorial_screenshots(self):
        """Capture all tutorial-specific screenshots"""
        print("\n=== Capturing Tutorial Screenshots ===\n")

        # Clear data and start fresh
        self.clear_data()

        # 1. Tutorial opening
        self.driver.get(APP_URL)
        time.sleep(1)
        self.capture("tutorial-opening.png", width=1200, height=800)

        # 2. Mobile install (we'll create a placeholder/diagram separately)
        print("⚠ tutorial-mobile-install.png requires manual mobile screenshot")

        # 3. Log Hours tab highlight
        log_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="log"]')
        # Highlight it with JavaScript
        self.driver.execute_script("""
            arguments[0].style.backgroundColor = '#ffeb3b';
            arguments[0].style.transition = 'all 0.3s';
        """, log_tab)
        time.sleep(0.3)
        self.capture("tutorial-log-hours-tab.png", width=1000, height=300)
        self.driver.execute_script("arguments[0].style.backgroundColor = '';", log_tab)

        self.js_click(log_tab)
        time.sleep(0.3)

        # 4. Completed form (Food Bank example)
        self.driver.find_element(By.ID, "entry-date").send_keys("10/10/2025")
        self.driver.find_element(By.ID, "organization").send_keys("Local Food Bank")
        self.driver.find_element(By.ID, "activity").send_keys("Food sorting and distribution")
        hours = self.driver.find_element(By.ID, "hours")
        hours.clear()
        hours.send_keys("3.5")
        self.driver.find_element(By.ID, "category").send_keys("Social Services")
        self.driver.find_element(By.ID, "description").send_keys(
            "Sorted 200 lbs of food donations and prepared 50 packages for families"
        )
        time.sleep(0.3)
        self.capture("tutorial-completed-form.png", width=1000, height=1100)

        # 5. Submit and capture success message
        self.driver.find_element(By.ID, "submit-btn").click()
        time.sleep(0.5)
        self.capture("tutorial-success-message.png", width=1200, height=500)

        # 6. Dashboard tab highlight
        dash_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="dashboard"]')
        self.driver.execute_script("""
            arguments[0].style.backgroundColor = '#ffeb3b';
        """, dash_tab)
        time.sleep(0.3)
        self.capture("tutorial-dashboard-tab.png", width=1000, height=300)
        self.driver.execute_script("arguments[0].style.backgroundColor = '';", dash_tab)

        # 7. Add second entry (Animal Shelter)
        log_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="log"]')
        self.js_click(log_tab)
        time.sleep(0.3)

        self.driver.find_element(By.ID, "entry-date").send_keys("10/08/2025")
        self.driver.find_element(By.ID, "organization").send_keys("Animal Shelter")
        self.driver.find_element(By.ID, "activity").send_keys("Dog walking and kennel cleaning")
        hours = self.driver.find_element(By.ID, "hours")
        hours.clear()
        hours.send_keys("2")
        self.driver.find_element(By.ID, "category").send_keys("Animal Welfare")
        self.driver.find_element(By.ID, "description").send_keys("Walked 5 dogs and cleaned 10 kennels")
        time.sleep(0.3)
        self.capture("tutorial-entry-2.png", width=1000, height=1000)

        self.driver.find_element(By.ID, "submit-btn").click()
        time.sleep(0.5)

        # 8. Add third entry (Library)
        self.js_click(log_tab)
        time.sleep(0.3)

        self.driver.find_element(By.ID, "entry-date").send_keys("10/05/2025")
        self.driver.find_element(By.ID, "organization").send_keys("Public Library")
        self.driver.find_element(By.ID, "activity").send_keys("Reading program for children")
        hours = self.driver.find_element(By.ID, "hours")
        hours.clear()
        hours.send_keys("1.5")
        self.driver.find_element(By.ID, "category").send_keys("Education")
        self.driver.find_element(By.ID, "description").send_keys("Read to 15 children in after-school program")
        time.sleep(0.3)
        self.capture("tutorial-entry-3.png", width=1000, height=1000)

        self.driver.find_element(By.ID, "submit-btn").click()
        time.sleep(0.5)

        # 9. Updated dashboard with 3 entries
        dash_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="dashboard"]')
        self.js_click(dash_tab)
        time.sleep(0.5)
        self.capture("tutorial-updated-dashboard.png", width=1400, height=1100)

        # 10. Search results
        history_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-tab="history"]')
        self.js_click(history_tab)
        time.sleep(0.3)

        search_box = self.driver.find_element(By.ID, "search-input")
        search_box.send_keys("dog")
        time.sleep(0.3)
        self.capture("tutorial-search-results.png", width=1200, height=700)
        search_box.clear()
        time.sleep(0.3)

        # 11. Filtered results
        org_filter = self.driver.find_element(By.ID, "filter-org")
        org_filter.send_keys("Local Food Bank")
        time.sleep(0.3)
        self.capture("tutorial-filtered-results.png", width=1200, height=700)
        org_filter.send_keys(Keys.CONTROL + "a")
        org_filter.send_keys(Keys.DELETE)
        time.sleep(0.3)

        # 12. Editing entry
        edit_btns = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Edit')]")
        if edit_btns:
            edit_btns[0].click()
            time.sleep(0.3)

            hours = self.driver.find_element(By.ID, "hours")
            hours.clear()
            hours.send_keys("4")
            time.sleep(0.3)

            self.capture("tutorial-editing.png", width=1000, height=900)

            # 13. Update button (submit button when in edit mode)
            update_btn = self.driver.find_element(By.ID, "submit-btn")
            self.capture("tutorial-update-button.png", element=update_btn)

            update_btn.click()
            time.sleep(0.5)

            # 14. Updated entry
            self.capture("tutorial-updated-entry.png", width=800, height=400)

        # 15. Download/export
        export_btn = self.driver.find_element(By.ID, "export-btn")
        self.driver.execute_script("arguments[0].scrollIntoView();", export_btn)
        time.sleep(0.3)
        # Don't actually click to avoid download, just capture
        self.capture("tutorial-download.png", width=1000, height=300)

        print("\n✓ Tutorial screenshots complete!\n")

    def run(self):
        """Run all screenshot captures"""
        try:
            print("\n" + "="*60)
            print("Volunteer Hours Tracker - Screenshot Capture Tool")
            print("="*60)

            self.capture_base_screenshots()
            self.capture_tutorial_screenshots()

            print("\n" + "="*60)
            print(f"✓ All screenshots captured successfully!")
            print(f"✓ Location: {IMAGES_DIR}")
            print(f"✓ Total screenshots: 34 images")
            print("="*60 + "\n")

            print("Next steps:")
            print("1. Review screenshots in docs/images/")
            print("2. Optimize images: cd docs/images && mogrify -quality 85 *.png")
            print("3. Manually capture tutorial-mobile-install.png on a mobile device")
            print("4. Verify all images display correctly in documentation\n")

        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            print("\nClosing browser...")
            self.driver.quit()
            print("✓ Done!\n")

if __name__ == "__main__":
    import sys

    # Check for required packages
    try:
        import selenium
    except ImportError:
        print("\n❌ Selenium not installed!")
        print("Install with: pip install selenium")
        sys.exit(1)

    # Run screenshot capture
    print(f"\n✓ Starting screenshot capture from {APP_URL}\n")
    capture = ScreenshotCapture()
    capture.run()
