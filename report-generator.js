/**
 * Report Generator Module
 * Comprehensive reporting mechanism with advanced filtering and multiple export formats
 */

class ReportGenerator {
    constructor(entries) {
        this.entries = entries || [];
    }

    /**
     * Update entries data
     */
    setEntries(entries) {
        this.entries = entries || [];
    }

    /**
     * Parse date range type and return start/end dates
     * @param {string} rangeType - 'ytd', 'custom', 'last', 'all'
     * @param {Object} options - Additional options for range
     * @returns {Object} {startDate, endDate}
     */
    getDateRange(rangeType, options = {}) {
        const now = new Date();
        let startDate = null;
        let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        switch (rangeType) {
            case 'ytd': // Year to date
                startDate = new Date(now.getFullYear(), 0, 1);
                break;

            case 'custom':
                startDate = options.startDate ? new Date(options.startDate) : null;
                endDate = options.endDate ? new Date(options.endDate) : endDate;
                break;

            case 'last':
                const { value, unit } = options;
                const amount = parseInt(value) || 1;
                startDate = new Date(now);

                switch (unit) {
                    case 'hours':
                        startDate.setHours(now.getHours() - amount);
                        break;
                    case 'days':
                        startDate.setDate(now.getDate() - amount);
                        break;
                    case 'weeks':
                        startDate.setDate(now.getDate() - (amount * 7));
                        break;
                    case 'months':
                        startDate.setMonth(now.getMonth() - amount);
                        break;
                    case 'years':
                        startDate.setFullYear(now.getFullYear() - amount);
                        break;
                    default:
                        startDate.setDate(now.getDate() - amount);
                }
                break;

            case 'all':
            default:
                startDate = null;
                endDate = null;
                break;
        }

        return { startDate, endDate };
    }

    /**
     * Filter entries based on criteria
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered entries
     */
    filterEntries(filters = {}) {
        let filtered = [...this.entries];

        // Date range filter
        if (filters.dateRange) {
            const { startDate, endDate } = this.getDateRange(
                filters.dateRange.type,
                filters.dateRange.options
            );

            if (startDate || endDate) {
                filtered = filtered.filter(entry => {
                    const entryDate = new Date(entry.date);
                    if (startDate && entryDate < startDate) return false;
                    if (endDate && entryDate > endDate) return false;
                    return true;
                });
            }
        }

        // Volunteer filter
        if (filters.volunteer && filters.volunteer !== 'all') {
            filtered = filtered.filter(entry =>
                (entry.volunteer || 'Me') === filters.volunteer
            );
        }

        // Organization filter
        if (filters.organization && filters.organization !== 'all') {
            filtered = filtered.filter(entry =>
                entry.organization === filters.organization
            );
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(entry =>
                entry.category === filters.category
            );
        }

        // Activity filter (search)
        if (filters.activity) {
            const searchTerm = filters.activity.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.activity.toLowerCase().includes(searchTerm)
            );
        }

        // Description filter (search)
        if (filters.description) {
            const searchTerm = filters.description.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.description && entry.description.toLowerCase().includes(searchTerm)
            );
        }

        // Minimum hours filter
        if (filters.minHours !== undefined && filters.minHours !== null) {
            filtered = filtered.filter(entry => entry.hours >= parseFloat(filters.minHours));
        }

        // Maximum hours filter
        if (filters.maxHours !== undefined && filters.maxHours !== null) {
            filtered = filtered.filter(entry => entry.hours <= parseFloat(filters.maxHours));
        }

        return filtered;
    }

    /**
     * Calculate statistics for filtered entries
     * @param {Array} entries - Entries to calculate stats for
     * @returns {Object} Statistics object
     */
    calculateStats(entries) {
        if (entries.length === 0) {
            return {
                totalHours: 0,
                totalEntries: 0,
                averageHours: 0,
                organizations: 0,
                categories: 0,
                dateRange: { earliest: null, latest: null },
                hoursByOrg: {},
                hoursByCategory: {},
                entriesByMonth: {}
            };
        }

        const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
        const organizations = new Set(entries.map(e => e.organization));
        const categories = new Set(entries.map(e => e.category).filter(c => c));

        // Hours by organization
        const hoursByOrg = {};
        entries.forEach(entry => {
            hoursByOrg[entry.organization] = (hoursByOrg[entry.organization] || 0) + entry.hours;
        });

        // Hours by category
        const hoursByCategory = {};
        entries.forEach(entry => {
            if (entry.category) {
                hoursByCategory[entry.category] = (hoursByCategory[entry.category] || 0) + entry.hours;
            }
        });

        // Entries by month
        const entriesByMonth = {};
        entries.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            entriesByMonth[monthKey] = (entriesByMonth[monthKey] || 0) + 1;
        });

        // Date range
        const dates = entries.map(e => new Date(e.date)).sort((a, b) => a - b);
        const earliest = dates[0];
        const latest = dates[dates.length - 1];

        return {
            totalHours: totalHours.toFixed(2),
            totalEntries: entries.length,
            averageHours: (totalHours / entries.length).toFixed(2),
            organizations: organizations.size,
            categories: categories.size,
            dateRange: {
                earliest: earliest.toISOString().split('T')[0],
                latest: latest.toISOString().split('T')[0]
            },
            hoursByOrg,
            hoursByCategory,
            entriesByMonth
        };
    }

    /**
     * Generate report in specified format
     * @param {Object} filters - Filter criteria
     * @param {string} format - Output format: 'csv', 'html', 'md', 'txt', 'json'
     * @returns {Object} {content, filename, mimeType}
     */
    generateReport(filters = {}, format = 'csv') {
        const filtered = this.filterEntries(filters);
        const stats = this.calculateStats(filtered);

        const formatters = {
            csv: this.formatCSV.bind(this),
            html: this.formatHTML.bind(this),
            md: this.formatMarkdown.bind(this),
            txt: this.formatText.bind(this),
            json: this.formatJSON.bind(this)
        };

        const formatter = formatters[format] || formatters.csv;
        const content = formatter(filtered, stats, filters);

        const timestamp = new Date().toISOString().split('T')[0];
        const filenames = {
            csv: `volunteer-hours-report-${timestamp}.csv`,
            html: `volunteer-hours-report-${timestamp}.html`,
            md: `volunteer-hours-report-${timestamp}.md`,
            txt: `volunteer-hours-report-${timestamp}.txt`,
            json: `volunteer-hours-report-${timestamp}.json`
        };

        const mimeTypes = {
            csv: 'text/csv',
            html: 'text/html',
            md: 'text/markdown',
            txt: 'text/plain',
            json: 'application/json'
        };

        return {
            content,
            filename: filenames[format],
            mimeType: mimeTypes[format]
        };
    }

    /**
     * Format report as CSV
     */
    formatCSV(entries, stats, filters) {
        let csv = '';

        // Header with report info
        csv += `"Volunteer Hours Report"\n`;
        csv += `"Generated","${new Date().toISOString()}"\n`;
        csv += `"Total Hours","${stats.totalHours}"\n`;
        csv += `"Total Entries","${stats.totalEntries}"\n`;
        csv += `"Average Hours","${stats.averageHours}"\n`;
        if (stats.dateRange.earliest) {
            csv += `"Date Range","${stats.dateRange.earliest} to ${stats.dateRange.latest}"\n`;
        }
        csv += `\n`;

        // Column headers
        csv += `"Date","Volunteer","Organization","Activity","Hours","Category","Description"\n`;

        // Data rows
        entries.forEach(entry => {
            csv += `"${entry.date}",`;
            csv += `"${this.escapeCSV(entry.volunteer || 'Me')}",`;
            csv += `"${this.escapeCSV(entry.organization)}",`;
            csv += `"${this.escapeCSV(entry.activity)}",`;
            csv += `"${entry.hours}",`;
            csv += `"${this.escapeCSV(entry.category || '')}",`;
            csv += `"${this.escapeCSV(entry.description || '')}"\n`;
        });

        // Summary section
        csv += `\n"Summary by Organization"\n`;
        csv += `"Organization","Hours"\n`;
        Object.entries(stats.hoursByOrg)
            .sort((a, b) => b[1] - a[1])
            .forEach(([org, hours]) => {
                csv += `"${this.escapeCSV(org)}","${hours.toFixed(2)}"\n`;
            });

        if (Object.keys(stats.hoursByCategory).length > 0) {
            csv += `\n"Summary by Category"\n`;
            csv += `"Category","Hours"\n`;
            Object.entries(stats.hoursByCategory)
                .sort((a, b) => b[1] - a[1])
                .forEach(([cat, hours]) => {
                    csv += `"${this.escapeCSV(cat)}","${hours.toFixed(2)}"\n`;
                });
        }

        return csv;
    }

    /**
     * Format report as HTML
     */
    formatHTML(entries, stats, filters) {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Volunteer Hours Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 10px;
        }
        h2 {
            color: #555;
            margin-top: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #4CAF50;
        }
        .stat-label {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 5px;
        }
        .stat-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background: #4CAF50;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .summary-table {
            max-width: 500px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 0.9em;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Volunteer Hours Report</h1>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-label">Total Hours</div>
                <div class="stat-value">${stats.totalHours}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Entries</div>
                <div class="stat-value">${stats.totalEntries}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Organizations</div>
                <div class="stat-value">${stats.organizations}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average Hours/Entry</div>
                <div class="stat-value">${stats.averageHours}</div>
            </div>
        </div>

        ${stats.dateRange.earliest ? `<p><strong>Date Range:</strong> ${stats.dateRange.earliest} to ${stats.dateRange.latest}</p>` : ''}

        <h2>Volunteer Entries</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Volunteer</th>
                    <th>Organization</th>
                    <th>Activity</th>
                    <th>Hours</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                ${entries.map(entry => `
                <tr>
                    <td>${entry.date}</td>
                    <td>${this.escapeHTML(entry.volunteer || 'Me')}</td>
                    <td>${this.escapeHTML(entry.organization)}</td>
                    <td>${this.escapeHTML(entry.activity)}</td>
                    <td>${entry.hours}</td>
                    <td>${this.escapeHTML(entry.category || '-')}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <h2>Summary by Organization</h2>
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Organization</th>
                    <th>Total Hours</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(stats.hoursByOrg)
                    .sort((a, b) => b[1] - a[1])
                    .map(([org, hours]) => `
                <tr>
                    <td>${this.escapeHTML(org)}</td>
                    <td>${hours.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        ${Object.keys(stats.hoursByCategory).length > 0 ? `
        <h2>Summary by Category</h2>
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Total Hours</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(stats.hoursByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, hours]) => `
                <tr>
                    <td>${this.escapeHTML(cat)}</td>
                    <td>${hours.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        <div class="footer">
            Generated on ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;

        return html;
    }

    /**
     * Format report as Markdown
     */
    formatMarkdown(entries, stats, filters) {
        let md = `# Volunteer Hours Report\n\n`;
        md += `**Generated:** ${new Date().toISOString()}\n\n`;

        md += `## Summary Statistics\n\n`;
        md += `| Metric | Value |\n`;
        md += `|--------|-------|\n`;
        md += `| Total Hours | ${stats.totalHours} |\n`;
        md += `| Total Entries | ${stats.totalEntries} |\n`;
        md += `| Average Hours/Entry | ${stats.averageHours} |\n`;
        md += `| Organizations | ${stats.organizations} |\n`;
        md += `| Categories | ${stats.categories} |\n`;
        if (stats.dateRange.earliest) {
            md += `| Date Range | ${stats.dateRange.earliest} to ${stats.dateRange.latest} |\n`;
        }
        md += `\n`;

        md += `## Volunteer Entries\n\n`;
        md += `| Date | Volunteer | Organization | Activity | Hours | Category |\n`;
        md += `|------|-----------|--------------|----------|-------|----------|\n`;
        entries.forEach(entry => {
            md += `| ${entry.date} | ${this.escapeMD(entry.volunteer || 'Me')} | ${this.escapeMD(entry.organization)} | ${this.escapeMD(entry.activity)} | ${entry.hours} | ${this.escapeMD(entry.category || '-')} |\n`;
        });
        md += `\n`;

        md += `## Summary by Organization\n\n`;
        md += `| Organization | Total Hours |\n`;
        md += `|--------------|-------------|\n`;
        Object.entries(stats.hoursByOrg)
            .sort((a, b) => b[1] - a[1])
            .forEach(([org, hours]) => {
                md += `| ${this.escapeMD(org)} | ${hours.toFixed(2)} |\n`;
            });
        md += `\n`;

        if (Object.keys(stats.hoursByCategory).length > 0) {
            md += `## Summary by Category\n\n`;
            md += `| Category | Total Hours |\n`;
            md += `|----------|-------------|\n`;
            Object.entries(stats.hoursByCategory)
                .sort((a, b) => b[1] - a[1])
                .forEach(([cat, hours]) => {
                    md += `| ${this.escapeMD(cat)} | ${hours.toFixed(2)} |\n`;
                });
            md += `\n`;
        }

        md += `---\n\n`;
        md += `*Report generated by Volunteer Hours Tracker*\n`;

        return md;
    }

    /**
     * Format report as plain text
     */
    formatText(entries, stats, filters) {
        let txt = `VOLUNTEER HOURS REPORT\n`;
        txt += `${'='.repeat(60)}\n\n`;
        txt += `Generated: ${new Date().toLocaleString()}\n\n`;

        txt += `SUMMARY STATISTICS\n`;
        txt += `${'-'.repeat(60)}\n`;
        txt += `Total Hours:          ${stats.totalHours}\n`;
        txt += `Total Entries:        ${stats.totalEntries}\n`;
        txt += `Average Hours/Entry:  ${stats.averageHours}\n`;
        txt += `Organizations:        ${stats.organizations}\n`;
        txt += `Categories:           ${stats.categories}\n`;
        if (stats.dateRange.earliest) {
            txt += `Date Range:           ${stats.dateRange.earliest} to ${stats.dateRange.latest}\n`;
        }
        txt += `\n`;

        txt += `VOLUNTEER ENTRIES\n`;
        txt += `${'-'.repeat(60)}\n`;
        entries.forEach((entry, index) => {
            txt += `\nEntry #${index + 1}\n`;
            txt += `  Date:         ${entry.date}\n`;
            txt += `  Volunteer:    ${entry.volunteer || 'Me'}\n`;
            txt += `  Organization: ${entry.organization}\n`;
            txt += `  Activity:     ${entry.activity}\n`;
            txt += `  Hours:        ${entry.hours}\n`;
            txt += `  Category:     ${entry.category || 'N/A'}\n`;
            if (entry.description) {
                txt += `  Description:  ${entry.description}\n`;
            }
        });
        txt += `\n`;

        txt += `SUMMARY BY ORGANIZATION\n`;
        txt += `${'-'.repeat(60)}\n`;
        Object.entries(stats.hoursByOrg)
            .sort((a, b) => b[1] - a[1])
            .forEach(([org, hours]) => {
                txt += `${org.padEnd(40)} ${hours.toFixed(2).padStart(10)} hours\n`;
            });
        txt += `\n`;

        if (Object.keys(stats.hoursByCategory).length > 0) {
            txt += `SUMMARY BY CATEGORY\n`;
            txt += `${'-'.repeat(60)}\n`;
            Object.entries(stats.hoursByCategory)
                .sort((a, b) => b[1] - a[1])
                .forEach(([cat, hours]) => {
                    txt += `${cat.padEnd(40)} ${hours.toFixed(2).padStart(10)} hours\n`;
                });
            txt += `\n`;
        }

        txt += `${'='.repeat(60)}\n`;
        txt += `End of Report\n`;

        return txt;
    }

    /**
     * Format report as JSON
     */
    formatJSON(entries, stats, filters) {
        const report = {
            metadata: {
                title: 'Volunteer Hours Report',
                generated: new Date().toISOString(),
                filters: filters
            },
            summary: stats,
            entries: entries
        };

        return JSON.stringify(report, null, 2);
    }

    /**
     * Download report file
     * @param {string} content - Report content
     * @param {string} filename - Filename
     * @param {string} mimeType - MIME type
     */
    downloadReport(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Escape CSV special characters
     */
    escapeCSV(text) {
        if (typeof text !== 'string') return '';
        return text.replace(/"/g, '""');
    }

    /**
     * Escape HTML special characters
     */
    escapeHTML(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Escape Markdown special characters
     */
    escapeMD(text) {
        if (typeof text !== 'string') return '';
        return text.replace(/[|]/g, '\\|');
    }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportGenerator;
}
