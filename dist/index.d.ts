#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export declare class LSLMCPServer {
    server: Server;
    private docService;
    private resourceService;
    private analysisService;
    constructor();
    private setupHandlers;
    run(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map