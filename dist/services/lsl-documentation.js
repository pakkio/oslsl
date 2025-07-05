"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSLDocumentationService = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const lsl_resources_js_1 = require("../data/lsl-resources.js");
const ossl_functions_js_1 = require("../data/ossl-functions.js");
const lsl_parser_js_1 = require("./lsl-parser.js");
class LSLDocumentationService {
    static BASE_URLS = {
        SECONDLIFE_WIKI: 'https://wiki.secondlife.com/wiki/',
        OPENSIM_WIKI: 'http://opensimulator.org/wiki/',
        LSL_WIKI: 'https://lslwiki.digiworldz.com/',
    };
    cache = new Map();
    cacheExpiry = new Map();
    CACHE_TTL = 1000 * 60 * 60; // 1 hour
    async lookupLSLFunction(functionName) {
        try {
            const cleanName = functionName.replace(/[()]/g, '');
            const url = `${LSLDocumentationService.BASE_URLS.SECONDLIFE_WIKI}${cleanName}`;
            const response = await axios_1.default.get(url, { timeout: 10000 });
            const $ = cheerio.load(response.data);
            const parsedFunction = lsl_parser_js_1.LSLParser.extractLSLFunction($);
            const cleanCode = lsl_parser_js_1.LSLParser.extractCleanLSLCode($);
            const validation = lsl_parser_js_1.LSLParser.validateLSLCode(cleanCode);
            if (validation.confidence < 0.5) {
                throw new Error(`Low confidence LSL code detected (${validation.confidence.toFixed(2)}). Possible contamination: ${validation.errors.join(', ')}`);
            }
            const description = parsedFunction.description || $('.mw-parser-output p').first().text().trim();
            const syntax = parsedFunction.syntax || cleanCode;
            const examples = parsedFunction.examples || this.extractExamples($);
            return {
                content: [
                    {
                        type: 'text',
                        text: `# LSL Function: ${functionName}

## Description
${description}

## Syntax
\`\`\`lsl
${syntax}
\`\`\`

## Code Quality
- **Validation Score**: ${validation.confidence.toFixed(2)}
- **Status**: ${validation.isValid ? 'Valid LSL' : 'Contains errors'}
${validation.warnings.length > 0 ? `- **Warnings**: ${validation.warnings.join(', ')}` : ''}

## Examples
${Array.isArray(examples) ? examples.join('\n\n') : examples}

## Documentation Source
${url}

## Related Resources
- [LSL Portal](https://wiki.secondlife.com/wiki/LSL_Portal)
- [LSL Functions Category](https://wiki.secondlife.com/wiki/Category:LSL_Functions)
`,
                    },
                ],
            };
        }
        catch (error) {
            return this.getFallbackResponse(functionName, 'function', error);
        }
    }
    async lookupLSLEvent(eventName) {
        try {
            const cleanName = eventName.replace(/[()]/g, '');
            const url = `${LSLDocumentationService.BASE_URLS.SECONDLIFE_WIKI}${cleanName}`;
            const response = await axios_1.default.get(url, { timeout: 10000 });
            const $ = cheerio.load(response.data);
            const description = $('.mw-parser-output p').first().text().trim();
            const syntax = $('pre, code').first().text().trim();
            const examples = this.extractExamples($);
            return {
                content: [
                    {
                        type: 'text',
                        text: `# LSL Event: ${eventName}

## Description
${description}

## Syntax
\`\`\`lsl
${syntax}
\`\`\`

## Examples
${examples}

## Documentation Source
${url}

## Related Resources
- [LSL Portal](https://wiki.secondlife.com/wiki/LSL_Portal)
- [LSL Events Category](https://wiki.secondlife.com/wiki/Category:LSL_Events)
`,
                    },
                ],
            };
        }
        catch (error) {
            return this.getFallbackResponse(eventName, 'event', error);
        }
    }
    async lookupOSSLFunction(functionName) {
        const cleanName = functionName.replace(/[()]/g, '');
        const cacheKey = `ossl-${cleanName}`;
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const offlineFunction = ossl_functions_js_1.OSSLFunctions.getFunctionByName(cleanName);
        if (offlineFunction) {
            const response = this.formatOSSLResponse(offlineFunction);
            this.setCache(cacheKey, response);
            return response;
        }
        try {
            const searchUrl = `${LSLDocumentationService.BASE_URLS.OPENSIM_WIKI}index.php?title=Special:Search&search=${encodeURIComponent(cleanName)}`;
            let response = await axios_1.default.get(searchUrl, { timeout: 7000 });
            let $ = cheerio.load(response.data);
            const firstResultLink = $('.mw-search-result-heading a').first().attr('href');
            if (!firstResultLink) {
                throw new Error('Function not found on the wiki.');
            }
            const functionUrl = `${LSLDocumentationService.BASE_URLS.OPENSIM_WIKI}${firstResultLink}`;
            response = await axios_1.default.get(functionUrl, { timeout: 7000 });
            $ = cheerio.load(response.data);
            const description = $('.mw-parser-output p').first().text().trim();
            const syntax = $('pre.lsl').first().text().trim();
            const result = {
                content: [
                    {
                        type: 'text',
                        text: `# OSSL Function: ${functionName}\n\n## Description\n${description}\n\n## Syntax\n\`\`\`lsl\n${syntax}\n\`\`\`\n\n## Documentation Source\n${functionUrl}\n\n## Status\nFetched online, as it was not in the local database.`,
                    },
                ],
            };
            this.setCache(cacheKey, result);
            return result;
        }
        catch (error) {
            return this.getOSSLFallbackResponse(functionName, error);
        }
    }
    async searchExamples(topic, platform = 'both') {
        const repositories = lsl_resources_js_1.LSLResources.getGitHubRepositories();
        const filteredRepos = repositories.filter(repo => {
            if (platform === 'both')
                return true;
            return repo.platform.includes(platform);
        });
        const searchResults = filteredRepos.map(repo => ({
            name: repo.name,
            url: repo.url,
            description: repo.description,
            searchUrl: `${repo.url}/search?q=${encodeURIComponent(topic)}`,
        }));
        return {
            content: [
                {
                    type: 'text',
                    text: `# LSL Examples for "${topic}"

## GitHub Repositories to Search

${searchResults.map(repo => `### ${repo.name}
- **URL**: ${repo.url}
- **Description**: ${repo.description}
- **Search**: [Search for "${topic}" in this repository](${repo.searchUrl})
`).join('\n')}

## Additional Resources
- [LSL Script Library](https://outworldz.com/cgi/freescripts.plx)
- [LSL Library Category](https://wiki.secondlife.com/wiki/Category:LSL_Library)
- [OSSL Script Library](http://opensimulator.org/wiki/OSSL_Script_Library)

## Search Tips
1. Use specific terms related to your functionality
2. Check multiple repositories as they may have different implementations
3. Look for commented examples that explain the code
4. Consider both Second Life and OpenSimulator versions
`,
                },
            ],
        };
    }
    async getBestPractices(category = 'general') {
        const practices = lsl_resources_js_1.LSLResources.getBestPractices(category);
        return {
            content: [
                {
                    type: 'text',
                    text: `# LSL Best Practices - ${category.charAt(0).toUpperCase() + category.slice(1)}

${practices.map((practice) => `## ${practice.title}
${practice.description}

${practice.examples ? `### Examples
\`\`\`lsl
${practice.examples}
\`\`\`
` : ''}
`).join('\n')}

## Additional Resources
- [LSL Style Guide](https://wiki.secondlife.com/wiki/LSL_Style_Guide)
- [LSL Optimization](https://wiki.secondlife.com/wiki/LSL_Optimization)
- [OpenSimulator Scripting](http://opensimulator.org/wiki/Scripting_Documentation)
`,
                },
            ],
        };
    }
    extractExamples($) {
        const examples = $('pre').map((i, el) => $(el).text()).get();
        return examples.length > 0 ? examples.join('\n\n') : 'No examples found in documentation.';
    }
    formatOSSLResponse(func) {
        const permissionLevels = ossl_functions_js_1.OSSLFunctions.getPermissionLevels();
        const permissionInfo = permissionLevels[func.permissions] || {};
        return {
            content: [
                {
                    type: 'text',
                    text: `# OSSL Function: ${func.name}

## Description
${func.description}

## Syntax
\`\`\`lsl
${func.syntax}
\`\`\`

## Parameters
${func.parameters.map((param) => `- **${param.name}** (${param.type}): ${param.description}`).join('\n')}

## Return Type
${func.returnType}

## Category
${func.category}

## Example
\`\`\`lsl
${func.example}
\`\`\`

## Availability
${func.availability}

## Permission Level
**${permissionInfo.level || func.permissions}** - ${permissionInfo.description || 'Permission level required'}

## Official Documentation
${func.url}

## Related Resources
- [OSSL Documentation](http://opensimulator.org/wiki/OSSL)
- [OSSL Functions Category](http://opensimulator.org/wiki/Category:OSSL_Functions)
- [OpenSimulator Scripting](http://opensimulator.org/wiki/Scripting_Documentation)
`,
                },
            ],
        };
    }
    getOSSLFallbackResponse(name, error) {
        const allFunctions = ossl_functions_js_1.OSSLFunctions.getAllFunctions();
        const similarFunctions = allFunctions
            .filter(func => func.name.toLowerCase().includes(name.toLowerCase()))
            .slice(0, 5);
        return {
            content: [
                {
                    type: 'text',
                    text: `# OSSL Function: ${name}

## Error
Could not retrieve documentation: ${error.message}

${similarFunctions.length > 0 ? `## Similar Functions Found
${similarFunctions.map(func => `- **${func.name}** - ${func.description}`).join('\n')}\n\n` : ''}## Alternative Resources
- [OSSL Documentation](http://opensimulator.org/wiki/OSSL)
- [OSSL Functions Category](http://opensimulator.org/wiki/Category:OSSL_Functions)
- [OpenSimulator Scripting](http://opensimulator.org/wiki/Scripting_Documentation)

## Search Suggestions
Try searching for "${name}" in:
- OpenSimulator Wiki: http://opensimulator.org/wiki/Special:Search?search=${encodeURIComponent(name)}
- GitHub repositories with OSSL examples
`,
                },
            ],
        };
    }
    getFallbackResponse(name, type, error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `# ${type}: ${name}

## Error
Could not retrieve documentation from wiki: ${error.message}

## Alternative Resources
- [LSL Portal](https://wiki.secondlife.com/wiki/LSL_Portal)
- [LSL Functions](https://wiki.secondlife.com/wiki/Category:LSL_Functions)
- [OSSL Documentation](http://opensimulator.org/wiki/OSSL)
- [Alternative LSL Wiki](https://lslwiki.digiworldz.com/)

## Search Suggestions
Try searching for "${name}" in:
- Second Life Wiki: https://wiki.secondlife.com/wiki/Special:Search?search=${encodeURIComponent(name)}
- OpenSimulator Wiki: http://opensimulator.org/wiki/Special:Search?search=${encodeURIComponent(name)}
- GitHub repositories with LSL examples
`,
                },
            ],
        };
    }
    isCacheValid(key) {
        const expiry = this.cacheExpiry.get(key);
        if (!expiry)
            return false;
        return Date.now() < expiry;
    }
    setCache(key, value) {
        this.cache.set(key, value);
        this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
    }
    async browseOSSLFunctions(category = 'all') {
        const functions = category === 'all'
            ? ossl_functions_js_1.OSSLFunctions.getAllFunctions()
            : ossl_functions_js_1.OSSLFunctions.getFunctionsByCategory(category);
        const categories = ossl_functions_js_1.OSSLFunctions.getCategories();
        const permissionLevels = ossl_functions_js_1.OSSLFunctions.getPermissionLevels();
        if (category === 'all') {
            const functionsByCategory = categories.map(cat => ({
                category: cat,
                functions: ossl_functions_js_1.OSSLFunctions.getFunctionsByCategory(cat)
            }));
            return {
                content: [
                    {
                        type: 'text',
                        text: `# OSSL Functions Overview

## Available Categories
${categories.map(cat => `- **${cat}** (${ossl_functions_js_1.OSSLFunctions.getFunctionsByCategory(cat).length} functions)`).join('\n')}

## Functions by Category

${functionsByCategory.map(catGroup => `### ${catGroup.category} Functions
${catGroup.functions.map(func => `- **${func.name}** - ${func.description}`).join('\n')}
`).join('\n')}

## Permission Levels
${Object.entries(permissionLevels).map(([key, level]) => `- **${level.level}** (${key}): ${level.description}`).join('\n')}

## Usage
To get detailed information about a specific function, use the \`ossl-function-lookup\` tool.

## Documentation Sources
- [OSSL Functions Category](http://opensimulator.org/wiki/Category:OSSL_Functions)
- [OSSL Documentation](http://opensimulator.org/wiki/OSSL)
- [OpenSimulator Scripting](http://opensimulator.org/wiki/Scripting_Documentation)
`,
                    },
                ],
            };
        }
        else {
            return {
                content: [
                    {
                        type: 'text',
                        text: `# OSSL ${category} Functions

## Available Functions (${functions.length})

${functions.map(func => `### ${func.name}
**Description:** ${func.description}
**Syntax:** \`${func.syntax}\`
**Permission:** ${func.permissions}
**Availability:** ${func.availability}

`).join('')}

## Permission Levels for ${category}
${[...new Set(functions.map(f => f.permissions))].map(perm => {
                            const level = permissionLevels[perm];
                            return level ? `- **${level.level}** (${perm}): ${level.description}` : `- **${perm}**: Custom permission level`;
                        }).join('\n')}

## Usage
To get detailed information about a specific function, use the \`ossl-function-lookup\` tool with the function name.

## Documentation Sources
- [OSSL Functions Category](http://opensimulator.org/wiki/Category:OSSL_Functions)
- [OSSL Documentation](http://opensimulator.org/wiki/OSSL)
`,
                    },
                ],
            };
        }
    }
}
exports.LSLDocumentationService = LSLDocumentationService;
//# sourceMappingURL=lsl-documentation.js.map