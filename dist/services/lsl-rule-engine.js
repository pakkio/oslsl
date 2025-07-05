"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSLRuleEngine = void 0;
class LSLRuleEngine {
    rules = new Map();
    constructor() {
        this.initializeDefaultRules();
    }
    initializeDefaultRules() {
        // Performance Rules
        this.addRule({
            id: 'perf-aggressive-timer',
            name: 'Aggressive Timer Interval',
            category: 'performance',
            severity: 'warning',
            pattern: /llSetTimerEvent\s*\(\s*0\.0[1-9][0-9]*\s*\)/,
            message: 'Timer interval too aggressive, may cause lag',
            suggestion: 'Use minimum 0.1s intervals for better performance',
            documentation: 'Timers below 0.1s can cause significant performance issues',
            examples: {
                bad: 'llSetTimerEvent(0.01);',
                good: 'llSetTimerEvent(0.1);'
            }
        });
        this.addRule({
            id: 'perf-sleep-in-loop',
            name: 'Sleep in Loop',
            category: 'performance',
            severity: 'error',
            pattern: (tokens, code) => {
                return /for\s*\([^)]*\)\s*\{[^}]*llSleep[^}]*\}/.test(code) ||
                    /while\s*\([^)]*\)\s*\{[^}]*llSleep[^}]*\}/.test(code);
            },
            message: 'llSleep() in loops blocks script execution',
            suggestion: 'Use llSetTimerEvent() for periodic operations instead',
            examples: {
                bad: 'for(i=0; i<10; i++) { llSleep(1.0); }',
                good: 'llSetTimerEvent(1.0); // Handle in timer() event'
            }
        });
        this.addRule({
            id: 'perf-string-concatenation',
            name: 'Excessive String Concatenation',
            category: 'performance',
            severity: 'warning',
            pattern: (tokens, code) => {
                const concatenations = (code.match(/\+\s*"/g) || []).length;
                return concatenations > 5;
            },
            message: 'Multiple string concatenations detected',
            suggestion: 'Consider using llList2String() for complex string operations',
            examples: {
                bad: 'string result = a + b + c + d + e + f;',
                good: 'string result = llList2String([a,b,c,d,e,f], "");'
            }
        });
        // Security Rules
        this.addRule({
            id: 'sec-permission-without-check',
            name: 'Permission Request Without Check',
            category: 'security',
            severity: 'error',
            pattern: (tokens, code) => {
                const hasPermissionRequest = /llRequestPermissions/.test(code);
                const hasPermissionCheck = /run_time_permissions/.test(code);
                return hasPermissionRequest && !hasPermissionCheck;
            },
            message: 'Permission requested without proper handling',
            suggestion: 'Always implement run_time_permissions() event handler',
            examples: {
                bad: 'llRequestPermissions(llGetOwner(), PERMISSION_TAKE_CONTROLS);',
                good: 'llRequestPermissions(llGetOwner(), PERMISSION_TAKE_CONTROLS);\n// Implement run_time_permissions() event'
            }
        });
        this.addRule({
            id: 'sec-public-listen-channel',
            name: 'Public Listen Channel',
            category: 'security',
            severity: 'warning',
            pattern: /llListen\s*\(\s*0\s*,/,
            message: 'Listening on public channel 0 may expose sensitive operations',
            suggestion: 'Use private channels (negative numbers) for sensitive operations',
            examples: {
                bad: 'llListen(0, "", NULL_KEY, "");',
                good: 'llListen(-1000, "", NULL_KEY, "");'
            }
        });
        this.addRule({
            id: 'sec-unsafe-http-request',
            name: 'Unsafe HTTP Request',
            category: 'security',
            severity: 'warning',
            pattern: (tokens, code) => {
                return /llHTTPRequest\s*\(\s*[^,]*,\s*\[\s*\]/.test(code);
            },
            message: 'HTTP request without proper headers or validation',
            suggestion: 'Include proper headers and validate responses',
            examples: {
                bad: 'llHTTPRequest(url, [], data);',
                good: 'llHTTPRequest(url, [HTTP_METHOD,"POST","HTTP_MIMETYPE","application/json"], data);'
            }
        });
        // Memory Rules
        this.addRule({
            id: 'mem-resource-leak-listen',
            name: 'Listen Handle Resource Leak',
            category: 'memory',
            severity: 'error',
            pattern: (tokens, code) => {
                const hasListen = /llListen/.test(code);
                const hasListenRemove = /llListenRemove/.test(code);
                return hasListen && !hasListenRemove;
            },
            message: 'Listen handle created but never removed',
            suggestion: 'Always call llListenRemove() to clean up listen handles',
            examples: {
                bad: 'integer handle = llListen(0, "", NULL_KEY, "");',
                good: 'integer handle = llListen(0, "", NULL_KEY, "");\n// Later: llListenRemove(handle);'
            }
        });
        this.addRule({
            id: 'mem-resource-leak-sensor',
            name: 'Sensor Resource Leak',
            category: 'memory',
            severity: 'warning',
            pattern: (tokens, code) => {
                const hasSensor = /llSensor/.test(code);
                const hasSensorRemove = /llSensorRemove/.test(code);
                return hasSensor && !hasSensorRemove;
            },
            message: 'Sensor started but never removed',
            suggestion: 'Call llSensorRemove() when sensor is no longer needed',
            examples: {
                bad: 'llSensor("", NULL_KEY, AGENT, 10.0, PI);',
                good: 'llSensor("", NULL_KEY, AGENT, 10.0, PI);\n// Later: llSensorRemove();'
            }
        });
        this.addRule({
            id: 'mem-large-list-operations',
            name: 'Large List Operations',
            category: 'memory',
            severity: 'warning',
            pattern: (tokens, code) => {
                return /llListInsertList|llDeleteSubList|llListReplaceList/.test(code) &&
                    (code.match(/llList/g) || []).length > 5;
            },
            message: 'Multiple large list operations detected',
            suggestion: 'Consider optimizing list operations or using alternative data structures',
            examples: {
                bad: 'list = llListInsertList(llDeleteSubList(list, 0, 0), [newItem], 0);',
                good: 'list = [newItem] + llDeleteSubList(list, 0, 0);'
            }
        });
        // Maintainability Rules
        this.addRule({
            id: 'maint-magic-numbers',
            name: 'Magic Numbers',
            category: 'maintainability',
            severity: 'info',
            pattern: (tokens, code) => {
                const numbers = code.match(/\b\d{2,}\b/g) || [];
                return numbers.length > 3;
            },
            message: 'Multiple magic numbers detected',
            suggestion: 'Define constants for magic numbers to improve readability',
            examples: {
                bad: 'llSetTimerEvent(300.0); // What is 300?',
                good: 'float CLEANUP_INTERVAL = 300.0;\nllSetTimerEvent(CLEANUP_INTERVAL);'
            }
        });
        this.addRule({
            id: 'maint-long-function',
            name: 'Long Function',
            category: 'maintainability',
            severity: 'info',
            pattern: (tokens, code) => {
                const lines = code.split('\n');
                let inFunction = false;
                let functionLines = 0;
                let maxFunctionLines = 0;
                for (const line of lines) {
                    if (line.includes('(') && line.includes(')') && line.includes('{')) {
                        inFunction = true;
                        functionLines = 1;
                    }
                    else if (inFunction) {
                        functionLines++;
                        if (line.includes('}')) {
                            maxFunctionLines = Math.max(maxFunctionLines, functionLines);
                            inFunction = false;
                        }
                    }
                }
                return maxFunctionLines > 50;
            },
            message: 'Function is too long and may be hard to maintain',
            suggestion: 'Consider breaking down large functions into smaller, focused functions',
            examples: {
                bad: '// 50+ line function',
                good: '// Break into multiple focused functions'
            }
        });
        // Compatibility Rules
        this.addRule({
            id: 'compat-deprecated-function',
            name: 'Deprecated Function',
            category: 'compatibility',
            severity: 'warning',
            pattern: /llMakeExplosion|llMakeSmoke|llMakeFire|llMakeFountain|llSound|llLoopSound|llPlaySound|llStopSound/,
            message: 'Using deprecated function',
            suggestion: 'Replace with modern particle system or audio functions',
            examples: {
                bad: 'llMakeExplosion(10, 1.0, 1.0, 1.0, 1.0, "", <0,0,0>);',
                good: 'llParticleSystem([PSYS_SRC_PATTERN, PSYS_SRC_PATTERN_EXPLODE, ...]);'
            }
        });
        this.addRule({
            id: 'compat-opensim-specific',
            name: 'OpenSimulator Specific Function',
            category: 'compatibility',
            severity: 'info',
            pattern: /os[A-Z]\w+/,
            message: 'Using OpenSimulator-specific function',
            suggestion: 'This function may not work in Second Life',
            examples: {
                bad: 'osTeleportAgent(agent, destination, lookAt);',
                good: '// Consider SL-compatible alternatives or conditional compilation'
            }
        });
    }
    addRule(rule) {
        this.rules.set(rule.id, rule);
    }
    removeRule(ruleId) {
        this.rules.delete(ruleId);
    }
    analyzeCode(tokens, code) {
        const violations = [];
        const lines = code.split('\n');
        for (const [ruleId, rule] of this.rules) {
            try {
                let matched = false;
                if (rule.pattern instanceof RegExp) {
                    const match = code.match(rule.pattern);
                    if (match) {
                        matched = true;
                        const matchIndex = code.indexOf(match[0]);
                        const beforeMatch = code.substring(0, matchIndex);
                        const lineNumber = beforeMatch.split('\n').length;
                        const columnNumber = beforeMatch.split('\n').pop()?.length || 0;
                        violations.push({
                            ruleId: rule.id,
                            ruleName: rule.name,
                            category: rule.category,
                            severity: rule.severity,
                            message: rule.message,
                            suggestion: rule.suggestion,
                            line: lineNumber,
                            column: columnNumber,
                            context: this.getContext(lines, lineNumber - 1),
                            documentation: rule.documentation,
                            examples: rule.examples
                        });
                    }
                }
                else if (typeof rule.pattern === 'function') {
                    if (rule.pattern(tokens, code)) {
                        matched = true;
                        violations.push({
                            ruleId: rule.id,
                            ruleName: rule.name,
                            category: rule.category,
                            severity: rule.severity,
                            message: rule.message,
                            suggestion: rule.suggestion,
                            line: 1,
                            column: 0,
                            context: 'Multiple locations',
                            documentation: rule.documentation,
                            examples: rule.examples
                        });
                    }
                }
            }
            catch (error) {
                console.error(`Error applying rule ${ruleId}:`, error);
            }
        }
        return violations.sort((a, b) => {
            const severityOrder = { 'error': 0, 'warning': 1, 'info': 2 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });
    }
    getContext(lines, lineIndex) {
        const start = Math.max(0, lineIndex - 1);
        const end = Math.min(lines.length, lineIndex + 2);
        return lines.slice(start, end).join('\n');
    }
    getRulesByCategory(category) {
        return Array.from(this.rules.values()).filter(rule => rule.category === category);
    }
    getAllRules() {
        return Array.from(this.rules.values());
    }
    generateRuleReport(violations) {
        if (violations.length === 0) {
            return '# Rule Analysis Report\n\n✅ No rule violations detected!';
        }
        const severityCounts = violations.reduce((acc, v) => {
            acc[v.severity] = (acc[v.severity] || 0) + 1;
            return acc;
        }, {});
        const categoryCounts = violations.reduce((acc, v) => {
            acc[v.category] = (acc[v.category] || 0) + 1;
            return acc;
        }, {});
        let report = '# Rule Analysis Report\n\n';
        report += '## Summary\n';
        report += `- **Total Violations**: ${violations.length}\n`;
        report += `- **Errors**: ${severityCounts.error || 0}\n`;
        report += `- **Warnings**: ${severityCounts.warning || 0}\n`;
        report += `- **Info**: ${severityCounts.info || 0}\n\n`;
        report += '## Violations by Category\n';
        for (const [category, count] of Object.entries(categoryCounts)) {
            report += `- **${category}**: ${count}\n`;
        }
        report += '\n';
        report += '## Detailed Violations\n\n';
        const groupedViolations = violations.reduce((acc, violation) => {
            if (!acc[violation.category])
                acc[violation.category] = [];
            acc[violation.category].push(violation);
            return acc;
        }, {});
        for (const [category, categoryViolations] of Object.entries(groupedViolations)) {
            report += `### ${category.toUpperCase()} Issues\n\n`;
            for (const violation of categoryViolations) {
                const icon = violation.severity === 'error' ? '❌' :
                    violation.severity === 'warning' ? '⚠️' : 'ℹ️';
                report += `#### ${icon} ${violation.ruleName}\n`;
                report += `**Line ${violation.line}:${violation.column}** - ${violation.message}\n\n`;
                report += `**Suggestion**: ${violation.suggestion}\n\n`;
                if (violation.examples) {
                    report += '**Example:**\n';
                    report += '```lsl\n';
                    report += `// Bad:\n${violation.examples.bad}\n\n`;
                    report += `// Good:\n${violation.examples.good}\n`;
                    report += '```\n\n';
                }
                if (violation.context && violation.context !== 'Multiple locations') {
                    report += '**Context:**\n';
                    report += '```lsl\n';
                    report += violation.context;
                    report += '\n```\n\n';
                }
            }
        }
        return report;
    }
}
exports.LSLRuleEngine = LSLRuleEngine;
//# sourceMappingURL=lsl-rule-engine.js.map