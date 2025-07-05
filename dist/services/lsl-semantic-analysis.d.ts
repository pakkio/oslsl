import { LSLValidationResult } from './lsl-parser.js';
import { LSLEmbeddingsService } from './lsl-embeddings.js';
import { RuleViolation } from './lsl-rule-engine.js';
import { SecurityReport } from './lsl-security-scanner.js';
import { PerformanceProfile } from './lsl-performance-profiler.js';
export interface LSLAnalysisResult {
    syntaxValidation: LSLValidationResult;
    semanticIssues: SemanticIssue[];
    performanceProfile: PerformanceProfile;
    securityReport: SecurityReport;
    ruleViolations: RuleViolation[];
    suggestions: CodeSuggestion[];
    patterns: PatternAnalysis[];
}
export interface SemanticIssue {
    type: 'warning' | 'error' | 'info';
    message: string;
    line: number;
    column: number;
    context: string;
}
export interface PerformanceMetrics {
    estimatedMemoryUsage: number;
    cyclomaticComplexity: number;
    functionCallCount: number;
    potentialBottlenecks: string[];
    optimizationSuggestions: string[];
}
export interface SecurityIssue {
    severity: 'high' | 'medium' | 'low';
    type: string;
    description: string;
    line: number;
    recommendation: string;
}
export interface CodeSuggestion {
    type: 'refactor' | 'optimize' | 'modernize' | 'alternative';
    description: string;
    before: string;
    after: string;
    impact: string;
}
export interface PatternAnalysis {
    pattern: string;
    confidence: number;
    description: string;
    suggestedImprovements: string[];
}
export declare class LSLSemanticAnalysisService {
    embeddingsService: LSLEmbeddingsService;
    private ruleEngine;
    private securityScanner;
    private performanceProfiler;
    constructor();
    analyzeCode(code: string): LSLAnalysisResult;
    private analyzeSemanticIssues;
    private checkUnusedVariables;
    private checkDeprecatedFunctions;
    private checkResourceLeaks;
    private checkStateManagement;
    private checkEventHandling;
    private analyzePerformance;
    private estimateMemoryUsage;
    private identifyBottlenecks;
    private generateOptimizationSuggestions;
    private isStringContext;
    private analyzeSecurityIssues;
    private generateSuggestions;
    private analyzePatterns;
    private getPatternDescription;
    private getPatternSuggestions;
    generateAnalysisReport(analysis: LSLAnalysisResult): string;
}
//# sourceMappingURL=lsl-semantic-analysis.d.ts.map