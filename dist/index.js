#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSLMCPServer = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const lsl_documentation_1 = require("./services/lsl-documentation");
const lsl_resource_1 = require("./services/lsl-resource");
const lsl_semantic_analysis_1 = require("./services/lsl-semantic-analysis");
const lsl_documentation_enhanced_1 = require("./services/lsl-documentation-enhanced");
class LSLMCPServer {
    server;
    docService;
    resourceService;
    analysisService;
    enhancedDocService;
    constructor() {
        this.server = new index_js_1.Server({
            name: 'lsl-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
                resources: {},
            },
        });
        this.docService = new lsl_documentation_1.LSLDocumentationService();
        this.resourceService = new lsl_resource_1.LSLResourceService();
        this.analysisService = new lsl_semantic_analysis_1.LSLSemanticAnalysisService();
        this.enhancedDocService = new lsl_documentation_enhanced_1.LSLDocumentationEnhanced();
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'lsl-function-lookup',
                        description: 'Look up LSL function documentation with examples',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                function_name: {
                                    type: 'string',
                                    description: 'Name of the LSL function to look up',
                                },
                            },
                            required: ['function_name'],
                        },
                    },
                    {
                        name: 'lsl-event-lookup',
                        description: 'Look up LSL event documentation and usage',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                event_name: {
                                    type: 'string',
                                    description: 'Name of the LSL event to look up',
                                },
                            },
                            required: ['event_name'],
                        },
                    },
                    {
                        name: 'ossl-function-lookup',
                        description: 'Look up OSSL (OpenSimulator) function documentation',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                function_name: {
                                    type: 'string',
                                    description: 'Name of the OSSL function to look up',
                                },
                            },
                            required: ['function_name'],
                        },
                    },
                    {
                        name: 'lsl-search-examples',
                        description: 'Search for LSL script examples by topic or functionality',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                topic: {
                                    type: 'string',
                                    description: 'Topic or functionality to search for (e.g., "collision", "timer", "http")',
                                },
                                platform: {
                                    type: 'string',
                                    enum: ['secondlife', 'opensim', 'both'],
                                    description: 'Platform to search examples for',
                                    default: 'both',
                                },
                            },
                            required: ['topic'],
                        },
                    },
                    {
                        name: 'lsl-best-practices',
                        description: 'Get LSL scripting best practices and guidelines',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                category: {
                                    type: 'string',
                                    enum: ['performance', 'security', 'memory', 'general'],
                                    description: 'Category of best practices to retrieve',
                                    default: 'general',
                                },
                            },
                        },
                    },
                    {
                        name: 'ossl-browse-functions',
                        description: 'Browse OSSL functions by category or list all available functions',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                category: {
                                    type: 'string',
                                    enum: ['NPC', 'Agent', 'Region', 'Console', 'Graphics', 'Parcel', 'Media', 'Wind', 'Inventory', 'HTTP', 'Physics', 'all'],
                                    description: 'Category of OSSL functions to browse',
                                    default: 'all',
                                },
                            },
                        },
                    },
                    {
                        name: 'lsl-analyze-code',
                        description: 'Perform comprehensive semantic analysis of LSL code',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                code: {
                                    type: 'string',
                                    description: 'LSL code to analyze',
                                },
                            },
                            required: ['code'],
                        },
                    },
                    {
                        name: 'lsl-find-similar',
                        description: 'Find similar LSL functions based on functionality',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                function_name: {
                                    type: 'string',
                                    description: 'Function name to find similar functions for',
                                },
                                max_results: {
                                    type: 'integer',
                                    description: 'Maximum number of results to return',
                                    default: 5,
                                },
                            },
                            required: ['function_name'],
                        },
                    },
                    {
                        name: 'lsl-function-lookup-enhanced',
                        description: 'Enhanced LSL function lookup with structured data validation',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                function_name: {
                                    type: 'string',
                                    description: 'Name of the LSL function to look up',
                                },
                            },
                            required: ['function_name'],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'lsl://documentation/functions',
                        name: 'LSL Functions Reference',
                        description: 'Complete reference of all LSL functions',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'lsl://documentation/events',
                        name: 'LSL Events Reference',
                        description: 'Complete reference of all LSL events',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'lsl://documentation/constants',
                        name: 'LSL Constants Reference',
                        description: 'Complete reference of all LSL constants',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'ossl://documentation/functions',
                        name: 'OSSL Functions Reference',
                        description: 'Complete reference of all OSSL functions',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'lsl://examples/github-repositories',
                        name: 'LSL GitHub Repositories',
                        description: 'Curated list of LSL script repositories',
                        mimeType: 'application/json',
                    },
                ],
            };
        });
        this.server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
            const { uri } = request.params;
            if (uri.startsWith('lsl://documentation/')) {
                const type = uri.split('/').pop();
                const content = await this.resourceService.getDocumentationResource(type);
                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(content, null, 2),
                        },
                    ],
                };
            }
            if (uri.startsWith('ossl://documentation/')) {
                const type = uri.split('/').pop();
                const content = await this.resourceService.getOSSLDocumentationResource(type);
                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(content, null, 2),
                        },
                    ],
                };
            }
            if (uri === 'lsl://examples/github-repositories') {
                const repos = await this.resourceService.getGitHubRepositories();
                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(repos, null, 2),
                        },
                    ],
                };
            }
            throw new Error(`Unknown resource: ${uri}`);
        });
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'lsl-function-lookup':
                        return await this.docService.lookupLSLFunction(args?.function_name);
                    case 'lsl-event-lookup':
                        return await this.docService.lookupLSLEvent(args?.event_name);
                    case 'ossl-function-lookup':
                        return await this.docService.lookupOSSLFunction(args?.function_name);
                    case 'lsl-search-examples':
                        return await this.docService.searchExamples(args?.topic, args?.platform);
                    case 'lsl-best-practices':
                        return await this.docService.getBestPractices(args?.category);
                    case 'ossl-browse-functions':
                        return await this.docService.browseOSSLFunctions(args?.category);
                    case 'lsl-analyze-code':
                        const analysis = this.analysisService.analyzeCode(args?.code);
                        const report = this.analysisService.generateAnalysisReport(analysis);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: report,
                                },
                            ],
                        };
                    case 'lsl-find-similar':
                        const similarFunctions = this.analysisService['embeddingsService'].findSimilarFunctions(args?.function_name, args?.max_results || 5);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: `# Similar Functions to ${args?.function_name}

${similarFunctions.map((result, index) => `## ${index + 1}. ${result.functionName}
- **Similarity**: ${result.similarity.toFixed(3)}
- **Reason**: ${result.reason}
`).join('\n')}

## Usage
Use these similar functions when you need alternative approaches or want to explore related functionality.
`,
                                },
                            ],
                        };
                    case 'lsl-function-lookup-enhanced':
                        return await this.enhancedDocService.lookupLSLFunctionEnhanced(args?.function_name);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                };
            }
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('LSL MCP Server running on stdio');
    }
}
exports.LSLMCPServer = LSLMCPServer;
const server = new LSLMCPServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map