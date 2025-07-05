#!/usr/bin/env node
declare class CoverageReport {
    static generateReport(): {
        totalFunctions: number;
        coverage: number;
        rating: number;
        categoryStats: {
            category: string;
            count: number;
            functions: string[];
        }[];
    };
}
export { CoverageReport };
//# sourceMappingURL=coverage-report.d.ts.map