import { LSLToken } from './lsl-parser.js';
export interface LSLRule {
    id: string;
    name: string;
    category: 'performance' | 'security' | 'memory' | 'maintainability' | 'compatibility';
    severity: 'error' | 'warning' | 'info';
    pattern: RegExp | ((tokens: LSLToken[], code: string) => boolean);
    message: string;
    suggestion: string;
    documentation?: string;
    examples?: {
        bad: string;
        good: string;
    };
}
export interface RuleViolation {
    ruleId: string;
    ruleName: string;
    category: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
    line: number;
    column: number;
    context: string;
    documentation?: string;
    examples?: {
        bad: string;
        good: string;
    };
}
export declare class LSLRuleEngine {
    private rules;
    constructor();
    private initializeDefaultRules;
    addRule(rule: LSLRule): void;
    removeRule(ruleId: string): void;
    analyzeCode(tokens: LSLToken[], code: string): RuleViolation[];
    private getContext;
    getRulesByCategory(category: string): LSLRule[];
    getAllRules(): LSLRule[];
    generateRuleReport(violations: RuleViolation[]): string;
}
//# sourceMappingURL=lsl-rule-engine.d.ts.map