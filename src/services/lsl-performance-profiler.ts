import { LSLToken } from './lsl-parser.js';

export interface PerformanceProfile {
  overall: {
    score: number; // 0-100
    rating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    executionCost: number; // Estimated LSL execution units
    memoryFootprint: number; // Bytes
    networkRequests: number;
    resourceHandles: number;
  };
  metrics: {
    cyclomaticComplexity: number;
    nestingDepth: number;
    functionCount: number;
    eventHandlerCount: number;
    variableCount: number;
    stringOperations: number;
    listOperations: number;
    mathOperations: number;
  };
  bottlenecks: PerformanceBottleneck[];
  optimizations: PerformanceOptimization[];
  resourceUsage: ResourceUsage;
}

export interface PerformanceBottleneck {
  type: 'execution' | 'memory' | 'network' | 'timing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  impact: string;
  suggestion: string;
  costReduction?: number; // Percentage improvement possible
}

export interface PerformanceOptimization {
  category: 'algorithm' | 'memory' | 'network' | 'caching' | 'concurrency';
  priority: 'high' | 'medium' | 'low';
  description: string;
  implementation: string;
  expectedGain: string;
  effort: 'low' | 'medium' | 'high';
  before: string;
  after: string;
}

export interface ResourceUsage {
  memory: {
    variables: number;
    strings: number;
    lists: number;
    estimated: number;
  };
  handles: {
    listeners: number;
    sensors: number;
    timers: number;
    httpRequests: number;
  };
  execution: {
    functionCalls: number;
    loops: number;
    conditions: number;
    estimatedCycles: number;
  };
}

export class LSLPerformanceProfiler {
  private static readonly EXECUTION_COSTS = {
    // Function call costs (in execution units)
    'llSay': 10,
    'llWhisper': 10,
    'llShout': 10,
    'llOwnerSay': 5,
    'llRegionSay': 15,
    'llListen': 20,
    'llListenRemove': 10,
    'llSensor': 50,
    'llSensorRemove': 10,
    'llSetTimerEvent': 10,
    'llSleep': 0, // Special case - blocks but no CPU
    'llGetPos': 5,
    'llSetPos': 10,
    'llGetRot': 5,
    'llSetRot': 10,
    'llApplyImpulse': 25,
    'llSetVelocity': 25,
    'llHTTPRequest': 100,
    'llEmail': 200,
    'llTeleportAgent': 100,
    'llRezObject': 500,
    'llGiveInventory': 50,
    'llRequestPermissions': 25,
    'llTakeControls': 15,
    'llReleaseControls': 10,
    'llParticleSystem': 100,
    'llSetText': 20,
    'llSetTexture': 50,
    'llSetAlpha': 15,
    'llSetScale': 15,
    'llListInsertList': 10,
    'llDeleteSubList': 10,
    'llListReplaceList': 15,
    'llList2String': 5,
    'llString2List': 10,
    'llStringLength': 2,
    'llSubStringIndex': 5,
    'llGetSubString': 3,
    'llInsertString': 5,
    'llDeleteSubString': 5,
    'llMD5String': 50,
    'llSHA1String': 50
  };

  private static readonly MEMORY_COSTS = {
    'integer': 4,
    'float': 4,
    'string': 256, // Average string size
    'key': 36,
    'vector': 12,
    'rotation': 16,
    'list': 72 // Average list overhead + elements
  };

  analyzePerformance(tokens: LSLToken[], code: string): PerformanceProfile {
    const metrics = this.calculateMetrics(tokens, code);
    const resourceUsage = this.analyzeResourceUsage(tokens, code);
    const bottlenecks = this.identifyBottlenecks(tokens, code, metrics);
    const optimizations = this.suggestOptimizations(tokens, code, metrics, bottlenecks);
    
    const executionCost = this.calculateExecutionCost(tokens);
    const memoryFootprint = resourceUsage.memory.estimated;
    const networkRequests = resourceUsage.handles.httpRequests;
    const resourceHandles = resourceUsage.handles.listeners + 
                          resourceUsage.handles.sensors + 
                          resourceUsage.handles.timers;

    const overallScore = this.calculateOverallScore(metrics, bottlenecks, resourceUsage);
    const rating = this.getRating(overallScore);

    return {
      overall: {
        score: overallScore,
        rating,
        executionCost,
        memoryFootprint,
        networkRequests,
        resourceHandles
      },
      metrics,
      bottlenecks,
      optimizations,
      resourceUsage
    };
  }

  private calculateMetrics(tokens: LSLToken[], code: string): PerformanceProfile['metrics'] {
    const lines = code.split('\n');
    
    // Cyclomatic complexity
    const conditionals = tokens.filter(t => 
      t.type === 'keyword' && ['if', 'else', 'while', 'for', 'do'].includes(t.value)
    ).length;
    const cyclomaticComplexity = 1 + conditionals;

    // Nesting depth
    let maxDepth = 0;
    let currentDepth = 0;
    for (const token of tokens) {
      if (token.value === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (token.value === '}') {
        currentDepth--;
      }
    }

    // Function count (events + user-defined functions)
    const functionCount = (code.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
    
    // Event handlers
    const eventPatterns = [
      'state_entry', 'state_exit', 'touch_start', 'touch_end', 'collision_start',
      'collision_end', 'timer', 'listen', 'sensor', 'no_sensor', 'at_target',
      'not_at_target', 'at_rot_target', 'not_at_rot_target', 'money', 'email',
      'run_time_permissions', 'changed', 'attach', 'dataserver', 'moving_end',
      'moving_start', 'object_rez', 'remote_data', 'http_response', 'http_request',
      'control'
    ];
    const eventHandlerCount = eventPatterns.filter(event => 
      new RegExp(`\\b${event}\\s*\\(`).test(code)
    ).length;

    // Variable declarations
    const variablePatterns = ['integer', 'float', 'string', 'key', 'vector', 'rotation', 'list'];
    const variableCount = variablePatterns.reduce((count, type) => 
      count + (code.match(new RegExp(`\\b${type}\\s+\\w+`, 'g')) || []).length, 0
    );

    // Operations
    const stringOperations = (code.match(/\+\s*"|\+\s*\w+\s*\+|llGetSubString|llInsertString|llDeleteSubString/g) || []).length;
    const listOperations = (code.match(/llList\w+|llDeleteSubList|\[\s*\]|\+\s*\[/g) || []).length;
    const mathOperations = (code.match(/[\+\-\*\/\%]|llPow|llSqrt|llSin|llCos|llTan|llAbs/g) || []).length;

    return {
      cyclomaticComplexity,
      nestingDepth: maxDepth,
      functionCount,
      eventHandlerCount,
      variableCount,
      stringOperations,
      listOperations,
      mathOperations
    };
  }

  private analyzeResourceUsage(tokens: LSLToken[], code: string): ResourceUsage {
    // Memory usage
    const typePatterns = {
      'integer': /\binteger\s+\w+/g,
      'float': /\bfloat\s+\w+/g,
      'string': /\bstring\s+\w+/g,
      'key': /\bkey\s+\w+/g,
      'vector': /\bvector\s+\w+/g,
      'rotation': /\brotation\s+\w+/g,
      'list': /\blist\s+\w+/g
    };

    let memoryUsage = 0;
    const memoryCounts = { variables: 0, strings: 0, lists: 0, estimated: 0 };

    for (const [type, pattern] of Object.entries(typePatterns)) {
      const matches = (code.match(pattern) || []).length;
      const cost = LSLPerformanceProfiler.MEMORY_COSTS[type as keyof typeof LSLPerformanceProfiler.MEMORY_COSTS] || 0;
      memoryUsage += matches * cost;
      
      if (type === 'string') memoryCounts.strings += matches;
      else if (type === 'list') memoryCounts.lists += matches;
      else memoryCounts.variables += matches;
    }

    memoryCounts.estimated = memoryUsage;

    // Resource handles
    const listeners = (code.match(/llListen\s*\(/g) || []).length;
    const sensors = (code.match(/llSensor\s*\(/g) || []).length;
    const timers = (code.match(/llSetTimerEvent\s*\(/g) || []).length;
    const httpRequests = (code.match(/llHTTPRequest\s*\(/g) || []).length;

    // Execution metrics
    const functionCalls = tokens.filter(t => t.type === 'function').length;
    const loops = (code.match(/\b(for|while|do)\s*\(/g) || []).length;
    const conditions = (code.match(/\bif\s*\(/g) || []).length;
    const estimatedCycles = this.calculateExecutionCost(tokens);

    return {
      memory: memoryCounts,
      handles: {
        listeners,
        sensors,
        timers,
        httpRequests
      },
      execution: {
        functionCalls,
        loops,
        conditions,
        estimatedCycles
      }
    };
  }

  private calculateExecutionCost(tokens: LSLToken[]): number {
    let totalCost = 0;
    
    for (const token of tokens) {
      if (token.type === 'function') {
        const cost = LSLPerformanceProfiler.EXECUTION_COSTS[token.value as keyof typeof LSLPerformanceProfiler.EXECUTION_COSTS];
        if (cost) {
          totalCost += cost;
        } else {
          totalCost += 5; // Default cost for unknown functions
        }
      }
    }

    return totalCost;
  }

  private identifyBottlenecks(tokens: LSLToken[], code: string, metrics: PerformanceProfile['metrics']): PerformanceBottleneck[] {
    const bottlenecks: PerformanceBottleneck[] = [];

    // High complexity
    if (metrics.cyclomaticComplexity > 10) {
      bottlenecks.push({
        type: 'execution',
        severity: metrics.cyclomaticComplexity > 20 ? 'critical' : 'high',
        description: `High cyclomatic complexity (${metrics.cyclomaticComplexity})`,
        location: 'Script structure',
        impact: 'Increased execution time and maintenance difficulty',
        suggestion: 'Break down complex functions into smaller, focused functions',
        costReduction: Math.min(50, metrics.cyclomaticComplexity * 2)
      });
    }

    // Deep nesting
    if (metrics.nestingDepth > 5) {
      bottlenecks.push({
        type: 'execution',
        severity: metrics.nestingDepth > 8 ? 'high' : 'medium',
        description: `Deep nesting level (${metrics.nestingDepth})`,
        location: 'Nested control structures',
        impact: 'Poor readability and potential performance issues',
        suggestion: 'Refactor nested code using early returns or separate functions'
      });
    }

    // Aggressive timers
    const aggressiveTimer = code.match(/llSetTimerEvent\s*\(\s*0\.0[1-9]/);
    if (aggressiveTimer) {
      bottlenecks.push({
        type: 'timing',
        severity: 'critical',
        description: 'Aggressive timer interval detected',
        location: 'Timer event',
        impact: 'High CPU usage and potential script lag',
        suggestion: 'Use minimum 0.1s timer intervals',
        costReduction: 80
      });
    }

    // Excessive string operations
    if (metrics.stringOperations > 10) {
      bottlenecks.push({
        type: 'execution',
        severity: metrics.stringOperations > 20 ? 'high' : 'medium',
        description: `Many string operations (${metrics.stringOperations})`,
        location: 'String manipulation code',
        impact: 'Memory allocation overhead and execution time',
        suggestion: 'Use llList2String for complex string building',
        costReduction: 30
      });
    }

    // Expensive function calls
    const expensiveFunctions = ['llHTTPRequest', 'llEmail', 'llRezObject', 'llTeleportAgent'];
    for (const func of expensiveFunctions) {
      const count = (code.match(new RegExp(`\\b${func}\\s*\\(`, 'g')) || []).length;
      if (count > 3) {
        bottlenecks.push({
          type: 'execution',
          severity: count > 10 ? 'high' : 'medium',
          description: `Frequent use of expensive function ${func} (${count} times)`,
          location: `${func} calls`,
          impact: 'High execution cost and potential throttling',
          suggestion: 'Implement caching or rate limiting for expensive operations'
        });
      }
    }

    // Sleep in loops
    if (/for\s*\([^)]*\)\s*\{[^}]*llSleep/.test(code) || /while\s*\([^)]*\)\s*\{[^}]*llSleep/.test(code)) {
      bottlenecks.push({
        type: 'execution',
        severity: 'critical',
        description: 'llSleep() used inside loops',
        location: 'Loop with sleep',
        impact: 'Script blocking and poor responsiveness',
        suggestion: 'Use llSetTimerEvent() for periodic operations instead',
        costReduction: 90
      });
    }

    return bottlenecks;
  }

  private suggestOptimizations(tokens: LSLToken[], code: string, metrics: PerformanceProfile['metrics'], bottlenecks: PerformanceBottleneck[]): PerformanceOptimization[] {
    const optimizations: PerformanceOptimization[] = [];

    // String concatenation optimization
    if (metrics.stringOperations > 5) {
      optimizations.push({
        category: 'algorithm',
        priority: 'medium',
        description: 'Optimize string concatenation using lists',
        implementation: 'Replace multiple string concatenations with list building and llList2String',
        expectedGain: '20-40% reduction in string operation overhead',
        effort: 'low',
        before: 'string result = a + " " + b + " " + c + " " + d;',
        after: 'string result = llList2String([a, b, c, d], " ");'
      });
    }

    // Timer optimization
    if (code.includes('llSetTimerEvent(0.')) {
      optimizations.push({
        category: 'concurrency',
        priority: 'high',
        description: 'Optimize timer intervals for better performance',
        implementation: 'Increase timer intervals to minimum 0.1s and batch operations',
        expectedGain: '60-80% reduction in CPU usage',
        effort: 'low',
        before: 'llSetTimerEvent(0.01);',
        after: 'llSetTimerEvent(0.1); // Batch multiple operations'
      });
    }

    // Memory optimization for large lists
    if (metrics.listOperations > 5) {
      optimizations.push({
        category: 'memory',
        priority: 'medium',
        description: 'Optimize list operations to reduce memory fragmentation',
        implementation: 'Pre-allocate lists and use stride-based operations',
        expectedGain: '15-30% memory usage reduction',
        effort: 'medium',
        before: 'list data = [];\ndata += [item1];\ndata += [item2];',
        after: 'list data = [item1, item2]; // Pre-allocate when possible'
      });
    }

    // Caching for expensive operations
    const hasHTTPRequests = code.includes('llHTTPRequest');
    const hasSensorCalls = code.includes('llSensor');
    if (hasHTTPRequests || hasSensorCalls) {
      optimizations.push({
        category: 'caching',
        priority: 'high',
        description: 'Implement caching for expensive operations',
        implementation: 'Cache results of HTTP requests and sensor data with TTL',
        expectedGain: '50-70% reduction in expensive operation calls',
        effort: 'medium',
        before: 'llHTTPRequest(url, [], data); // Every time',
        after: 'if(cache_expired) llHTTPRequest(url, [], data); // Cached'
      });
    }

    // Event handler optimization
    if (metrics.eventHandlerCount > 5) {
      optimizations.push({
        category: 'algorithm',
        priority: 'low',
        description: 'Optimize event handler structure',
        implementation: 'Consolidate similar event handlers and use state machines',
        expectedGain: '10-20% reduction in event processing overhead',
        effort: 'high',
        before: 'Multiple separate event handlers',
        after: 'Consolidated event handling with state machine'
      });
    }

    // Loop optimization
    const hasLoops = code.includes('for(') || code.includes('while(');
    if (hasLoops && metrics.cyclomaticComplexity > 5) {
      optimizations.push({
        category: 'algorithm',
        priority: 'medium',
        description: 'Optimize loop structures and reduce iterations',
        implementation: 'Use early termination, break statements, and algorithm improvements',
        expectedGain: '25-45% reduction in loop execution time',
        effort: 'medium',
        before: 'for(i=0; i<1000; i++) { if(condition) result = i; }',
        after: 'for(i=0; i<1000; i++) { if(condition) { result = i; break; } }'
      });
    }

    return optimizations.sort((a, b) => {
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private calculateOverallScore(metrics: PerformanceProfile['metrics'], bottlenecks: PerformanceBottleneck[], resourceUsage: ResourceUsage): number {
    let score = 100;

    // Complexity penalty
    if (metrics.cyclomaticComplexity > 5) {
      score -= Math.min(30, (metrics.cyclomaticComplexity - 5) * 3);
    }

    // Nesting penalty
    if (metrics.nestingDepth > 3) {
      score -= Math.min(15, (metrics.nestingDepth - 3) * 3);
    }

    // Bottleneck penalties
    for (const bottleneck of bottlenecks) {
      switch (bottleneck.severity) {
        case 'critical': score -= 25; break;
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    }

    // Resource usage penalty
    if (resourceUsage.memory.estimated > 1000) {
      score -= Math.min(10, (resourceUsage.memory.estimated - 1000) / 200);
    }

    // Execution cost penalty
    if (resourceUsage.execution.estimatedCycles > 500) {
      score -= Math.min(15, (resourceUsage.execution.estimatedCycles - 500) / 100);
    }

    return Math.max(0, Math.round(score));
  }

  private getRating(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }

  generatePerformanceReport(profile: PerformanceProfile): string {
    let report = '# Performance Analysis Report\n\n';

    // Overall Score
    const emoji = profile.overall.rating === 'excellent' ? '🟢' :
                 profile.overall.rating === 'good' ? '🔵' :
                 profile.overall.rating === 'fair' ? '🟡' :
                 profile.overall.rating === 'poor' ? '🟠' : '🔴';

    report += `## Overall Performance ${emoji}\n`;
    report += `- **Score**: ${profile.overall.score}/100 (${profile.overall.rating})\n`;
    report += `- **Execution Cost**: ${profile.overall.executionCost} units\n`;
    report += `- **Memory Footprint**: ${profile.overall.memoryFootprint} bytes\n`;
    report += `- **Network Requests**: ${profile.overall.networkRequests}\n`;
    report += `- **Resource Handles**: ${profile.overall.resourceHandles}\n\n`;

    // Key Metrics
    report += '## Key Metrics\n';
    report += `- **Cyclomatic Complexity**: ${profile.metrics.cyclomaticComplexity}\n`;
    report += `- **Nesting Depth**: ${profile.metrics.nestingDepth}\n`;
    report += `- **Function Count**: ${profile.metrics.functionCount}\n`;
    report += `- **Event Handlers**: ${profile.metrics.eventHandlerCount}\n`;
    report += `- **Variables**: ${profile.metrics.variableCount}\n\n`;

    // Bottlenecks
    if (profile.bottlenecks.length > 0) {
      report += '## Performance Bottlenecks\n\n';
      for (const bottleneck of profile.bottlenecks) {
        const icon = bottleneck.severity === 'critical' ? '🚨' :
                    bottleneck.severity === 'high' ? '⚠️' :
                    bottleneck.severity === 'medium' ? '⚡' : 'ℹ️';
        
        report += `### ${icon} ${bottleneck.description}\n`;
        report += `**Type**: ${bottleneck.type} | **Severity**: ${bottleneck.severity}\n`;
        report += `**Impact**: ${bottleneck.impact}\n`;
        report += `**Suggestion**: ${bottleneck.suggestion}\n`;
        if (bottleneck.costReduction) {
          report += `**Potential Improvement**: ${bottleneck.costReduction}%\n`;
        }
        report += '\n';
      }
    }

    // Optimizations
    if (profile.optimizations.length > 0) {
      report += '## Optimization Opportunities\n\n';
      for (const opt of profile.optimizations) {
        const priorityIcon = opt.priority === 'high' ? '🎯' :
                             opt.priority === 'medium' ? '📈' : '💡';
        
        report += `### ${priorityIcon} ${opt.description}\n`;
        report += `**Category**: ${opt.category} | **Priority**: ${opt.priority} | **Effort**: ${opt.effort}\n`;
        report += `**Expected Gain**: ${opt.expectedGain}\n`;
        report += `**Implementation**: ${opt.implementation}\n\n`;
        
        report += '**Example:**\n';
        report += '```lsl\n';
        report += `// Before:\n${opt.before}\n\n`;
        report += `// After:\n${opt.after}\n`;
        report += '```\n\n';
      }
    }

    // Resource Usage Details
    report += '## Resource Usage\n';
    report += `### Memory\n`;
    report += `- Variables: ${profile.resourceUsage.memory.variables}\n`;
    report += `- Strings: ${profile.resourceUsage.memory.strings}\n`;
    report += `- Lists: ${profile.resourceUsage.memory.lists}\n`;
    report += `- Estimated Total: ${profile.resourceUsage.memory.estimated} bytes\n\n`;

    report += `### Active Handles\n`;
    report += `- Listeners: ${profile.resourceUsage.handles.listeners}\n`;
    report += `- Sensors: ${profile.resourceUsage.handles.sensors}\n`;
    report += `- Timers: ${profile.resourceUsage.handles.timers}\n`;
    report += `- HTTP Requests: ${profile.resourceUsage.handles.httpRequests}\n\n`;

    report += `### Execution\n`;
    report += `- Function Calls: ${profile.resourceUsage.execution.functionCalls}\n`;
    report += `- Loops: ${profile.resourceUsage.execution.loops}\n`;
    report += `- Conditions: ${profile.resourceUsage.execution.conditions}\n`;
    report += `- Estimated Cycles: ${profile.resourceUsage.execution.estimatedCycles}\n\n`;

    return report;
  }
}