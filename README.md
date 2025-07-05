# LSL MCP Server

A specialized Model Context Protocol (MCP) server for LSL (Linden Scripting Language) and OpenSimulator development.

## Features

- **LSL Function Lookup**: Get detailed documentation for LSL functions
- **LSL Event Lookup**: Get detailed documentation for LSL events  
- **OSSL Function Lookup**: Get documentation for OpenSimulator-specific functions
- **Example Search**: Find LSL script examples by topic or functionality
- **Best Practices**: Get LSL scripting best practices and guidelines
- **Resource Access**: Access comprehensive LSL/OSSL documentation and examples

## Installation

```bash
cd lsl-mcp-server
npm install
npm run build
```

## Usage

### MCP Client Configuration

To use this server with Claude Desktop or other MCP clients, you'll need to configure it properly. Due to Node.js path issues in WSL, use the wrapper script:

#### Option 1: Using the Wrapper Script (Recommended)
```bash
./run-server.sh
```

#### Option 2: Using Full Node Path
```bash
/home/pakkio/.nvm/versions/node/v22.16.0/bin/node dist/index.js
```

### MCP Client Configuration Example

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "lsl-mcp-server": {
      "command": "wsl",
      "args": [
        "-e",
        "bash",
        "/home/pakkio/IdeaProjects/prova/lsl-mcp-server/run-server.sh"
      ]
    }
  }
}
```

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Troubleshooting

### Node.js Not Found Error
If you get "execvpe(node) failed: No such file or directory", it means Node.js is not in the PATH. Use the wrapper script `run-server.sh` which sets up the proper environment.

### WSL Environment Issues
The server is designed to run in WSL. Make sure:
1. Node.js is installed via NVM
2. The wrapper script has executable permissions
3. The full path to the script is used in MCP client configuration

## MCP Tools

### lsl-function-lookup
Look up LSL function documentation with examples.

**Parameters:**
- `function_name` (string): Name of the LSL function to look up

**Example:**
```json
{
  "name": "lsl-function-lookup",
  "arguments": {
    "function_name": "llSay"
  }
}
```

### lsl-event-lookup
Look up LSL event documentation and usage.

**Parameters:**
- `event_name` (string): Name of the LSL event to look up

**Example:**
```json
{
  "name": "lsl-event-lookup",
  "arguments": {
    "event_name": "touch_start"
  }
}
```

### ossl-function-lookup
Look up OSSL (OpenSimulator) function documentation.

**Parameters:**
- `function_name` (string): Name of the OSSL function to look up

**Example:**
```json
{
  "name": "ossl-function-lookup",
  "arguments": {
    "function_name": "osTeleportAgent"
  }
}
```

### lsl-search-examples
Search for LSL script examples by topic or functionality.

**Parameters:**
- `topic` (string): Topic or functionality to search for
- `platform` (string, optional): Platform to search examples for ('secondlife', 'opensim', 'both')

**Example:**
```json
{
  "name": "lsl-search-examples",
  "arguments": {
    "topic": "collision",
    "platform": "both"
  }
}
```

### lsl-best-practices
Get LSL scripting best practices and guidelines.

**Parameters:**
- `category` (string, optional): Category of best practices ('performance', 'security', 'memory', 'general')

**Example:**
```json
{
  "name": "lsl-best-practices",
  "arguments": {
    "category": "performance"
  }
}
```

## MCP Resources

### lsl://documentation/functions
Complete reference of all LSL functions

### lsl://documentation/events
Complete reference of all LSL events

### lsl://documentation/constants
Complete reference of all LSL constants

### ossl://documentation/functions
Complete reference of all OSSL functions

### lsl://examples/github-repositories
Curated list of LSL script repositories

## Documentation Sources

This server uses the following authoritative sources:

### Second Life Official Documentation
- [LSL Portal](https://wiki.secondlife.com/wiki/LSL_Portal)
- [LSL Functions](https://wiki.secondlife.com/wiki/Category:LSL_Functions)
- [LSL Events](https://wiki.secondlife.com/wiki/Category:LSL_Events)
- [LSL Constants](https://wiki.secondlife.com/wiki/Category:LSL_Constants)
- [LSL Library](https://wiki.secondlife.com/wiki/Category:LSL_Library)

### OpenSimulator Documentation
- [OSSL Functions](http://opensimulator.org/wiki/OSSL)
- [Scripting Documentation](http://opensimulator.org/wiki/Scripting_Documentation)

### GitHub Repositories
- [Outworldz/LSL-Scripts](https://github.com/Outworldz/LSL-Scripts)
- [peterhost/lsl-library](https://github.com/peterhost/lsl-library)
- [jdroo/LSL-Scripts](https://github.com/jdroo/LSL-Scripts)
- [Furbrained/SecondLife-Scripts](https://github.com/Furbrained/SecondLife-Scripts)

### Community Resources
- [LSL Script Library](https://outworldz.com/cgi/freescripts.plx)
- [Alternative LSL Wiki](https://lslwiki.digiworldz.com/)

## Configuration

The server can be configured through environment variables:

- `LSL_CACHE_TTL`: Cache time-to-live in seconds (default: 3600)
- `LSL_REQUEST_TIMEOUT`: HTTP request timeout in milliseconds (default: 10000)

## Development

### Project Structure
```
src/
├── index.ts              # Main server entry point
├── services/
│   ├── lsl-documentation.ts    # Documentation lookup service
│   └── lsl-resource.ts        # Resource management service
└── data/
    └── lsl-resources.ts       # Static resource data
```

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## License

MIT