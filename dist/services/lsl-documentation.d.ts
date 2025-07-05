export declare class LSLDocumentationService {
    private static readonly BASE_URLS;
    lookupLSLFunction(functionName: string): Promise<any>;
    lookupLSLEvent(eventName: string): Promise<any>;
    lookupOSSLFunction(functionName: string): Promise<any>;
    searchExamples(topic: string, platform?: 'secondlife' | 'opensim' | 'both'): Promise<any>;
    getBestPractices(category?: 'performance' | 'security' | 'memory' | 'general'): Promise<any>;
    private extractExamples;
    private getFallbackResponse;
}
//# sourceMappingURL=lsl-documentation.d.ts.map