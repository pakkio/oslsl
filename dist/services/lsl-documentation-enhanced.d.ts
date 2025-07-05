export declare class LSLDocumentationEnhanced {
    private static readonly STRUCTURED_SOURCES;
    private functionCache;
    private eventCache;
    private constantCache;
    private cacheExpiry;
    private readonly CACHE_TTL;
    lookupLSLFunctionEnhanced(functionName: string): Promise<any>;
    private getFromStructuredSources;
    private getFromWikiWithValidation;
    private parseStructuredFunction;
    private parseParameters;
    private extractReturnType;
    private extractParameters;
    private extractDescription;
    private extractValidatedExamples;
    private extractCategory;
    private checkIfDeprecated;
    private extractAlternatives;
    private formatFunctionResponse;
    private getNotFoundResponse;
    private getErrorResponse;
    private isCacheValid;
    private setCache;
}
//# sourceMappingURL=lsl-documentation-enhanced.d.ts.map