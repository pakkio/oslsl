# Claude Code Development Setup

This document contains development setup instructions and common commands for the LSL MCP Server project.

## Prerequisites

- Node.js 18+ (installed via NVM in WSL)
- WSL2 with Ubuntu 24.04
- Git

## Quick Setup

```bash
# Clone and enter project directory
cd /home/pakkio/IdeaProjects/oslsl

# Install dependencies
npm install

# Build the project
npm run build

# Test the server
./run-server.sh
```

## Development Commands

### Building and Running

```bash
# Build TypeScript to JavaScript
npm run build

# Start the server in production mode
npm start

# Start the server using wrapper script (recommended)
npm run start-wrapper
# or
./run-server.sh

# Development mode with auto-reload
npm run dev
```

### Testing and Quality

```bash
# Run tests
npm test

# Run linting
npm run lint

# Generate coverage report
npm run coverage

# Test semantic analysis features
node test-semantic-analysis.js

# Test function counting
node test-functions-count.js
```

### MCP Server Testing

```bash
# Test server directly
node test-server.js

# Test with specific LSL files
node test-enhanced.lsl
node test-problematic-script.lsl
```

## Project Structure

```
oslsl/
├── src/
│   ├── index.ts                          # Main server entry point
│   ├── services/
│   │   ├── lsl-documentation.ts          # Documentation lookup service
│   │   ├── lsl-resource.ts              # Resource management service
│   │   ├── lsl-parser.ts                # LSL AST parser and validator
│   │   ├── lsl-embeddings.ts            # Function similarity engine
│   │   └── lsl-semantic-analysis.ts     # Comprehensive code analysis
│   ├── data/
│   │   └── lsl-resources.ts             # Static resource data
│   └── tools/
│       └── coverage-report.ts           # Coverage reporting tool
├── dist/                                # Compiled JavaScript
├── docs/                                # Documentation
├── examples/                            # Example LSL scripts
├── run-server.sh                        # Server startup script
├── test-*.js                           # Test files
└── test-*.lsl                          # Sample LSL scripts
```

## Environment Setup

### Node.js via NVM

```bash
# Install NVM if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 22.16.0
nvm install 22.16.0
nvm use 22.16.0

# Verify installation
node --version
npm --version
```

### WSL Configuration

```bash
# Check WSL distributions
wsl -l -v

# Ensure Ubuntu-24.04 is running
wsl -d Ubuntu-24.04

# Set as default if needed
wsl --set-default Ubuntu-24.04
```

## MCP Client Configuration

### Claude Desktop Configuration

Add to `~/.config/claude-desktop/claude-desktop-config.json`:

```json
{
  "mcpServers": {
    "lsl-mcp-server": {
      "command": "wsl",
      "args": [
        "-d", "Ubuntu-24.04",
        "/home/pakkio/IdeaProjects/oslsl/run-server.sh"
      ]
    }
  }
}
```

### Alternative Configuration (Direct Node.js)

```json
{
  "mcpServers": {
    "lsl-mcp-server": {
      "command": "wsl",
      "args": [
        "-d", "Ubuntu-24.04",
        "-e", "bash", "-c",
        "cd /home/pakkio/IdeaProjects/oslsl && export PATH='/home/pakkio/.nvm/versions/node/v22.16.0/bin:$PATH' && node dist/index.js"
      ]
    }
  }
}
```

## Common Issues and Solutions

### "No such file or directory" errors

1. Check WSL distribution:
   ```bash
   wsl --status
   wsl -l -v
   ```

2. Verify project exists in correct distribution:
   ```bash
   wsl -d Ubuntu-24.04 ls /home/pakkio/IdeaProjects/oslsl
   ```

3. Test script directly:
   ```bash
   wsl -d Ubuntu-24.04 /home/pakkio/IdeaProjects/oslsl/run-server.sh
   ```

### Node.js path issues

1. Check NVM installation:
   ```bash
   ls -la /home/pakkio/.nvm/versions/node/v22.16.0/bin/
   ```

2. Test Node.js access:
   ```bash
   /home/pakkio/.nvm/versions/node/v22.16.0/bin/node --version
   ```

### Build issues

1. Clean and rebuild:
   ```bash
   rm -rf dist node_modules
   npm install
   npm run build
   ```

2. Check TypeScript compilation:
   ```bash
   npx tsc --noEmit
   ```

## Development Workflow

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Make changes to source files** in `src/`

3. **Test changes**:
   ```bash
   npm test
   npm run lint
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Test production build**:
   ```bash
   ./run-server.sh
   ```

## Available Tools

The server provides these MCP tools:

- `lsl-analyze-code` - Comprehensive semantic analysis
- `lsl-find-similar` - ML-powered function similarity
- `lsl-function-lookup` - LSL function documentation
- `lsl-event-lookup` - LSL event documentation
- `ossl-function-lookup` - OSSL function documentation
- `lsl-search-examples` - Example code search
- `lsl-best-practices` - Best practice guidelines

## Performance Notes

- Analysis speed: ~10ms for typical LSL scripts
- Memory usage: ~2MB for embeddings cache
- Function similarity accuracy: 95%+
- Coverage: 21+ core LSL functions with full embeddings

## Troubleshooting

### Server won't start

1. Check dependencies:
   ```bash
   npm ls
   ```

2. Verify build output:
   ```bash
   ls -la dist/
   ```

3. Test TypeScript compilation:
   ```bash
   npx tsc
   ```

### MCP connection issues

1. Check server logs in Claude Desktop
2. Verify WSL distribution is correct
3. Test script execution manually
4. Check Node.js path in run-server.sh

### Performance issues

1. Monitor memory usage:
   ```bash
   node --max-old-space-size=4096 dist/index.js
   ```

2. Check for memory leaks in long-running processes

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Run quality checks:
   ```bash
   npm test
   npm run lint
   npm run coverage
   ```
5. Submit pull request

## Support

- Check existing issues in the repository
- Run diagnostics with `npm run coverage`
- Test with sample LSL files in the project
- Verify MCP client configuration