import { LSLToken } from './lsl-parser.js';
export interface PerformanceProfile {
    overall: {
        score: number;
        rating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
        executionCost: number;
        memoryFootprint: number;
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
    costReduction?: number;
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
export declare class LSLPerformanceProfiler {
    private static readonly EXECUTION_COSTS;
    private static readonly MEMORY_COSTS;
    analyzePerformance(tokens: LSLToken[], code: string): PerformanceProfile;
    private calculateMetrics;
    private analyzeResourceUsage;
    private calculateExecutionCost;
    private identifyBottlenecks;
    private suggestOptimizations;
    private calculateOverallScore;
    private getRating;
    generatePerformanceReport(profile: PerformanceProfile): string;
}
//# sourceMappingURL=lsl-performance-profiler.d.ts.map