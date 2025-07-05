export interface LSLEmbedding {
    functionName: string;
    vector: number[];
    metadata: {
        category: string;
        complexity: number;
        parameters: string[];
        returnType: string;
    };
}
export interface SimilarityResult {
    functionName: string;
    similarity: number;
    reason: string;
}
export declare class LSLEmbeddingsService {
    private static readonly VECTOR_DIMENSIONS;
    private functionEmbeddings;
    private patternEmbeddings;
    constructor();
    private initializeBasicEmbeddings;
    private createFunctionEmbedding;
    private initializePatternEmbeddings;
    private createPatternVector;
    private hashString;
    private inferReturnType;
    findSimilarFunctions(functionName: string, maxResults?: number): SimilarityResult[];
    findSimilarByName(functionName: string, maxResults?: number): SimilarityResult[];
    findFunctionsByPattern(pattern: string): SimilarityResult[];
    private cosineSimilarity;
    private calculateNameSimilarity;
    private explainSimilarity;
    addCustomFunction(name: string, category: string, complexity: number, params: string[]): void;
    analyzeCodePatterns(code: string): {
        pattern: string;
        confidence: number;
    }[];
}
//# sourceMappingURL=lsl-embeddings.d.ts.map