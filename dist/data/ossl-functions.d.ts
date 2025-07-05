export declare class OSSLFunctions {
    static getAllFunctions(): {
        name: string;
        description: string;
        syntax: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        returnType: string;
        category: string;
        example: string;
        availability: string;
        permissions: string;
        url: string;
    }[];
    static getPermissionLevels(): {
        OSSL_Public: {
            level: string;
            description: string;
            threat: string;
        };
        OSSL_Moderate: {
            level: string;
            description: string;
            threat: string;
        };
        OSSL_High: {
            level: string;
            description: string;
            threat: string;
        };
        OSSL_Severe: {
            level: string;
            description: string;
            threat: string;
        };
        OSSL_NPC: {
            level: string;
            description: string;
            threat: string;
        };
    };
    static getCategories(): string[];
    static getFunctionByName(name: string): {
        name: string;
        description: string;
        syntax: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        returnType: string;
        category: string;
        example: string;
        availability: string;
        permissions: string;
        url: string;
    } | undefined;
    static getFunctionsByCategory(category: string): {
        name: string;
        description: string;
        syntax: string;
        parameters: {
            name: string;
            type: string;
            description: string;
        }[];
        returnType: string;
        category: string;
        example: string;
        availability: string;
        permissions: string;
        url: string;
    }[];
}
//# sourceMappingURL=ossl-functions.d.ts.map