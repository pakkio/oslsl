#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Test the MCP server
const serverPath = path.join(__dirname, 'run-server.sh');
const server = spawn('bash', [serverPath]);

let responseData = '';

// Send initialize message
const initMessage = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};

// Send list tools message  
const listToolsMessage = {
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/list',
  params: {}
};

server.stdout.on('data', (data) => {
  responseData += data.toString();
  console.log('Server response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  console.log('Full response:', responseData);
});

// Send messages
setTimeout(() => {
  server.stdin.write(JSON.stringify(initMessage) + '\n');
}, 100);

setTimeout(() => {
  server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
}, 200);

// Close after 3 seconds
setTimeout(() => {
  server.kill();
}, 3000);