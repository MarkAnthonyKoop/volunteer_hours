# Advanced Reporting System

Comprehensive reporting mechanism for the Volunteer Hours Tracker with advanced filtering and multiple export formats.

## Overview

The reporting system allows users to generate custom reports with sophisticated filtering options and export them in multiple formats suitable for different use cases.

## Features

### Date Range Filtering

1. **All Time**: Include all volunteer entries ever recorded
2. **Year to Date (YTD)**: From January 1st of current year to today
3. **Last X Period**: Flexible timeframe selection
   - Last X hours
   - Last X days
   - Last X weeks
   - Last X months
   - Last X years
4. **Custom Range**: Specify exact start and end dates

### Additional Filters

- **Organization**: Filter by specific organization
- **Category**: Filter by volunteer category
- **Activity**: Search within activity names (partial match)
- **Hours Range**: Set minimum and/or maximum hours per entry

### Export Formats

#### 1. CSV (Comma-Separated Values)
**Best For**: Spreadsheet analysis, data import
**Features**:
- Header row with report metadata
- Data rows with all entry fields
- Summary sections (by organization, by category)
- Excel/Google Sheets compatible
- UTF-8 encoding
**Use Cases**:
- Financial reports
- Grant applications
- Spreadsheet analysis
- Database imports

#### 2. HTML (Web Page)
**Best For**: Presentations, printable reports
**Features**:
- Professional styling
- Responsive design
- Statistical summary cards
- Formatted tables
- Print-optimized
- Self-contained (CSS inline)
**Use Cases**:
- Board presentations
- Stakeholder reports
- Printable documents
- Email attachments

#### 3. Markdown (GitHub Flavored)
**Best For**: Documentation, version control
**Features**:
- Plain text format
- GitHub-compatible tables
- Easy to read
- Version control friendly
- Portable
**Use Cases**:
- Project documentation
- GitHub README updates
- Wiki entries
- Technical reports

#### 4. Text (Plain Text)
**Best For**: Email, universal compatibility
**Features**:
- Pure ASCII text
- Formatted with spacing
- No special characters
- Universal compatibility
- Email-friendly
**Use Cases**:
- Email reports
- Text file archives
- Simple printouts
- Legacy system compatibility

#### 5. JSON (JavaScript Object Notation)
**Best For**: Data exchange, backups
**Features**:
- Structured data format
- Machine-readable
- Complete metadata
- Includes all filter information
- API-compatible
**Use Cases**:
- Data backups
- API integration
- Further processing
- Data migration

## Architecture

### Module Structure

```
report-generator.js
├── class ReportGenerator
│   ├── filterEntries()      - Apply all filters
│   ├── getDateRange()       - Process date range options
│   ├── calculateStats()     - Compute statistics
│   ├── generateReport()     - Generate final report
│   ├── formatCSV()          - CSV formatter
│   ├── formatHTML()         - HTML formatter
│   ├── formatMarkdown()     - Markdown formatter
│   ├── formatText()         - Text formatter
│   ├── formatJSON()         - JSON formatter
│   └── downloadReport()     - Trigger browser download
```

### Integration Points

```javascript
// In app.js
class VolunteerTracker {
    initializeReporting() {
        this.reportGenerator = new ReportGenerator(this.entries);
        // Set up event listeners
    }

    previewReport() {
        // Show preview of filtered results
    }

    generateReport() {
        // Generate and download report
    }
}
```

### UI Components

```
Reports Tab (index.html)
├── Date Range Section
│   ├── Range Type Selector
│   ├── Last Period Options
│   └── Custom Date Picker
├── Filters Section
│   ├── Organization Dropdown
│   ├── Category Dropdown
│   └── Activity Search
├── Export Format Section
│   └── Format Radio Buttons
├── Preview Section
│   └── Dynamic Preview Display
└── Action Buttons
    ├── Preview Report
    └── Generate & Download
```

## Usage Examples

### Example 1: Monthly Report for a Specific Organization

```javascript
// Via UI:
// 1. Select "Last" → 30 → "Days"
// 2. Select Organization: "Food Bank"
// 3. Select Format: CSV
// 4. Click "Generate & Download Report"

// Programmatically:
const generator = new ReportGenerator(entries);
const filters = {
    dateRange: {
        type: 'last',
        options: { value: 30, unit: 'days' }
    },
    organization: 'Food Bank'
};
const report = generator.generateReport(filters, 'csv');
generator.downloadReport(report.content, report.filename, report.mimeType);
```

### Example 2: Year-End Summary Report

```javascript
// Via UI:
// 1. Select "Year to Date"
// 2. Select Format: HTML
// 3. Click "Generate & Download Report"

// Programmatically:
const generator = new ReportGenerator(entries);
const filters = {
    dateRange: { type: 'ytd', options: {} }
};
const report = generator.generateReport(filters, 'html');
generator.downloadReport(report.content, report.filename, report.mimeType);
```

### Example 3: Category-Specific Report with Date Range

```javascript
// Via UI:
// 1. Select "Custom Range"
// 2. Set Start: 2024-01-01, End: 2024-12-31
// 3. Select Category: "Education"
// 4. Select Format: Markdown
// 5. Click "Generate & Download Report"

// Programmatically:
const generator = new ReportGenerator(entries);
const filters = {
    dateRange: {
        type: 'custom',
        options: {
            startDate: '2024-01-01',
            endDate: '2024-12-31'
        }
    },
    category: 'Education'
};
const report = generator.generateReport(filters, 'md');
generator.downloadReport(report.content, report.filename, report.mimeType);
```

## Statistics Calculated

Every report includes the following statistics:

- **Total Hours**: Sum of all hours in filtered entries
- **Total Entries**: Count of filtered entries
- **Average Hours**: Mean hours per entry
- **Organizations**: Count of unique organizations
- **Categories**: Count of unique categories
- **Date Range**: Earliest and latest dates in dataset
- **Hours by Organization**: Breakdown of hours per organization
- **Hours by Category**: Breakdown of hours per category
- **Entries by Month**: Monthly distribution of entries

## Testing

### Test Coverage

The reporting module has 45+ automated tests covering:

- Date range calculations (all types)
- Filtering logic (all filter types)
- Statistics calculations
- Format generation (all 5 formats)
- Data escaping and security
- Edge cases (empty data, invalid filters)

### Running Tests

```bash
# Start local server
./start-server.sh

# Open test page
open http://localhost:8080/tests/report-test.html
```

### Test Results

Expected results:
- 45+ tests
- 100% pass rate
- Coverage of all filter combinations
- Validation of all export formats

## Security

### XSS Protection

All formatters include proper escaping:

- **CSV**: Double-quote escaping for commas and quotes
- **HTML**: DOM-based escaping for all user content
- **Markdown**: Pipe character escaping for tables
- **Text**: No special escaping needed (plain text)
- **JSON**: Built-in JSON.stringify escaping

### Data Privacy

- All processing happens client-side
- No data sent to external servers
- Downloads are local to user's device
- No analytics or tracking

## Performance

- **Filter Speed**: O(n) where n = number of entries
- **Memory**: Minimal - only filtered entries kept in memory
- **Download**: Browser-native file download (instant)
- **Tested with**: Up to 10,000 entries without performance issues

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

All formats tested and working across supported browsers.

## API Reference

### ReportGenerator Class

```javascript
constructor(entries)
// Initialize with array of entry objects

setEntries(entries)
// Update the entries dataset

getDateRange(rangeType, options)
// Returns: { startDate, endDate }
// rangeType: 'all' | 'ytd' | 'last' | 'custom'
// options: { value, unit } or { startDate, endDate }

filterEntries(filters)
// Returns: Filtered array of entries
// filters: {
//   dateRange: { type, options },
//   organization: string,
//   category: string,
//   activity: string,
//   minHours: number,
//   maxHours: number
// }

calculateStats(entries)
// Returns: Statistics object
// {
//   totalHours, totalEntries, averageHours,
//   organizations, categories, dateRange,
//   hoursByOrg, hoursByCategory, entriesByMonth
// }

generateReport(filters, format)
// Returns: { content, filename, mimeType }
// format: 'csv' | 'html' | 'md' | 'txt' | 'json'

downloadReport(content, filename, mimeType)
// Triggers browser download of report file
```

## Troubleshooting

### Issue: No data in report
**Solution**: Check filters - they may be too restrictive. Try "All Time" with no filters.

### Issue: Download not working
**Solution**: Check browser pop-up blocker settings. Allow downloads from your domain.

### Issue: Report shows wrong data
**Solution**: Ensure you clicked "Generate & Download" after changing filters.

### Issue: Special characters display incorrectly
**Solution**: Open CSV files with UTF-8 encoding in Excel (Data → From Text/CSV → UTF-8).

## Future Enhancements

Potential improvements for Phase 2+:

- PDF export via Puppeteer
- Chart/graph generation in HTML reports
- Email delivery of reports
- Scheduled report generation
- Custom report templates
- Multi-sheet Excel export
- Report history/favorites
- Batch report generation

## Contributing

To add a new export format:

1. Add format method (e.g., `formatPDF()`)
2. Add format to `generateReport()` switch
3. Add MIME type to mimeTypes object
4. Add filename pattern to filenames object
5. Add tests for new format
6. Update documentation

## License

Part of the Volunteer Hours Tracker project - free to use and modify for personal and commercial purposes.

---

**Last Updated**: 2025-10-14
**Version**: 1.0.0
**Module**: report-generator.js
**Tests**: tests/report-generator.test.js
