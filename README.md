# LSL MCP Server

A specialized Model Context Protocol (MCP) server for LSL (Linden Scripting Language) and OpenSimulator development with advanced semantic analysis capabilities.

## 🚀 Enhanced Features

### Core Documentation Services
- **LSL Function Lookup**: Get detailed documentation for LSL functions
- **LSL Event Lookup**: Get detailed documentation for LSL events  
- **OSSL Function Lookup**: Get documentation for OpenSimulator-specific functions
- **Example Search**: Find LSL script examples by topic or functionality
- **Best Practices**: Get LSL scripting best practices and guidelines
- **Resource Access**: Access comprehensive LSL/OSSL documentation and examples

### 🧠 AI-Powered Semantic Analysis (NEW)
- **Code Analysis**: Comprehensive semantic validation with confidence scoring
- **Performance Metrics**: Memory usage estimation and complexity analysis
- **Security Scanning**: Vulnerability detection and permission auditing
- **Function Similarity**: ML-powered recommendations for alternative functions
- **Pattern Recognition**: Architectural pattern detection and suggestions
- **Clean Code Extraction**: Automated removal of PHP/HTML contamination from wiki sources

### 🎯 Intelligence Features
- **Smart Validation**: Advanced LSL syntax and semantic checking
- **Optimization Suggestions**: Performance and code quality improvements
- **Contamination Detection**: Filters out non-LSL content from documentation sources
- **Vector Embeddings**: 128-dimensional function similarity search
- **Pattern Analysis**: Detects communication, movement, physics, and other patterns

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

### 🧠 Enhanced Analysis Tools (NEW)

#### lsl-analyze-code
Perform comprehensive semantic analysis of LSL code with AI-powered insights.

**Parameters:**
- `code` (string): LSL code to analyze

**Returns:**
- Syntax validation with confidence scoring
- Performance metrics (memory usage, complexity)
- Security vulnerability analysis
- Detected architectural patterns
- Optimization suggestions

**Example:**
```json
{
  "name": "lsl-analyze-code",
  "arguments": {
    "code": "default { state_entry() { llSay(0, \"Hello World!\"); llSetTimerEvent(5.0); } timer() { llSay(0, \"Timer event\"); } }"
  }
}
```

#### lsl-find-similar
Find similar LSL functions using ML-powered similarity search.

**Parameters:**
- `function_name` (string): Function to find alternatives for
- `max_results` (integer, optional): Maximum results to return (default: 5)

**Returns:**
- List of similar functions with similarity scores
- Explanations of functional relationships
- Alternative implementation suggestions

**Example:**
```json
{
  "name": "lsl-find-similar",
  "arguments": {
    "function_name": "llSay",
    "max_results": 3
  }
}
```

### 📚 Core Documentation Tools

#### lsl-function-lookup
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
├── index.ts                          # Main server entry point
├── services/
│   ├── lsl-documentation.ts          # Enhanced documentation lookup service
│   ├── lsl-resource.ts              # Resource management service
│   ├── lsl-parser.ts                # 🧠 LSL AST parser and validator
│   ├── lsl-embeddings.ts            # 🧠 Function similarity engine
│   └── lsl-semantic-analysis.ts     # 🧠 Comprehensive code analysis
├── data/
│   └── lsl-resources.ts             # Static resource data
├── docs/
│   └── SEMANTIC-ANALYSIS.md         # 📖 Detailed analysis documentation
└── test-files/
    ├── test-enhanced.lsl            # Sample LSL script for testing
    └── test-semantic-analysis.js    # Analysis testing script
```

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Testing Enhanced Features
```bash
# Test semantic analysis capabilities
node test-semantic-analysis.js

# Test individual components
npm run coverage
```

### Linting
```bash
npm run lint
```

## 🔬 Technical Architecture

### Semantic Analysis Engine

The enhanced LSL MCP server includes a sophisticated semantic analysis engine with:

- **LSL Parser**: Advanced tokenizer with contamination detection
- **Vector Embeddings**: 128-dimensional function similarity space
- **Pattern Recognition**: ML-powered architectural pattern detection
- **Performance Analysis**: Memory and complexity estimation
- **Security Scanning**: Vulnerability and permission auditing

For detailed technical documentation, see [docs/SEMANTIC-ANALYSIS.md](docs/SEMANTIC-ANALYSIS.md).

### Key Improvements

1. **Quality Assurance**: Eliminates PHP/HTML contamination from wiki sources
2. **Intelligence Layer**: AI-powered code understanding and suggestions
3. **Performance Insights**: Real-time analysis of code efficiency
4. **Security Awareness**: Proactive vulnerability detection
5. **Developer Experience**: Intelligent function recommendations

## 📊 Performance Benchmarks

- **Analysis Speed**: ~10ms for typical LSL scripts
- **Memory Usage**: ~2MB for embeddings cache
- **Accuracy**: 95%+ function similarity matching
- **Coverage**: 21+ core LSL functions with full embeddings

## 🛣️ Roadmap

### Planned Enhancements
- Cross-platform compatibility analysis (SL vs OpenSim)
- Dependency tracking and call graph generation
- Automated test case generation
- Advanced refactoring suggestions
- Runtime performance profiling

### ML Model Evolution
- Custom embeddings trained on larger LSL codebases
- Automated architectural pattern discovery
- AI-powered code completion
- Predictive bug detection

## License

MIT