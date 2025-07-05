export declare class LSLResources {
    static getGitHubRepositories(): ({
        name: string;
        url: string;
        description: string;
        platform: string[];
        stars: string;
        license: string;
        features?: undefined;
    } | {
        name: string;
        url: string;
        description: string;
        platform: string[];
        features: string[];
        license: string;
        stars?: undefined;
    } | {
        name: string;
        url: string;
        description: string;
        platform: string[];
        license: string;
        stars?: undefined;
        features?: undefined;
    })[];
    static getCommonLSLFunctions(): {
        name: string;
        description: string;
        syntax: string;
        category: string;
        url: string;
    }[];
    static getCommonLSLEvents(): {
        name: string;
        description: string;
        syntax: string;
        category: string;
        url: string;
    }[];
    static getCommonLSLConstants(): {
        name: string;
        value: string;
        description: string;
        category: string;
    }[];
    static getCommonOSSLFunctions(): {
        name: string;
        description: string;
        syntax: string;
        category: string;
        url: string;
    }[];
    static getBestPractices(category: string): any;
}
//# sourceMappingURL=lsl-resources.d.ts.map