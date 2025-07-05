import { LSLParser, LSLToken, LSLValidationResult } from './lsl-parser.js';
import { LSLEmbeddingsService, SimilarityResult } from './lsl-embeddings.js';

export interface LSLAnalysisResult {
  syntaxValidation: LSLValidationResult;
  semanticIssues: SemanticIssue[];
  performanceMetrics: PerformanceMetrics;
  securityIssues: SecurityIssue[];
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

export class LSLSemanticAnalysisService {
  private embeddingsService: LSLEmbeddingsService;

  constructor() {
    this.embeddingsService = new LSLEmbeddingsService();
  }

  analyzeCode(code: string): LSLAnalysisResult {
    const tokens = LSLParser.tokenize(code);
    const syntaxValidation = LSLParser.validateLSLCode(code);

    return {
      syntaxValidation,
      semanticIssues: this.analyzeSemanticIssues(tokens, code),
      performanceMetrics: this.analyzePerformance(tokens, code),
      securityIssues: this.analyzeSecurityIssues(tokens, code),
      suggestions: this.generateSuggestions(tokens, code),
      patterns: this.analyzePatterns(tokens, code)
    };
  }

  private analyzeSemanticIssues(tokens: LSLToken[], code: string): SemanticIssue[] {
    const issues: SemanticIssue[] = [];
    const lines = code.split('\n');

    // Check for common semantic issues
    this.checkUnusedVariables(tokens, issues);
    this.checkDeprecatedFunctions(tokens, issues);
    this.checkResourceLeaks(tokens, issues);
    this.checkStateManagement(tokens, issues, lines);
    this.checkEventHandling(tokens, issues);

    return issues;
  }

  private checkUnusedVariables(tokens: LSLToken[], issues: SemanticIssue[]): void {
    const declaredVars = new Set<string>();
    const usedVars = new Set<string>();

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

  private checkDeprecatedFunctions(tokens: LSLToken[], issues: SemanticIssue[]): void {
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

  private checkResourceLeaks(tokens: LSLToken[], issues: SemanticIssue[]): void {
    const resourceFunctions = ['llListen', 'llSensor', 'llSetTimerEvent', 'llRequestURL'];
    const cleanupFunctions = ['llListenRemove', 'llSensorRemove', 'llSetTimerEvent', 'llReleaseURL'];

    const resourcesUsed = new Set<string>();
    const resourcesCleaned = new Set<string>();

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

  private checkStateManagement(tokens: LSLToken[], issues: SemanticIssue[], lines: string[]): void {
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

  private checkEventHandling(tokens: LSLToken[], issues: SemanticIssue[]): void {
    const events = ['touch_start', 'collision_start', 'timer', 'listen', 'sensor'];
    const eventEnds = ['touch_end', 'collision_end'];

    const startEvents = new Set<string>();
    const endEvents = new Set<string>();

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

  private analyzePerformance(tokens: LSLToken[], code: string): PerformanceMetrics {
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

  private estimateMemoryUsage(tokens: LSLToken[]): number {
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

  private identifyBottlenecks(tokens: LSLToken[]): string[] {
    const bottlenecks: string[] = [];
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

  private generateOptimizationSuggestions(tokens: LSLToken[], complexity: number): string[] {
    const suggestions: string[] = [];

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

  private isStringContext(tokens: LSLToken[], index: number): boolean {
    const prevToken = tokens[index - 1];
    const nextToken = tokens[index + 1];
    return (prevToken && prevToken.type === 'string') || 
           (nextToken && nextToken.type === 'string');
  }

  private analyzeSecurityIssues(tokens: LSLToken[], code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

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

  private generateSuggestions(tokens: LSLToken[], code: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

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

  private analyzePatterns(tokens: LSLToken[], code: string): PatternAnalysis[] {
    const patterns = this.embeddingsService.analyzeCodePatterns(code);
    
    return patterns.map(p => ({
      pattern: p.pattern,
      confidence: p.confidence,
      description: this.getPatternDescription(p.pattern),
      suggestedImprovements: this.getPatternSuggestions(p.pattern)
    }));
  }

  private getPatternDescription(pattern: string): string {
    const descriptions: { [key: string]: string } = {
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

  private getPatternSuggestions(pattern: string): string[] {
    const suggestions: { [key: string]: string[] } = {
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

  generateAnalysisReport(analysis: LSLAnalysisResult): string {
    const report = [
      '# LSL Code Analysis Report',
      '',
      '## Syntax Validation',
      `- **Status**: ${analysis.syntaxValidation.isValid ? 'Valid' : 'Invalid'}`,
      `- **Confidence**: ${analysis.syntaxValidation.confidence.toFixed(2)}`,
      analysis.syntaxValidation.errors.length > 0 ? `- **Errors**: ${analysis.syntaxValidation.errors.join(', ')}` : '',
      analysis.syntaxValidation.warnings.length > 0 ? `- **Warnings**: ${analysis.syntaxValidation.warnings.join(', ')}` : '',
      '',
      '## Performance Metrics',
      `- **Estimated Memory Usage**: ${analysis.performanceMetrics.estimatedMemoryUsage} bytes`,
      `- **Cyclomatic Complexity**: ${analysis.performanceMetrics.cyclomaticComplexity}`,
      `- **Function Call Count**: ${analysis.performanceMetrics.functionCallCount}`,
      '',
      '## Security Analysis',
      analysis.securityIssues.length > 0 ? analysis.securityIssues.map(issue => 
        `- **${issue.severity.toUpperCase()}**: ${issue.description}`
      ).join('\n') : '- No security issues detected',
      '',
      '## Detected Patterns',
      analysis.patterns.map(pattern => 
        `- **${pattern.pattern}** (${pattern.confidence.toFixed(2)}): ${pattern.description}`
      ).join('\n'),
      '',
      '## Optimization Suggestions',
      analysis.performanceMetrics.optimizationSuggestions.map(suggestion => 
        `- ${suggestion}`
      ).join('\n'),
      '',
      '## Code Suggestions',
      analysis.suggestions.map(suggestion => 
        `- **${suggestion.type}**: ${suggestion.description}`
      ).join('\n')
    ].filter(line => line !== '').join('\n');

    return report;
  }
}