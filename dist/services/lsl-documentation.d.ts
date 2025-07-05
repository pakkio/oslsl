export declare class LSLDocumentationService {
    private static readonly BASE_URLS;
    private cache;
    private cacheExpiry;
    private readonly CACHE_TTL;
    lookupLSLFunction(functionName: string): Promise<any>;
    lookupLSLEvent(eventName: string): Promise<any>;
    lookupOSSLFunction(functionName: string): Promise<any>;
    searchExamples(topic: string, platform?: 'secondlife' | 'opensim' | 'both'): Promise<any>;
    getBestPractices(category?: 'performance' | 'security' | 'memory' | 'general'): Promise<any>;
    private extractExamples;
    private formatOSSLResponse;
    private getOSSLFallbackResponse;
    private getFallbackResponse;
    private isCacheValid;
    private setCache;
    browseOSSLFunctions(category?: string): Promise<any>;
}
//# sourceMappingURL=lsl-documentation.d.ts.map