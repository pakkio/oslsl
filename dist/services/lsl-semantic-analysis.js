"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSLSemanticAnalysisService = void 0;
const lsl_parser_js_1 = require("./lsl-parser.js");
const lsl_embeddings_js_1 = require("./lsl-embeddings.js");
const lsl_rule_engine_js_1 = require("./lsl-rule-engine.js");
const lsl_security_scanner_js_1 = require("./lsl-security-scanner.js");
const lsl_performance_profiler_js_1 = require("./lsl-performance-profiler.js");
class LSLSemanticAnalysisService {
    embeddingsService;
    ruleEngine;
    securityScanner;
    performanceProfiler;
    constructor() {
        this.embeddingsService = new lsl_embeddings_js_1.LSLEmbeddingsService();
        this.ruleEngine = new lsl_rule_engine_js_1.LSLRuleEngine();
        this.securityScanner = new lsl_security_scanner_js_1.LSLSecurityScanner();
        this.performanceProfiler = new lsl_performance_profiler_js_1.LSLPerformanceProfiler();
    }
    analyzeCode(code) {
        const tokens = lsl_parser_js_1.LSLParser.tokenize(code);
        const syntaxValidation = lsl_parser_js_1.LSLParser.validateLSLCode(code);
        // Enhanced analysis with specialized engines
        const performanceProfile = this.performanceProfiler.analyzePerformance(tokens, code);
        const securityVulnerabilities = this.securityScanner.scanCode(tokens, code);
        const securityReport = this.securityScanner.generateSecurityReport(securityVulnerabilities);
        const ruleViolations = this.ruleEngine.analyzeCode(tokens, code);
        return {
            syntaxValidation,
            semanticIssues: this.analyzeSemanticIssues(tokens, code),
            performanceProfile,
            securityReport,
            ruleViolations,
            suggestions: this.generateSuggestions(tokens, code),
            patterns: this.analyzePatterns(tokens, code)
        };
    }
    analyzeSemanticIssues(tokens, code) {
        const issues = [];
        const lines = code.split('\n');
        // Check for common semantic issues
        this.checkUnusedVariables(tokens, issues);
        this.checkDeprecatedFunctions(tokens, issues);
        this.checkResourceLeaks(tokens, issues);
        this.checkStateManagement(tokens, issues, lines);
        this.checkEventHandling(tokens, issues);
        return issues;
    }
    checkUnusedVariables(tokens, issues) {
        const declaredVars = new Set();
        const usedVars = new Set();
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            // Variable declaration
            if (token.type === 'keyword' && ['integer', 'float', 'string', 'key', 'vector', 'rotation', 'list'].includes(token.value)) {
                const nextToken = tokens[i + 1];
                if (nextToken && nextToken.type === 'variable') {
                    declaredVars.add(nextToken.value);
                }
            }
            // Variable usage
            if (token.type === 'variable') {
                usedVars.add(token.value);
            }
        }
        for (const varName of declaredVars) {
            if (!usedVars.has(varName)) {
                issues.push({
                    type: 'warning',
                    message: `Variable '${varName}' is declared but never used`,
                    line: 0,
                    column: 0,
                    context: `unused variable: ${varName}`
                });
            }
        }
    }
    checkDeprecatedFunctions(tokens, issues) {
        const deprecatedFunctions = [
            'llMakeExplosion', 'llMakeSmoke', 'llMakeFire', 'llMakeFountain',
            'llSound', 'llSoundPreload', 'llSetSoundRadius', 'llLoopSound',
            'llPlaySound', 'llStopSound', 'llPreloadSound'
        ];
        for (const token of tokens) {
            if (token.type === 'function' && deprecatedFunctions.includes(token.value)) {
                issues.push({
                    type: 'warning',
                    message: `Function '${token.value}' is deprecated`,
                    line: 0,
                    column: token.position,
                    context: `deprecated function: ${token.value}`
                });
            }
        }
    }
    checkResourceLeaks(tokens, issues) {
        const resourceFunctions = ['llListen', 'llSensor', 'llSetTimerEvent', 'llRequestURL'];
        const cleanupFunctions = ['llListenRemove', 'llSensorRemove', 'llSetTimerEvent', 'llReleaseURL'];
        const resourcesUsed = new Set();
        const resourcesCleaned = new Set();
        for (const token of tokens) {
            if (token.type === 'function') {
                if (resourceFunctions.includes(token.value)) {
                    resourcesUsed.add(token.value);
                }
                if (cleanupFunctions.includes(token.value)) {
                    resourcesCleaned.add(token.value);
                }
            }
        }
        if (resourcesUsed.has('llListen') && !resourcesCleaned.has('llListenRemove')) {
            issues.push({
                type: 'warning',
                message: 'llListen used without proper cleanup (llListenRemove)',
                line: 0,
                column: 0,
                context: 'resource leak: listen handle'
            });
        }
    }
    checkStateManagement(tokens, issues, lines) {
        const hasDefaultState = tokens.some(t => t.value === 'default');
        const hasStateEntry = tokens.some(t => t.value === 'state_entry');
        if (!hasDefaultState) {
            issues.push({
                type: 'error',
                message: 'Script must have a default state',
                line: 0,
                column: 0,
                context: 'missing default state'
            });
        }
        if (!hasStateEntry) {
            issues.push({
                type: 'warning',
                message: 'Default state should have a state_entry event',
                line: 0,
                column: 0,
                context: 'missing state_entry event'
            });
        }
    }
    checkEventHandling(tokens, issues) {
        const events = ['touch_start', 'collision_start', 'timer', 'listen', 'sensor'];
        const eventEnds = ['touch_end', 'collision_end'];
        const startEvents = new Set();
        const endEvents = new Set();
        for (const token of tokens) {
            if (token.type === 'variable' && events.includes(token.value)) {
                startEvents.add(token.value);
            }
            if (token.type === 'variable' && eventEnds.includes(token.value)) {
                endEvents.add(token.value);
            }
        }
        if (startEvents.has('touch_start') && !endEvents.has('touch_end')) {
            issues.push({
                type: 'info',
                message: 'Consider adding touch_end event for complete touch handling',
                line: 0,
                column: 0,
                context: 'incomplete event handling'
            });
        }
    }
    analyzePerformance(tokens, code) {
        const functionCalls = tokens.filter(t => t.type === 'function');
        const loops = tokens.filter(t => t.type === 'keyword' && ['for', 'while', 'do'].includes(t.value));
        const conditions = tokens.filter(t => t.type === 'keyword' && t.value === 'if');
        const cyclomaticComplexity = 1 + conditions.length + loops.length;
        const estimatedMemoryUsage = this.estimateMemoryUsage(tokens);
        const potentialBottlenecks = this.identifyBottlenecks(tokens);
        return {
            estimatedMemoryUsage,
            cyclomaticComplexity,
            functionCallCount: functionCalls.length,
            potentialBottlenecks,
            optimizationSuggestions: this.generateOptimizationSuggestions(tokens, cyclomaticComplexity)
        };
    }
    estimateMemoryUsage(tokens) {
        let memoryUsage = 0;
        for (const token of tokens) {
            if (token.type === 'keyword') {
                switch (token.value) {
                    case 'integer':
                    case 'float':
                        memoryUsage += 4;
                        break;
                    case 'string':
                        memoryUsage += 256; // Estimated average string size
                        break;
                    case 'key':
                        memoryUsage += 36;
                        break;
                    case 'vector':
                        memoryUsage += 12;
                        break;
                    case 'rotation':
                        memoryUsage += 16;
                        break;
                    case 'list':
                        memoryUsage += 72; // Estimated average list size
                        break;
                }
            }
        }
        return memoryUsage;
    }
    identifyBottlenecks(tokens) {
        const bottlenecks = [];
        const expensiveFunctions = [
            'llSensor', 'llHTTPRequest', 'llEmail', 'llTextBox', 'llDialog',
            'llRezObject', 'llGetInventoryName', 'llGetInventoryNumber'
        ];
        for (const token of tokens) {
            if (token.type === 'function' && expensiveFunctions.includes(token.value)) {
                bottlenecks.push(`${token.value}: Expensive function call`);
            }
        }
        return bottlenecks;
    }
    generateOptimizationSuggestions(tokens, complexity) {
        const suggestions = [];
        if (complexity > 10) {
            suggestions.push('Consider breaking down complex logic into smaller functions');
        }
        const stringConcatenations = tokens.filter(t => t.value === '+' &&
            this.isStringContext(tokens, tokens.indexOf(t)));
        if (stringConcatenations.length > 5) {
            suggestions.push('Consider using llList2String for multiple string concatenations');
        }
        const listOperations = tokens.filter(t => t.type === 'function' &&
            ['llListInsertList', 'llDeleteSubList', 'llListReplaceList'].includes(t.value));
        if (listOperations.length > 3) {
            suggestions.push('Multiple list operations detected - consider list optimization');
        }
        return suggestions;
    }
    isStringContext(tokens, index) {
        const prevToken = tokens[index - 1];
        const nextToken = tokens[index + 1];
        return (prevToken && prevToken.type === 'string') ||
            (nextToken && nextToken.type === 'string');
    }
    analyzeSecurityIssues(tokens, code) {
        const issues = [];
        // Check for unsafe HTTP operations
        if (tokens.some(t => t.type === 'function' && t.value === 'llHTTPRequest')) {
            issues.push({
                severity: 'medium',
                type: 'Network Security',
                description: 'HTTP requests can expose sensitive information',
                line: 0,
                recommendation: 'Validate and sanitize all HTTP request data'
            });
        }
        // Check for permission issues
        if (tokens.some(t => t.type === 'function' && t.value === 'llTakeControls')) {
            issues.push({
                severity: 'high',
                type: 'Permission Security',
                description: 'Taking avatar controls requires explicit permission',
                line: 0,
                recommendation: 'Always check permissions before taking controls'
            });
        }
        // Check for email security
        if (tokens.some(t => t.type === 'function' && t.value === 'llEmail')) {
            issues.push({
                severity: 'medium',
                type: 'Communication Security',
                description: 'Email function can be used for spam or data exfiltration',
                line: 0,
                recommendation: 'Implement rate limiting and validation for email functions'
            });
        }
        return issues;
    }
    generateSuggestions(tokens, code) {
        const suggestions = [];
        // Suggest modern alternatives
        if (tokens.some(t => t.type === 'function' && t.value === 'llSay')) {
            const similar = this.embeddingsService.findSimilarFunctions('llSay', 3);
            for (const sim of similar) {
                if (sim.similarity > 0.7) {
                    suggestions.push({
                        type: 'alternative',
                        description: `Consider using ${sim.functionName} for different communication needs`,
                        before: 'llSay(0, "Hello");',
                        after: `${sim.functionName}(0, "Hello");`,
                        impact: `${sim.reason}`
                    });
                }
            }
        }
        // Suggest optimizations
        if (code.includes('llSleep(')) {
            suggestions.push({
                type: 'optimize',
                description: 'Consider using llSetTimerEvent for better performance',
                before: 'llSleep(5.0);',
                after: 'llSetTimerEvent(5.0); // Handle in timer() event',
                impact: 'Reduces script execution time and improves responsiveness'
            });
        }
        return suggestions;
    }
    analyzePatterns(tokens, code) {
        const patterns = this.embeddingsService.analyzeCodePatterns(code);
        return patterns.map(p => ({
            pattern: p.pattern,
            confidence: p.confidence,
            description: this.getPatternDescription(p.pattern),
            suggestedImprovements: this.getPatternSuggestions(p.pattern)
        }));
    }
    getPatternDescription(pattern) {
        const descriptions = {
            'communication': 'Script uses communication functions for chat/messaging',
            'movement': 'Script handles object positioning and rotation',
            'physics': 'Script implements physics-based behaviors',
            'detection': 'Script uses sensors for object/avatar detection',
            'timing': 'Script uses timer-based operations',
            'avatar': 'Script interacts with avatar data and permissions',
            'inventory': 'Script manages inventory items and object creation',
            'network': 'Script performs network operations (HTTP, email)',
            'display': 'Script controls visual appearance and effects',
            'controls': 'Script handles avatar control and attachment'
        };
        return descriptions[pattern] || 'Unknown pattern detected';
    }
    getPatternSuggestions(pattern) {
        const suggestions = {
            'communication': [
                'Consider using llRegionSay for region-wide communication',
                'Implement rate limiting for chat functions',
                'Use appropriate channel numbers for different purposes'
            ],
            'movement': [
                'Consider using llMoveToTarget for smooth movement',
                'Implement collision detection for moving objects',
                'Use llSetKeyframedMotion for complex animations'
            ],
            'physics': [
                'Enable physics carefully to avoid performance issues',
                'Consider using llApplyRotationalImpulse for rotation',
                'Implement proper collision handling'
            ],
            'detection': [
                'Optimize sensor range and arc for performance',
                'Consider using llCastRay for precise detection',
                'Implement sensor timeout handling'
            ],
            'timing': [
                'Use appropriate timer intervals to avoid lag',
                'Consider using llSetTimerEvent(0.0) to stop timers',
                'Implement proper timer state management'
            ]
        };
        return suggestions[pattern] || ['No specific suggestions available'];
    }
    generateAnalysisReport(analysis) {
        let report = '# 🔍 LSL Comprehensive Code Analysis\n\n';
        // Syntax Validation
        report += '## 📝 Syntax Validation\n';
        report += `- **Status**: ${analysis.syntaxValidation.isValid ? '✅ Valid' : '❌ Invalid'}\n`;
        report += `- **Confidence**: ${analysis.syntaxValidation.confidence.toFixed(2)}\n`;
        if (analysis.syntaxValidation.errors.length > 0) {
            report += `- **Errors**: ${analysis.syntaxValidation.errors.join(', ')}\n`;
        }
        if (analysis.syntaxValidation.warnings.length > 0) {
            report += `- **Warnings**: ${analysis.syntaxValidation.warnings.join(', ')}\n`;
        }
        report += '\n';
        // Performance Analysis
        report += '## ⚡ Performance Analysis\n';
        const perf = analysis.performanceProfile;
        const perfEmoji = perf.overall.rating === 'excellent' ? '🟢' :
            perf.overall.rating === 'good' ? '🔵' :
                perf.overall.rating === 'fair' ? '🟡' :
                    perf.overall.rating === 'poor' ? '🟠' : '🔴';
        report += `- **Overall Score**: ${perf.overall.score}/100 ${perfEmoji} (${perf.overall.rating})\n`;
        report += `- **Execution Cost**: ${perf.overall.executionCost} units\n`;
        report += `- **Memory Footprint**: ${perf.overall.memoryFootprint} bytes\n`;
        report += `- **Cyclomatic Complexity**: ${perf.metrics.cyclomaticComplexity}\n`;
        if (perf.bottlenecks.length > 0) {
            report += '\n**Performance Bottlenecks:**\n';
            for (const bottleneck of perf.bottlenecks.slice(0, 3)) {
                const icon = bottleneck.severity === 'critical' ? '🚨' :
                    bottleneck.severity === 'high' ? '⚠️' : '⚡';
                report += `- ${icon} ${bottleneck.description}\n`;
            }
        }
        report += '\n';
        // Security Analysis
        report += '## 🛡️ Security Analysis\n';
        const sec = analysis.securityReport;
        const secEmoji = sec.overallRisk === 'critical' ? '🚨' :
            sec.overallRisk === 'high' ? '⚠️' :
                sec.overallRisk === 'medium' ? '🟡' : '🟢';
        report += `- **Overall Risk**: ${secEmoji} ${sec.overallRisk.toUpperCase()}\n`;
        report += `- **Vulnerabilities**: ${sec.summary.critical + sec.summary.high + sec.summary.medium + sec.summary.low}\n`;
        report += `  - Critical: ${sec.summary.critical} | High: ${sec.summary.high} | Medium: ${sec.summary.medium} | Low: ${sec.summary.low}\n`;
        if (sec.vulnerabilities.length > 0) {
            report += '\n**Key Security Issues:**\n';
            for (const vuln of sec.vulnerabilities.slice(0, 3)) {
                const icon = vuln.severity === 'critical' ? '🚨' :
                    vuln.severity === 'high' ? '⚠️' : '🔒';
                report += `- ${icon} ${vuln.threatName}: ${vuln.description}\n`;
            }
        }
        report += '\n';
        // Rule Violations
        if (analysis.ruleViolations.length > 0) {
            report += '## 📋 Code Quality Rules\n';
            const errorCount = analysis.ruleViolations.filter(r => r.severity === 'error').length;
            const warningCount = analysis.ruleViolations.filter(r => r.severity === 'warning').length;
            const infoCount = analysis.ruleViolations.filter(r => r.severity === 'info').length;
            report += `- **Violations**: ${analysis.ruleViolations.length} total\n`;
            report += `  - Errors: ${errorCount} | Warnings: ${warningCount} | Info: ${infoCount}\n`;
            if (analysis.ruleViolations.length > 0) {
                report += '\n**Top Issues:**\n';
                for (const violation of analysis.ruleViolations.slice(0, 3)) {
                    const icon = violation.severity === 'error' ? '❌' :
                        violation.severity === 'warning' ? '⚠️' : 'ℹ️';
                    report += `- ${icon} ${violation.ruleName}: ${violation.message}\n`;
                }
            }
            report += '\n';
        }
        // Detected Patterns
        if (analysis.patterns.length > 0) {
            report += '## 🎯 Architectural Patterns\n';
            for (const pattern of analysis.patterns.slice(0, 5)) {
                const confidence = Math.round(pattern.confidence * 100);
                report += `- **${pattern.pattern}** (${confidence}% confidence): ${pattern.description}\n`;
            }
            report += '\n';
        }
        // Top Recommendations
        const allRecommendations = [
            ...perf.optimizations.filter(o => o.priority === 'high').map(o => `⚡ ${o.description}`),
            ...sec.recommendations.map(r => `🛡️ ${r}`),
            ...analysis.suggestions.slice(0, 2).map(s => `💡 ${s.description}`)
        ];
        if (allRecommendations.length > 0) {
            report += '## 🎯 Top Recommendations\n';
            for (const rec of allRecommendations.slice(0, 5)) {
                report += `- ${rec}\n`;
            }
            report += '\n';
        }
        // Detailed Reports Available
        report += '## 📊 Detailed Analysis Available\n';
        report += '- Use `lsl-analyze-code` with full response for complete performance report\n';
        report += '- Security scan includes CWE mappings and compliance checks\n';
        report += '- Rule engine provides specific fix suggestions with examples\n';
        return report;
    }
}
exports.LSLSemanticAnalysisService = LSLSemanticAnalysisService;
//# sourceMappingURL=lsl-semantic-analysis.js.map