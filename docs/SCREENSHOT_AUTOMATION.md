# Screenshot Automation

Automated screenshot capture for the Volunteer Hours Tracker documentation using Selenium WebDriver.

## What It Does

The `capture-screenshots.py` script automatically:

1. **Opens the app** in Chrome browser
2. **Adds sample data** (5 volunteer entries with realistic information)
3. **Navigates through all screens**:
   - Dashboard with statistics and charts
   - Log Hours form with all fields
   - History with search, filters, and sorting
   - Edit and delete workflows
4. **Captures 33 screenshots** automatically
5. **Saves images** to `docs/images/` with correct filenames

## Quick Start

```bash
# Terminal 1: Start the app
cd /home/tony/winefred
./start-server.sh

# Terminal 2: Capture screenshots
cd docs
./capture-all-screenshots.sh
```

That's it! All screenshots will be in `docs/images/` in 2-3 minutes.

## Files Created

### 1. `capture-screenshots.py`
Main Python script using Selenium WebDriver.

**Features:**
- Automatic browser control
- Element highlighting for tutorial screenshots
- Smart waiting for UI elements
- Screenshot sizing and cropping
- Clean data management

**Screenshots captured:**
- 19 base screenshots (USER_GUIDE.md, REFERENCE.md)
- 14 tutorial screenshots (TUTORIAL.md)
- Total: 33 automated screenshots

### 2. `capture-all-screenshots.sh`
Bash wrapper script for easy execution.

**Features:**
- Dependency checking (Python, pip, ChromeDriver)
- Server status verification
- Automatic package installation
- User-friendly progress messages

### 3. `requirements.txt`
Python dependencies:
- `selenium>=4.15.0` - WebDriver automation

## Manual Installation

If `capture-all-screenshots.sh` doesn't work automatically:

### Install Python Dependencies

```bash
cd docs
pip3 install -r requirements.txt
```

### Install ChromeDriver

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install chromium-chromedriver
```

**macOS:**
```bash
brew install chromedriver
```

**Other systems:**
Download from https://chromedriver.chromium.org/

### Verify Installation

```bash
python3 --version  # Should be 3.7+
chromedriver --version  # Should show version
```

## Running the Script

### Option 1: Using the Wrapper (Recommended)

```bash
cd docs
./capture-all-screenshots.sh
```

### Option 2: Direct Python Execution

```bash
# Make sure app is running first
cd docs
python3 capture-screenshots.py
```

### Option 3: Headless Mode

For servers without a display:

```python
# In capture-screenshots.py, uncomment this line (around line 27):
options.add_argument('--headless')
```

Then run normally.

## Customization

### Change Window Size

Edit `capture-screenshots.py`:

```python
WINDOW_WIDTH = 1400   # Default width
WINDOW_HEIGHT = 1000  # Default height
```

### Change App URL

If running on a different port:

```python
APP_URL = "http://localhost:3000"  # Change from 8080
```

### Adjust Timing

If screenshots are capturing too fast:

```python
# In capture() method, increase sleep time
time.sleep(1.0)  # Change from 0.5
```

### Skip Certain Screenshots

Comment out sections in the script:

```python
# self.capture_base_screenshots()  # Skip base screenshots
self.capture_tutorial_screenshots()  # Only tutorial screenshots
```

## Screenshot Details

### Base Screenshots (19 total)

Used in USER_GUIDE.md and REFERENCE.md:

- main-interface.png
- dashboard-stats.png
- org-chart.png
- recent-activity.png
- date-picker.png
- organization-field.png
- activity-field.png
- hours-field.png
- category-dropdown.png
- description-field.png
- add-entry-button.png
- history-view.png
- search-box.png
- filters.png
- sort-options.png
- edit-entry.png
- delete-confirmation.png
- export-button.png

### Tutorial Screenshots (15 total)

Used in TUTORIAL.md for the interactive walkthrough:

- tutorial-opening.png
- tutorial-mobile-install.png (manual capture required)
- tutorial-log-hours-tab.png
- tutorial-completed-form.png
- tutorial-success-message.png
- tutorial-dashboard-tab.png
- tutorial-updated-dashboard.png
- tutorial-entry-2.png
- tutorial-entry-3.png
- tutorial-search-results.png
- tutorial-filtered-results.png
- tutorial-editing.png
- tutorial-update-button.png
- tutorial-updated-entry.png
- tutorial-download.png

## Sample Data Used

The script adds these volunteer entries:

1. **Local Food Bank** - 3.5 hours - Food sorting and distribution
2. **Animal Shelter** - 2 hours - Dog walking and kennel cleaning
3. **Public Library** - 1.5 hours - Reading program for children
4. **Local Food Bank** - 4 hours - Food drive organization
5. **Community Garden** - 2.5 hours - Garden maintenance

This creates:
- Total Hours: 13.5
- Organizations: 4
- Categories: Social Services, Animal Welfare, Education, Environment

## Troubleshooting

### "ChromeDriver not found"

**Solution:**
```bash
# Ubuntu/Debian
sudo apt install chromium-chromedriver

# macOS
brew install chromedriver

# Or add to PATH
export PATH=$PATH:/path/to/chromedriver
```

### "Connection refused" error

**Solution:** Make sure the app server is running:
```bash
cd /home/tony/winefred
./start-server.sh
```

### Screenshots are blank

**Solution:** Increase wait times in the script:
```python
time.sleep(1.0)  # Increase from 0.5
```

### "Element not found" errors

**Solution:** The app might be loading slowly. Increase the WebDriverWait timeout:
```python
self.wait = WebDriverWait(self.driver, 20)  # Increase from 10
```

### Permission denied on scripts

**Solution:** Make scripts executable:
```bash
chmod +x capture-all-screenshots.sh
chmod +x capture-screenshots.py
```

### Chrome crashes or won't start

**Solution:** Try headless mode:
```python
options.add_argument('--headless')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--no-sandbox')
```

## Post-Capture Steps

### 1. Review Screenshots

```bash
cd docs/images
ls -lh  # Check file sizes
open .  # Open in file browser (macOS)
xdg-open .  # Open in file browser (Linux)
```

### 2. Optimize Images (Optional)

Reduce file sizes while maintaining quality:

```bash
cd docs/images

# Using ImageMagick
mogrify -quality 85 *.png

# Or using pngquant
pngquant --quality=80-90 *.png --ext .png --force
```

### 3. Manual Mobile Screenshot

One screenshot requires a real mobile device:

**tutorial-mobile-install.png**
- Take a screenshot on iPhone or Android
- Show the "Add to Home Screen" menu
- Save to `docs/images/tutorial-mobile-install.png`

### 4. Verify Documentation

Check that all images display correctly:

```bash
cd docs

# Open in browser or markdown viewer
open TUTORIAL.md
open USER_GUIDE.md
open REFERENCE.md
```

## Advanced Usage

### Capture Only Specific Screenshots

Edit the `run()` method:

```python
def run(self):
    # self.capture_base_screenshots()  # Skip base
    self.capture_tutorial_screenshots()  # Only tutorial
```

### Add Custom Screenshots

Add to the script:

```python
def capture_custom_screenshot(self):
    # Your custom logic
    self.driver.get(APP_URL + "/custom-page")
    self.capture("my-custom-screenshot.png")
```

### Different Browser

Use Firefox instead of Chrome:

```python
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options

options = Options()
self.driver = Firefox(options=options)
```

## Performance

- **Execution time**: 2-3 minutes for all screenshots
- **Browser**: Chrome (headless or windowed)
- **Screenshots**: 33 automated + 1 manual
- **Total size**: ~5-10 MB (before optimization)
- **Optimized size**: ~2-4 MB (after compression)

## Integration with CI/CD

You can run this in CI pipelines:

```yaml
# .github/workflows/screenshots.yml
name: Update Screenshots

on: [push]

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          sudo apt-get install chromium-chromedriver
          pip install -r docs/requirements.txt
      - name: Start server
        run: ./start-server.sh &
      - name: Wait for server
        run: sleep 5
      - name: Capture screenshots
        run: cd docs && python3 capture-screenshots.py
      - name: Commit screenshots
        run: |
          git config user.name "Screenshot Bot"
          git config user.email "bot@example.com"
          git add docs/images/
          git commit -m "Update screenshots" || true
          git push
```

## License

Same as the main Volunteer Hours Tracker project.

---

**Questions or Issues?**

See SCREENSHOTS.md for manual capture instructions or create an issue in the project repository.
