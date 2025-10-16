/**
 * Tests for ReportGenerator Module
 */

// Sample test data
const sampleEntries = [
    {
        id: '1',
        date: '2024-01-15',
        volunteer: 'John Doe',
        organization: 'Food Bank',
        activity: 'Food sorting',
        hours: 3,
        category: 'Social Services',
        description: 'Sorted donations',
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        date: '2024-02-20',
        volunteer: 'Jane Smith',
        organization: 'Animal Shelter',
        activity: 'Dog walking',
        hours: 2,
        category: 'Animal Welfare',
        description: 'Walked shelter dogs',
        createdAt: '2024-02-20T14:00:00Z'
    },
    {
        id: '3',
        date: '2024-03-10',
        volunteer: 'John Doe',
        organization: 'Food Bank',
        activity: 'Food distribution',
        hours: 4,
        category: 'Social Services',
        description: 'Distributed to families',
        createdAt: '2024-03-10T09:00:00Z'
    },
    {
        id: '4',
        date: '2024-06-05',
        volunteer: 'Me',
        organization: 'Library',
        activity: 'Reading program',
        hours: 2.5,
        category: 'Education',
        description: 'Read to children',
        createdAt: '2024-06-05T15:00:00Z'
    },
    {
        id: '5',
        date: '2024-10-01',
        volunteer: 'Jane Smith',
        organization: 'Park Cleanup',
        activity: 'Trail maintenance',
        hours: 5,
        category: 'Environment',
        description: 'Cleared trails',
        createdAt: '2024-10-01T08:00:00Z'
    }
];

// Test Suite
const reportTests = [
    {
        name: 'ReportGenerator - Initialization',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            return generator.entries.length === 5;
        }
    },

    {
        name: 'ReportGenerator - setEntries updates data',
        test: () => {
            const generator = new ReportGenerator([]);
            generator.setEntries(sampleEntries);
            return generator.entries.length === 5;
        }
    },

    {
        name: 'Date Range - Year to Date',
        test: () => {
            const generator = new ReportGenerator();
            const { startDate, endDate } = generator.getDateRange('ytd');
            const now = new Date();
            return startDate.getFullYear() === now.getFullYear() &&
                   startDate.getMonth() === 0 &&
                   startDate.getDate() === 1;
        }
    },

    {
        name: 'Date Range - Last 30 Days',
        test: () => {
            const generator = new ReportGenerator();
            const { startDate, endDate } = generator.getDateRange('last', { value: 30, unit: 'days' });
            const expectedStart = new Date();
            expectedStart.setDate(expectedStart.getDate() - 30);
            return Math.abs(startDate - expectedStart) < 1000; // Within 1 second
        }
    },

    {
        name: 'Date Range - Custom Range',
        test: () => {
            const generator = new ReportGenerator();
            const { startDate, endDate } = generator.getDateRange('custom', {
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            });
            return startDate.getFullYear() === 2024 &&
                   startDate.getMonth() === 0 &&
                   endDate.getFullYear() === 2024 &&
                   endDate.getMonth() === 11;
        }
    },

    {
        name: 'Filter - By Organization',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ organization: 'Food Bank' });
            return filtered.length === 2 &&
                   filtered.every(e => e.organization === 'Food Bank');
        }
    },

    {
        name: 'Filter - By Category',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ category: 'Social Services' });
            return filtered.length === 2 &&
                   filtered.every(e => e.category === 'Social Services');
        }
    },

    {
        name: 'Filter - By Activity (search)',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ activity: 'Food' });
            return filtered.length === 2 &&
                   filtered.every(e => e.activity.toLowerCase().includes('food'));
        }
    },

    {
        name: 'Filter - By Volunteer',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ volunteer: 'John Doe' });
            return filtered.length === 2 &&
                   filtered.every(e => e.volunteer === 'John Doe');
        }
    },

    {
        name: 'Filter - By Volunteer (Me)',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ volunteer: 'Me' });
            return filtered.length === 1 &&
                   filtered[0].volunteer === 'Me';
        }
    },

    {
        name: 'Filter - By Volunteer with Missing Field',
        test: () => {
            const entriesNoVolunteer = [
                { id: '1', date: '2024-01-01', organization: 'Test', activity: 'Test', hours: 1, category: 'Test' }
            ];
            const generator = new ReportGenerator(entriesNoVolunteer);
            const filtered = generator.filterEntries({ volunteer: 'Me' });
            return filtered.length === 1;  // Should default to 'Me' for entries without volunteer field
        }
    },

    {
        name: 'Filter - By Date Range (YTD)',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({
                dateRange: { type: 'ytd', options: {} }
            });
            const now = new Date();
            return filtered.every(e => new Date(e.date).getFullYear() === now.getFullYear());
        }
    },

    {
        name: 'Filter - Multiple Filters Combined',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({
                organization: 'Food Bank',
                category: 'Social Services'
            });
            return filtered.length === 2 &&
                   filtered.every(e => e.organization === 'Food Bank' && e.category === 'Social Services');
        }
    },

    {
        name: 'Statistics - Total Hours Calculation',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return parseFloat(stats.totalHours) === 16.5;
        }
    },

    {
        name: 'Statistics - Total Entries',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return stats.totalEntries === 5;
        }
    },

    {
        name: 'Statistics - Average Hours',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return parseFloat(stats.averageHours) === 3.3;
        }
    },

    {
        name: 'Statistics - Organizations Count',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return stats.organizations === 4; // Food Bank, Animal Shelter, Library, Park Cleanup
        }
    },

    {
        name: 'Statistics - Categories Count',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return stats.categories === 4; // Social Services, Animal Welfare, Education, Environment
        }
    },

    {
        name: 'Statistics - Hours by Organization',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return stats.hoursByOrg['Food Bank'] === 7 &&
                   stats.hoursByOrg['Animal Shelter'] === 2 &&
                   stats.hoursByOrg['Library'] === 2.5 &&
                   stats.hoursByOrg['Park Cleanup'] === 5;
        }
    },

    {
        name: 'Statistics - Hours by Category',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return stats.hoursByCategory['Social Services'] === 7 &&
                   stats.hoursByCategory['Animal Welfare'] === 2 &&
                   stats.hoursByCategory['Education'] === 2.5 &&
                   stats.hoursByCategory['Environment'] === 5;
        }
    },

    {
        name: 'Statistics - Date Range Detection',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const stats = generator.calculateStats(sampleEntries);
            return stats.dateRange.earliest === '2024-01-15' &&
                   stats.dateRange.latest === '2024-10-01';
        }
    },

    {
        name: 'Statistics - Empty Entries',
        test: () => {
            const generator = new ReportGenerator([]);
            const stats = generator.calculateStats([]);
            return stats.totalHours === 0 &&
                   stats.totalEntries === 0 &&
                   stats.organizations === 0;
        }
    },

    {
        name: 'CSV Format - Contains Headers',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'csv');
            return report.content.includes('"Date","Organization","Activity","Hours"') &&
                   report.filename.endsWith('.csv') &&
                   report.mimeType === 'text/csv';
        }
    },

    {
        name: 'CSV Format - Contains Data',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'csv');
            return report.content.includes('"Food Bank"') &&
                   report.content.includes('"Food sorting"');
        }
    },

    {
        name: 'CSV Format - Summary Section',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'csv');
            return report.content.includes('"Summary by Organization"') &&
                   report.content.includes('"Summary by Category"');
        }
    },

    {
        name: 'HTML Format - Valid HTML Structure',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'html');
            return report.content.includes('<!DOCTYPE html>') &&
                   report.content.includes('<html') &&
                   report.content.includes('</html>') &&
                   report.filename.endsWith('.html') &&
                   report.mimeType === 'text/html';
        }
    },

    {
        name: 'HTML Format - Contains Stats',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'html');
            return report.content.includes('Total Hours') &&
                   report.content.includes('16.50') &&
                   report.content.includes('Total Entries');
        }
    },

    {
        name: 'HTML Format - Contains Table',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'html');
            return report.content.includes('<table') &&
                   report.content.includes('</table>') &&
                   report.content.includes('Food Bank');
        }
    },

    {
        name: 'Markdown Format - Valid Markdown',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'md');
            return report.content.includes('# Volunteer Hours Report') &&
                   report.content.includes('|') &&
                   report.filename.endsWith('.md') &&
                   report.mimeType === 'text/markdown';
        }
    },

    {
        name: 'Markdown Format - Tables',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'md');
            return report.content.includes('| Date |') &&
                   report.content.includes('|------|') &&
                   report.content.includes('Food Bank');
        }
    },

    {
        name: 'Text Format - Plain Text',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'txt');
            return report.content.includes('VOLUNTEER HOURS REPORT') &&
                   report.content.includes('===') &&
                   report.filename.endsWith('.txt') &&
                   report.mimeType === 'text/plain';
        }
    },

    {
        name: 'Text Format - Contains Data',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'txt');
            return report.content.includes('Food Bank') &&
                   report.content.includes('Food sorting') &&
                   report.content.includes('SUMMARY BY ORGANIZATION');
        }
    },

    {
        name: 'JSON Format - Valid JSON',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'json');
            try {
                const parsed = JSON.parse(report.content);
                return parsed.metadata &&
                       parsed.summary &&
                       parsed.entries &&
                       parsed.entries.length === 5 &&
                       report.filename.endsWith('.json') &&
                       report.mimeType === 'application/json';
            } catch (e) {
                return false;
            }
        }
    },

    {
        name: 'JSON Format - Contains Metadata',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'json');
            const parsed = JSON.parse(report.content);
            return parsed.metadata.title === 'Volunteer Hours Report' &&
                   parsed.metadata.generated &&
                   parsed.summary.totalHours &&
                   parsed.entries.length > 0;
        }
    },

    {
        name: 'Report with Filters - Reduced Entries',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({ organization: 'Food Bank' }, 'json');
            const parsed = JSON.parse(report.content);
            return parsed.entries.length === 2 &&
                   parsed.summary.totalEntries === 2;
        }
    },

    {
        name: 'CSV Escaping - Handles Quotes',
        test: () => {
            const generator = new ReportGenerator();
            const escaped = generator.escapeCSV('Test "quoted" text');
            return escaped === 'Test ""quoted"" text';
        }
    },

    {
        name: 'HTML Escaping - Handles Special Characters',
        test: () => {
            const generator = new ReportGenerator();
            const escaped = generator.escapeHTML('<script>alert("xss")</script>');
            return escaped.includes('&lt;') && escaped.includes('&gt;') && !escaped.includes('<script>');
        }
    },

    {
        name: 'Markdown Escaping - Handles Pipes',
        test: () => {
            const generator = new ReportGenerator();
            const escaped = generator.escapeMD('Text | with | pipes');
            return escaped === 'Text \\| with \\| pipes';
        }
    },

    {
        name: 'Filter - Minimum Hours',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ minHours: 3 });
            return filtered.length === 3 && // 3h, 4h, 5h entries
                   filtered.every(e => e.hours >= 3);
        }
    },

    {
        name: 'Filter - Maximum Hours',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ maxHours: 3 });
            return filtered.length === 3 && // 2h, 2.5h, 3h entries
                   filtered.every(e => e.hours <= 3);
        }
    },

    {
        name: 'Filter - Hours Range',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ minHours: 2, maxHours: 4 });
            return filtered.length === 4 &&
                   filtered.every(e => e.hours >= 2 && e.hours <= 4);
        }
    },

    {
        name: 'Date Range - Last Week',
        test: () => {
            const generator = new ReportGenerator();
            const { startDate } = generator.getDateRange('last', { value: 1, unit: 'weeks' });
            const expectedStart = new Date();
            expectedStart.setDate(expectedStart.getDate() - 7);
            return Math.abs(startDate - expectedStart) < 1000;
        }
    },

    {
        name: 'Date Range - Last Month',
        test: () => {
            const generator = new ReportGenerator();
            const { startDate } = generator.getDateRange('last', { value: 1, unit: 'months' });
            const expectedStart = new Date();
            expectedStart.setMonth(expectedStart.getMonth() - 1);
            return Math.abs(startDate - expectedStart) < 86400000; // Within 1 day
        }
    },

    {
        name: 'Date Range - Last Year',
        test: () => {
            const generator = new ReportGenerator();
            const { startDate } = generator.getDateRange('last', { value: 1, unit: 'years' });
            const expectedStart = new Date();
            expectedStart.setFullYear(expectedStart.getFullYear() - 1);
            return Math.abs(startDate - expectedStart) < 86400000; // Within 1 day
        }
    },

    {
        name: 'Generate Report - Filename Contains Date',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const report = generator.generateReport({}, 'csv');
            const today = new Date().toISOString().split('T')[0];
            return report.filename.includes(today);
        }
    },

    {
        name: 'Empty Filter Results - Handles Gracefully',
        test: () => {
            const generator = new ReportGenerator(sampleEntries);
            const filtered = generator.filterEntries({ organization: 'Nonexistent Org' });
            const stats = generator.calculateStats(filtered);
            return filtered.length === 0 &&
                   stats.totalHours === 0 &&
                   stats.totalEntries === 0;
        }
    }
];

// Test Runner
function runReportTests() {
    console.log('Running Report Generator Tests...\n');

    const results = {
        passed: 0,
        failed: 0,
        total: reportTests.length,
        failures: []
    };

    reportTests.forEach((testCase, index) => {
        try {
            const result = testCase.test();
            if (result) {
                results.passed++;
                console.log(`✓ ${index + 1}. ${testCase.name}`);
            } else {
                results.failed++;
                results.failures.push(testCase.name);
                console.log(`✗ ${index + 1}. ${testCase.name} - FAILED`);
            }
        } catch (error) {
            results.failed++;
            results.failures.push(testCase.name + ': ' + error.message);
            console.log(`✗ ${index + 1}. ${testCase.name} - ERROR: ${error.message}`);
        }
    });

    console.log(`\n========================================`);
    console.log(`Test Results: ${results.passed}/${results.total} passed`);
    console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

    if (results.failures.length > 0) {
        console.log(`\nFailed Tests:`);
        results.failures.forEach((failure, i) => {
            console.log(`  ${i + 1}. ${failure}`);
        });
    }

    console.log(`========================================\n`);

    return results;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    window.runReportTests = runReportTests;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runReportTests, reportTests };
}
