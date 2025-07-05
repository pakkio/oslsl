import { LSLToken } from './lsl-parser.js';
export interface SecurityThreat {
    id: string;
    name: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: 'injection' | 'privilege' | 'resource' | 'information' | 'availability';
    description: string;
    impact: string;
    mitigation: string;
    cwe?: string;
    examples: {
        vulnerable: string;
        secure: string;
    };
}
export interface SecurityVulnerability {
    threatId: string;
    threatName: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    description: string;
    impact: string;
    mitigation: string;
    line: number;
    column: number;
    context: string;
    evidence: string;
    cwe?: string;
    examples: {
        vulnerable: string;
        secure: string;
    };
}
export interface SecurityReport {
    overallRisk: 'critical' | 'high' | 'medium' | 'low';
    vulnerabilities: SecurityVulnerability[];
    summary: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    recommendations: string[];
    complianceChecks: {
        dataProtection: boolean;
        accessControl: boolean;
        resourceManagement: boolean;
        communicationSecurity: boolean;
    };
}
export declare class LSLSecurityScanner {
    private threats;
    constructor();
    private initializeSecurityThreats;
    addThreat(threat: SecurityThreat): void;
    scanCode(tokens: LSLToken[], code: string): SecurityVulnerability[];
    private detectThreat;
    private detectHttpInjection;
    private detectCommandInjection;
    private detectUnauthorizedPermissions;
    private detectPermissionWithoutHandler;
    private detectResourceExhaustion;
    private detectMemoryLeak;
    private detectSensitiveDataExposure;
    private detectDebugInformationLeak;
    private detectDenialOfService;
    private detectInfiniteLoop;
    private detectInsecureChannel;
    private detectBroadcastSensitive;
    private getLineNumber;
    private createVulnerability;
    private getContext;
    generateSecurityReport(vulnerabilities: SecurityVulnerability[]): SecurityReport;
    private generateRecommendations;
    private performComplianceChecks;
}
//# sourceMappingURL=lsl-security-scanner.d.ts.map