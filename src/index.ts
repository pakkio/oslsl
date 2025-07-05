#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ResourceTemplate,
  Tool,
  Resource,
  TextContent,
  ImageContent,
  EmbeddedResource,
} from '@modelcontextprotocol/sdk/types.js';
import { LSLDocumentationService } from './services/lsl-documentation';
import { LSLResourceService } from './services/lsl-resource';

class LSLMCPServer {
  private server: Server;
  private docService: LSLDocumentationService;
  private resourceService: LSLResourceService;

  constructor() {
    this.server = new Server(
      {
        name: 'lsl-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.docService = new LSLDocumentationService();
    this.resourceService = new LSLResourceService();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
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
        ],
      };
    });

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
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

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      if (uri.startsWith('lsl://documentation/')) {
        const type = uri.split('/').pop();
        const content = await this.resourceService.getDocumentationResource(type as string);
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
        const content = await this.resourceService.getOSSLDocumentationResource(type as string);
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

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'lsl-function-lookup':
            return await this.docService.lookupLSLFunction(args?.function_name as string);

          case 'lsl-event-lookup':
            return await this.docService.lookupLSLEvent(args?.event_name as string);

          case 'ossl-function-lookup':
            return await this.docService.lookupOSSLFunction(args?.function_name as string);

          case 'lsl-search-examples':
            return await this.docService.searchExamples(
              args?.topic as string,
              args?.platform as 'secondlife' | 'opensim' | 'both'
            );

          case 'lsl-best-practices':
            return await this.docService.getBestPractices(
              args?.category as 'performance' | 'security' | 'memory' | 'general'
            );

          case 'ossl-browse-functions':
            return await this.docService.browseOSSLFunctions(
              args?.category as string
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
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

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('LSL MCP Server running on stdio');
  }
}

const server = new LSLMCPServer();
server.run().catch(console.error);