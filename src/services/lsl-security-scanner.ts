import { LSLToken } from './lsl-parser.js';

export interface SecurityThreat {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'injection' | 'privilege' | 'resource' | 'information' | 'availability';
  description: string;
  impact: string;
  mitigation: string;
  cwe?: string; // Common Weakness Enumeration
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

export class LSLSecurityScanner {
  private threats: Map<string, SecurityThreat> = new Map();

  constructor() {
    this.initializeSecurityThreats();
  }

  private initializeSecurityThreats(): void {
    // Injection Threats
    this.addThreat({
      id: 'inj-http-injection',
      name: 'HTTP Parameter Injection',
      severity: 'high',
      category: 'injection',
      description: 'Untrusted data used in HTTP requests without validation',
      impact: 'Data exfiltration, remote code execution on target servers',
      mitigation: 'Validate and sanitize all user inputs before HTTP requests',
      cwe: 'CWE-20',
      examples: {
        vulnerable: 'llHTTPRequest("http://api.com/user=" + llDetectedName(0), [], "");',
        secure: 'string name = llEscapeURL(llDetectedName(0));\nllHTTPRequest("http://api.com/user=" + name, [], "");'
      }
    });

    this.addThreat({
      id: 'inj-command-injection',
      name: 'Command Injection via Listen',
      severity: 'critical',
      category: 'injection',
      description: 'Direct execution of chat commands without validation',
      impact: 'Arbitrary function execution, script compromise',
      mitigation: 'Implement command whitelist and input validation',
      cwe: 'CWE-77',
      examples: {
        vulnerable: 'if(message == "exec " + cmd) { /* execute cmd directly */ }',
        secure: 'list allowed_commands = ["help", "status", "info"];\nif(llListFindList(allowed_commands, [cmd]) != -1) { /* execute */ }'
      }
    });

    // Privilege Escalation
    this.addThreat({
      id: 'priv-unauthorized-permissions',
      name: 'Unauthorized Permission Request',
      severity: 'high',
      category: 'privilege',
      description: 'Requesting permissions from non-owner without verification',
      impact: 'Unauthorized control over avatar or objects',
      mitigation: 'Always verify requester identity before granting permissions',
      cwe: 'CWE-269',
      examples: {
        vulnerable: 'llRequestPermissions(id, PERMISSION_TAKE_CONTROLS);',
        secure: 'if(id == llGetOwner()) {\n    llRequestPermissions(id, PERMISSION_TAKE_CONTROLS);\n}'
      }
    });

    this.addThreat({
      id: 'priv-permission-without-handler',
      name: 'Permission Without Proper Handler',
      severity: 'medium',
      category: 'privilege',
      description: 'Requesting permissions without implementing run_time_permissions handler',
      impact: 'Undefined behavior, potential security bypass',
      mitigation: 'Always implement run_time_permissions event handler',
      examples: {
        vulnerable: 'llRequestPermissions(llGetOwner(), PERMISSION_ATTACH);',
        secure: 'llRequestPermissions(llGetOwner(), PERMISSION_ATTACH);\n// Implement: run_time_permissions(integer perm) { ... }'
      }
    });

    // Resource Abuse
    this.addThreat({
      id: 'res-resource-exhaustion',
      name: 'Resource Exhaustion Attack',
      severity: 'medium',
      category: 'resource',
      description: 'Loops or timers that can consume excessive resources',
      impact: 'Script lag, simulator performance degradation',
      mitigation: 'Implement rate limiting and resource bounds',
      examples: {
        vulnerable: 'for(i=0; i<1000000; i++) { llSay(0, "spam"); }',
        secure: 'integer count = 0;\ntimer() {\n    if(count++ < 10) llSay(0, "message");\n    else llSetTimerEvent(0.0);\n}'
      }
    });

    this.addThreat({
      id: 'res-memory-leak',
      name: 'Memory Resource Leak',
      severity: 'medium',
      category: 'resource',
      description: 'Creating listeners, sensors, or other resources without cleanup',
      impact: 'Memory exhaustion, script failure',
      mitigation: 'Always clean up resources when no longer needed',
      examples: {
        vulnerable: 'integer handle = llListen(0, "", NULL_KEY, "");',
        secure: 'integer handle = llListen(0, "", NULL_KEY, "");\n// Later: llListenRemove(handle);'
      }
    });

    // Information Disclosure
    this.addThreat({
      id: 'info-sensitive-data-exposure',
      name: 'Sensitive Data Exposure',
      severity: 'high',
      category: 'information',
      description: 'Exposing sensitive information through chat or HTTP',
      impact: 'Privacy breach, credential exposure',
      mitigation: 'Use private channels and encrypt sensitive data',
      examples: {
        vulnerable: 'llSay(0, "Password: " + password);',
        secure: 'llOwnerSay("Login successful"); // Don\'t expose passwords'
      }
    });

    this.addThreat({
      id: 'info-debug-information-leak',
      name: 'Debug Information Disclosure',
      severity: 'low',
      category: 'information',
      description: 'Exposing internal state or debug information',
      impact: 'Information gathering for further attacks',
      mitigation: 'Remove debug output in production code',
      examples: {
        vulnerable: 'llSay(0, "DEBUG: variable = " + (string)sensitive_var);',
        secure: '// Remove debug statements in production'
      }
    });

    // Availability Threats
    this.addThreat({
      id: 'avail-denial-of-service',
      name: 'Denial of Service via Spam',
      severity: 'medium',
      category: 'availability',
      description: 'Sending excessive messages or requests',
      impact: 'Chat spam, server overload',
      mitigation: 'Implement rate limiting and cooldown periods',
      examples: {
        vulnerable: 'while(TRUE) { llEmail("target@example.com", "spam", "message"); }',
        secure: 'float last_email = 0;\nif(llGetTime() - last_email > 60.0) {\n    llEmail("target@example.com", "subject", "message");\n    last_email = llGetTime();\n}'
      }
    });

    this.addThreat({
      id: 'avail-infinite-loop',
      name: 'Infinite Loop DoS',
      severity: 'high',
      category: 'availability',
      description: 'Infinite loops that can freeze the script',
      impact: 'Script unresponsiveness, simulator impact',
      mitigation: 'Always ensure loop termination conditions',
      examples: {
        vulnerable: 'while(TRUE) { /* no break condition */ }',
        secure: 'integer max_iterations = 1000;\nwhile(condition && max_iterations-- > 0) { /* loop body */ }'
      }
    });

    // Communication Security
    this.addThreat({
      id: 'comm-insecure-channel',
      name: 'Insecure Communication Channel',
      severity: 'medium',
      category: 'information',
      description: 'Using public channels for sensitive communication',
      impact: 'Eavesdropping, message interception',
      mitigation: 'Use private channels for sensitive operations',
      examples: {
        vulnerable: 'llListen(0, "", NULL_KEY, ""); // Public channel',
        secure: 'llListen(-1000, "", NULL_KEY, ""); // Private channel'
      }
    });

    this.addThreat({
      id: 'comm-broadcast-sensitive',
      name: 'Broadcasting Sensitive Information',
      severity: 'high',
      category: 'information',
      description: 'Broadcasting sensitive data using llSay, llShout, or llRegionSay',
      impact: 'Information disclosure to unauthorized parties',
      mitigation: 'Use llOwnerSay or private channels for sensitive data',
      examples: {
        vulnerable: 'llSay(0, "API Key: " + api_key);',
        secure: 'llOwnerSay("API configured successfully");'
      }
    });
  }

  addThreat(threat: SecurityThreat): void {
    this.threats.set(threat.id, threat);
  }

  scanCode(tokens: LSLToken[], code: string): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];
    const lines = code.split('\n');

    for (const [threatId, threat] of this.threats) {
      const detectedVulns = this.detectThreat(threat, tokens, code, lines);
      vulnerabilities.push(...detectedVulns);
    }

    return vulnerabilities.sort((a, b) => {
      const severityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private detectThreat(threat: SecurityThreat, tokens: LSLToken[], code: string, lines: string[]): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    try {
      switch (threat.id) {
        case 'inj-http-injection':
          this.detectHttpInjection(threat, code, lines, vulnerabilities);
          break;

        case 'inj-command-injection':
          this.detectCommandInjection(threat, code, lines, vulnerabilities);
          break;

        case 'priv-unauthorized-permissions':
          this.detectUnauthorizedPermissions(threat, code, lines, vulnerabilities);
          break;

        case 'priv-permission-without-handler':
          this.detectPermissionWithoutHandler(threat, code, lines, vulnerabilities);
          break;

        case 'res-resource-exhaustion':
          this.detectResourceExhaustion(threat, code, lines, vulnerabilities);
          break;

        case 'res-memory-leak':
          this.detectMemoryLeak(threat, code, lines, vulnerabilities);
          break;

        case 'info-sensitive-data-exposure':
          this.detectSensitiveDataExposure(threat, code, lines, vulnerabilities);
          break;

        case 'info-debug-information-leak':
          this.detectDebugInformationLeak(threat, code, lines, vulnerabilities);
          break;

        case 'avail-denial-of-service':
          this.detectDenialOfService(threat, code, lines, vulnerabilities);
          break;

        case 'avail-infinite-loop':
          this.detectInfiniteLoop(threat, code, lines, vulnerabilities);
          break;

        case 'comm-insecure-channel':
          this.detectInsecureChannel(threat, code, lines, vulnerabilities);
          break;

        case 'comm-broadcast-sensitive':
          this.detectBroadcastSensitive(threat, code, lines, vulnerabilities);
          break;
      }
    } catch (error) {
      console.error(`Error detecting threat ${threat.id}:`, error);
    }

    return vulnerabilities;
  }

  private detectHttpInjection(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const httpPattern = /llHTTPRequest\s*\([^)]*\+[^)]*\)/g;
    let match;
    while ((match = httpPattern.exec(code)) !== null) {
      const lineNumber = this.getLineNumber(code, match.index);
      vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
    }
  }

  private detectCommandInjection(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    if (/listen\s*\([^)]*\)\s*\{[^}]*if\s*\([^}]*message[^}]*\)\s*\{/.test(code) &&
        !/llListFindList|whitelist|allowed/.test(code)) {
      vulnerabilities.push(this.createVulnerability(threat, 1, 0, lines, 'Direct command execution'));
    }
  }

  private detectUnauthorizedPermissions(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const permPattern = /llRequestPermissions\s*\(\s*([^,)]+)[^)]*\)/g;
    let match;
    while ((match = permPattern.exec(code)) !== null) {
      const requester = match[1].trim();
      if (requester !== 'llGetOwner()' && !requester.includes('llGetOwner')) {
        const lineNumber = this.getLineNumber(code, match.index);
        vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
      }
    }
  }

  private detectPermissionWithoutHandler(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    if (/llRequestPermissions/.test(code) && !/run_time_permissions/.test(code)) {
      const match = code.match(/llRequestPermissions/);
      if (match) {
        const lineNumber = this.getLineNumber(code, match.index);
        vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
      }
    }
  }

  private detectResourceExhaustion(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const patterns = [
      /for\s*\([^)]*;\s*[^;]*<\s*\d{4,}[^)]*\)/,  // Large loop
      /while\s*\(\s*TRUE\s*\)/,                    // Infinite while
      /llSetTimerEvent\s*\(\s*0\.0[1-9]\s*\)/      // Very fast timer
    ];

    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match) {
        const lineNumber = this.getLineNumber(code, match.index);
        vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
      }
    }
  }

  private detectMemoryLeak(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const resourceFunctions = ['llListen', 'llSensor', 'llRequestURL'];
    const cleanupFunctions = ['llListenRemove', 'llSensorRemove', 'llReleaseURL'];

    for (let i = 0; i < resourceFunctions.length; i++) {
      if (code.includes(resourceFunctions[i]) && !code.includes(cleanupFunctions[i])) {
        const match = code.match(new RegExp(resourceFunctions[i]));
        if (match) {
          const lineNumber = this.getLineNumber(code, match.index);
          vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
        }
      }
    }
  }

  private detectSensitiveDataExposure(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const sensitivePatterns = [
      /llSay\s*\([^)]*password[^)]*\)/i,
      /llSay\s*\([^)]*key[^)]*\)/i,
      /llSay\s*\([^)]*token[^)]*\)/i,
      /llShout\s*\([^)]*password[^)]*\)/i,
      /llRegionSay\s*\([^)]*password[^)]*\)/i
    ];

    for (const pattern of sensitivePatterns) {
      const match = code.match(pattern);
      if (match) {
        const lineNumber = this.getLineNumber(code, match.index);
        vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
      }
    }
  }

  private detectDebugInformationLeak(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const debugPattern = /llSay\s*\([^)]*DEBUG[^)]*\)/i;
    const match = code.match(debugPattern);
    if (match) {
      const lineNumber = this.getLineNumber(code, match.index);
      vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
    }
  }

  private detectDenialOfService(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const spamPatterns = [
      /while\s*\([^)]*\)\s*\{[^}]*llEmail[^}]*\}/,
      /for\s*\([^)]*\)\s*\{[^}]*llSay[^}]*\}/,
      /llSetTimerEvent\s*\(\s*0\.0[1-9][^)]*\)[^}]*llSay/
    ];

    for (const pattern of spamPatterns) {
      const match = code.match(pattern);
      if (match) {
        const lineNumber = this.getLineNumber(code, match.index);
        vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
      }
    }
  }

  private detectInfiniteLoop(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const infiniteLoopPatterns = [
      /while\s*\(\s*TRUE\s*\)\s*\{[^}]*\}/,
      /while\s*\(\s*1\s*\)\s*\{[^}]*\}/,
      /for\s*\([^;]*;\s*TRUE\s*;[^)]*\)/
    ];

    for (const pattern of infiniteLoopPatterns) {
      const match = code.match(pattern);
      if (match && !match[0].includes('break') && !match[0].includes('return')) {
        const lineNumber = this.getLineNumber(code, match.index);
        vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
      }
    }
  }

  private detectInsecureChannel(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const publicChannelPattern = /llListen\s*\(\s*0\s*,/;
    const match = code.match(publicChannelPattern);
    if (match) {
      const lineNumber = this.getLineNumber(code, match.index);
      vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
    }
  }

  private detectBroadcastSensitive(threat: SecurityThreat, code: string, lines: string[], vulnerabilities: SecurityVulnerability[]): void {
    const broadcastPatterns = [
      /llSay\s*\([^)]*(?:password|key|token|secret)[^)]*\)/i,
      /llShout\s*\([^)]*(?:password|key|token|secret)[^)]*\)/i,
      /llRegionSay\s*\([^)]*(?:password|key|token|secret)[^)]*\)/i
    ];

    for (const pattern of broadcastPatterns) {
      const match = code.match(pattern);
      if (match) {
        const lineNumber = this.getLineNumber(code, match.index);
        vulnerabilities.push(this.createVulnerability(threat, lineNumber, 0, lines, match[0]));
      }
    }
  }

  private getLineNumber(code: string, index: number | undefined): number {
    if (index === undefined) return 1;
    return code.substring(0, index).split('\n').length;
  }

  private createVulnerability(threat: SecurityThreat, line: number, column: number, lines: string[], evidence: string): SecurityVulnerability {
    return {
      threatId: threat.id,
      threatName: threat.name,
      severity: threat.severity,
      category: threat.category,
      description: threat.description,
      impact: threat.impact,
      mitigation: threat.mitigation,
      line,
      column,
      context: this.getContext(lines, line - 1),
      evidence,
      cwe: threat.cwe,
      examples: threat.examples
    };
  }

  private getContext(lines: string[], lineIndex: number): string {
    const start = Math.max(0, lineIndex - 1);
    const end = Math.min(lines.length, lineIndex + 2);
    return lines.slice(start, end).join('\n');
  }

  generateSecurityReport(vulnerabilities: SecurityVulnerability[]): SecurityReport {
    const summary = vulnerabilities.reduce((acc, vuln) => {
      acc[vuln.severity]++;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });

    const overallRisk: 'critical' | 'high' | 'medium' | 'low' = 
      summary.critical > 0 ? 'critical' :
      summary.high > 0 ? 'high' :
      summary.medium > 0 ? 'medium' : 'low';

    const recommendations = this.generateRecommendations(vulnerabilities);
    const complianceChecks = this.performComplianceChecks(vulnerabilities);

    return {
      overallRisk,
      vulnerabilities,
      summary,
      recommendations,
      complianceChecks
    };
  }

  private generateRecommendations(vulnerabilities: SecurityVulnerability[]): string[] {
    const recommendations: string[] = [];
    const categories = new Set(vulnerabilities.map(v => v.category));

    if (categories.has('injection')) {
      recommendations.push('Implement input validation and sanitization for all user-provided data');
    }
    if (categories.has('privilege')) {
      recommendations.push('Implement proper access control and permission verification');
    }
    if (categories.has('resource')) {
      recommendations.push('Add resource limits and cleanup mechanisms');
    }
    if (categories.has('information')) {
      recommendations.push('Use secure communication channels and avoid information disclosure');
    }
    if (categories.has('availability')) {
      recommendations.push('Implement rate limiting and DoS protection mechanisms');
    }

    if (vulnerabilities.some(v => v.severity === 'critical' || v.severity === 'high')) {
      recommendations.push('Address critical and high severity vulnerabilities immediately');
    }

    return recommendations;
  }

  private performComplianceChecks(vulnerabilities: SecurityVulnerability[]): SecurityReport['complianceChecks'] {
    return {
      dataProtection: !vulnerabilities.some(v => v.category === 'information'),
      accessControl: !vulnerabilities.some(v => v.category === 'privilege'),
      resourceManagement: !vulnerabilities.some(v => v.category === 'resource'),
      communicationSecurity: !vulnerabilities.some(v => v.threatId.startsWith('comm-'))
    };
  }
}