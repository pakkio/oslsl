"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSLResourceService = void 0;
const lsl_resources_js_1 = require("../data/lsl-resources.js");
class LSLResourceService {
    async getDocumentationResource(type) {
        switch (type) {
            case 'functions':
                return {
                    title: 'LSL Functions Reference',
                    description: 'Complete reference of all LSL functions',
                    sources: [
                        {
                            name: 'Second Life Wiki - LSL Functions',
                            url: 'https://wiki.secondlife.com/wiki/Category:LSL_Functions',
                            description: 'Official LSL functions documentation',
                        },
                        {
                            name: 'LSL Portal',
                            url: 'https://wiki.secondlife.com/wiki/LSL_Portal',
                            description: 'Main entry point for LSL documentation',
                        },
                    ],
                    commonFunctions: lsl_resources_js_1.LSLResources.getCommonLSLFunctions(),
                };
            case 'events':
                return {
                    title: 'LSL Events Reference',
                    description: 'Complete reference of all LSL events',
                    sources: [
                        {
                            name: 'Second Life Wiki - LSL Events',
                            url: 'https://wiki.secondlife.com/wiki/Category:LSL_Events',
                            description: 'Official LSL events documentation',
                        },
                    ],
                    commonEvents: lsl_resources_js_1.LSLResources.getCommonLSLEvents(),
                };
            case 'constants':
                return {
                    title: 'LSL Constants Reference',
                    description: 'Complete reference of all LSL constants',
                    sources: [
                        {
                            name: 'Second Life Wiki - LSL Constants',
                            url: 'https://wiki.secondlife.com/wiki/Category:LSL_Constants',
                            description: 'Official LSL constants documentation',
                        },
                    ],
                    commonConstants: lsl_resources_js_1.LSLResources.getCommonLSLConstants(),
                };
            default:
                throw new Error(`Unknown documentation type: ${type}`);
        }
    }
    async getOSSLDocumentationResource(type) {
        switch (type) {
            case 'functions':
                return {
                    title: 'OSSL Functions Reference',
                    description: 'Complete reference of all OSSL functions',
                    sources: [
                        {
                            name: 'OpenSimulator Wiki - OSSL',
                            url: 'http://opensimulator.org/wiki/OSSL',
                            description: 'Official OSSL functions documentation',
                        },
                        {
                            name: 'OpenSimulator Scripting Documentation',
                            url: 'http://opensimulator.org/wiki/Scripting_Documentation',
                            description: 'Main scripting documentation for OpenSimulator',
                        },
                    ],
                    commonFunctions: lsl_resources_js_1.LSLResources.getCommonOSSLFunctions(),
                };
            default:
                throw new Error(`Unknown OSSL documentation type: ${type}`);
        }
    }
    async getGitHubRepositories() {
        return {
            title: 'LSL GitHub Repositories',
            description: 'Curated list of LSL script repositories',
            repositories: lsl_resources_js_1.LSLResources.getGitHubRepositories(),
            usage: {
                description: 'These repositories contain examples and libraries for LSL scripting',
                searchTips: [
                    'Use specific keywords related to your functionality',
                    'Check both Second Life and OpenSimulator compatibility',
                    'Look for well-documented examples',
                    'Consider licensing requirements',
                ],
            },
        };
    }
}
exports.LSLResourceService = LSLResourceService;
//# sourceMappingURL=lsl-resource.js.map