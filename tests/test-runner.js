/**
 * Simple Test Runner
 * A lightweight testing framework for browser-based tests
 */

class TestRunner {
    constructor() {
        this.suites = [];
        this.currentSuite = null;
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    /**
     * Create a test suite
     */
    describe(suiteName, suiteFunc) {
        const suite = {
            name: suiteName,
            tests: [],
            beforeEach: null,
            afterEach: null
        };

        this.currentSuite = suite;
        suiteFunc();
        this.suites.push(suite);
        this.currentSuite = null;
    }

    /**
     * Add a test case
     */
    it(testName, testFunc) {
        if (!this.currentSuite) {
            throw new Error('it() must be called inside describe()');
        }

        this.currentSuite.tests.push({
            name: testName,
            func: testFunc,
            status: 'pending',
            error: null
        });
    }

    /**
     * Set up before each test
     */
    beforeEach(func) {
        if (!this.currentSuite) {
            throw new Error('beforeEach() must be called inside describe()');
        }
        this.currentSuite.beforeEach = func;
    }

    /**
     * Clean up after each test
     */
    afterEach(func) {
        if (!this.currentSuite) {
            throw new Error('afterEach() must be called inside describe()');
        }
        this.currentSuite.afterEach = func;
    }

    /**
     * Run all tests
     */
    async runAll() {
        this.results = { passed: 0, failed: 0, total: 0 };

        for (const suite of this.suites) {
            for (const test of suite.tests) {
                this.results.total++;

                try {
                    // Run beforeEach
                    if (suite.beforeEach) {
                        await suite.beforeEach();
                    }

                    // Run the test
                    await test.func();

                    // Run afterEach
                    if (suite.afterEach) {
                        await suite.afterEach();
                    }

                    test.status = 'pass';
                    this.results.passed++;
                } catch (error) {
                    test.status = 'fail';
                    test.error = error.message;
                    this.results.failed++;
                }
            }
        }

        return this.results;
    }

    /**
     * Render test results to DOM
     */
    render() {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        this.suites.forEach(suite => {
            const suiteDiv = document.createElement('div');
            suiteDiv.className = 'test-suite';

            const suiteHeader = document.createElement('div');
            suiteHeader.className = 'suite-header';
            suiteHeader.textContent = suite.name;
            suiteDiv.appendChild(suiteHeader);

            suite.tests.forEach(test => {
                const testDiv = document.createElement('div');
                testDiv.className = 'test-case';

                const testName = document.createElement('div');
                testName.className = 'test-name';
                testName.textContent = test.name;
                testDiv.appendChild(testName);

                const testStatus = document.createElement('span');
                testStatus.className = `test-status ${test.status}`;
                testStatus.textContent = test.status === 'pass' ? '✓ PASS' : '✗ FAIL';
                testDiv.appendChild(testStatus);

                if (test.error) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'test-error';
                    errorDiv.textContent = test.error;
                    testName.appendChild(errorDiv);
                }

                suiteDiv.appendChild(testDiv);
            });

            resultsDiv.appendChild(suiteDiv);
        });

        // Render summary
        const summaryDiv = document.getElementById('summary');
        const allPassed = this.results.failed === 0;
        summaryDiv.className = `summary ${allPassed ? 'success' : 'failure'}`;
        summaryDiv.textContent = `Tests: ${this.results.passed} passed, ${this.results.failed} failed, ${this.results.total} total`;
    }
}

/**
 * Assertion library
 */
const expect = (actual) => {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
            }
        },

        toEqual(expected) {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
            }
        },

        toBeNull() {
            if (actual !== null) {
                throw new Error(`Expected null but got ${JSON.stringify(actual)}`);
            }
        },

        toBeUndefined() {
            if (actual !== undefined) {
                throw new Error(`Expected undefined but got ${JSON.stringify(actual)}`);
            }
        },

        toBeTruthy() {
            if (!actual) {
                throw new Error(`Expected truthy value but got ${JSON.stringify(actual)}`);
            }
        },

        toBeFalsy() {
            if (actual) {
                throw new Error(`Expected falsy value but got ${JSON.stringify(actual)}`);
            }
        },

        toContain(expected) {
            if (Array.isArray(actual)) {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
                }
            } else if (typeof actual === 'string') {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected string to contain "${expected}"`);
                }
            } else {
                throw new Error('toContain() only works with arrays and strings');
            }
        },

        toHaveLength(expected) {
            if (actual.length !== expected) {
                throw new Error(`Expected length ${expected} but got ${actual.length}`);
            }
        },

        toBeGreaterThan(expected) {
            if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        },

        toBeLessThan(expected) {
            if (actual >= expected) {
                throw new Error(`Expected ${actual} to be less than ${expected}`);
            }
        },

        toBeCloseTo(expected, precision = 2) {
            const multiplier = Math.pow(10, precision);
            const actualRounded = Math.round(actual * multiplier) / multiplier;
            const expectedRounded = Math.round(expected * multiplier) / multiplier;
            if (actualRounded !== expectedRounded) {
                throw new Error(`Expected ${actual} to be close to ${expected}`);
            }
        },

        toThrow() {
            if (typeof actual !== 'function') {
                throw new Error('toThrow() requires a function');
            }
            try {
                actual();
                throw new Error('Expected function to throw but it did not');
            } catch (e) {
                // Expected to throw
            }
        }
    };
};

// Global test runner instance
const runner = new TestRunner();

// Export global functions
window.describe = (name, func) => runner.describe(name, func);
window.it = (name, func) => runner.it(name, func);
window.beforeEach = (func) => runner.beforeEach(func);
window.afterEach = (func) => runner.afterEach(func);
window.expect = expect;

// Run tests when button clicked
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('run-tests');
    const progressDiv = document.getElementById('progress');

    runButton.addEventListener('click', async () => {
        runButton.disabled = true;
        progressDiv.textContent = 'Running tests...';

        await runner.runAll();
        runner.render();

        progressDiv.textContent = 'Tests completed!';
        runButton.disabled = false;
    });
});
