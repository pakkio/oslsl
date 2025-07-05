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
class LSLDocumentationService {
    static BASE_URLS = {
        SECONDLIFE_WIKI: 'https://wiki.secondlife.com/wiki/',
        OPENSIM_WIKI: 'http://opensimulator.org/wiki/',
        LSL_WIKI: 'https://lslwiki.digiworldz.com/',
    };
    async lookupLSLFunction(functionName) {
        try {
            const cleanName = functionName.replace(/[()]/g, '');
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
                        text: `# LSL Function: ${functionName}

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
        try {
            const cleanName = functionName.replace(/[()]/g, '');
            const url = `${LSLDocumentationService.BASE_URLS.OPENSIM_WIKI}${cleanName}`;
            const response = await axios_1.default.get(url, { timeout: 10000 });
            const $ = cheerio.load(response.data);
            const description = $('.mw-parser-output p').first().text().trim();
            const syntax = $('pre, code').first().text().trim();
            const examples = this.extractExamples($);
            return {
                content: [
                    {
                        type: 'text',
                        text: `# OSSL Function: ${functionName}

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
- [OSSL Documentation](http://opensimulator.org/wiki/OSSL)
- [OpenSimulator Scripting](http://opensimulator.org/wiki/Scripting_Documentation)
`,
                    },
                ],
            };
        }
        catch (error) {
            return this.getFallbackResponse(functionName, 'OSSL function', error);
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
}
exports.LSLDocumentationService = LSLDocumentationService;
//# sourceMappingURL=lsl-documentation.js.map