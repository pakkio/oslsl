import { CheerioAPI } from 'cheerio';
export interface LSLToken {
    type: 'keyword' | 'function' | 'variable' | 'string' | 'number' | 'operator' | 'comment' | 'whitespace';
    value: string;
    position: number;
}
export interface LSLFunction {
    name: string;
    returnType: string;
    parameters: Array<{
        name: string;
        type: string;
        description?: string;
    }>;
    description: string;
    syntax: string;
    examples: string[];
    category: string;
}
export interface LSLValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    confidence: number;
}
export declare class LSLParser {
    private static readonly LSL_KEYWORDS;
    private static readonly LSL_FUNCTIONS;
    private static readonly LSL_EVENTS;
    static tokenize(code: string): LSLToken[];
    static validateLSLCode(code: string): LSLValidationResult;
    static extractCleanLSLCode($: CheerioAPI): string;
    static extractLSLFunction($: CheerioAPI): Partial<LSLFunction>;
    static calculateSimilarity(code1: string, code2: string): number;
}
//# sourceMappingURL=lsl-parser.d.ts.map