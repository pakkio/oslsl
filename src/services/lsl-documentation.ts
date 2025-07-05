import axios from 'axios';
import * as cheerio from 'cheerio';
import { LSLResources } from '../data/lsl-resources.js';
import { OSSLFunctions } from '../data/ossl-functions.js';

export class LSLDocumentationService {
  private static readonly BASE_URLS = {
    SECONDLIFE_WIKI: 'https://wiki.secondlife.com/wiki/',
    OPENSIM_WIKI: 'http://opensimulator.org/wiki/',
    LSL_WIKI: 'https://lslwiki.digiworldz.com/',
  };

  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  async lookupLSLFunction(functionName: string): Promise<any> {
    try {
      const cleanName = functionName.replace(/[()]/g, '');
      const url = `${LSLDocumentationService.BASE_URLS.SECONDLIFE_WIKI}${cleanName}`;
      
      const response = await axios.get(url, { timeout: 10000 });
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
    } catch (error) {
      return this.getFallbackResponse(functionName, 'function', error);
    }
  }

  async lookupLSLEvent(eventName: string): Promise<any> {
    try {
      const cleanName = eventName.replace(/[()]/g, '');
      const url = `${LSLDocumentationService.BASE_URLS.SECONDLIFE_WIKI}${cleanName}`;
      
      const response = await axios.get(url, { timeout: 10000 });
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
    } catch (error) {
      return this.getFallbackResponse(eventName, 'event', error);
    }
  }

  async lookupOSSLFunction(functionName: string): Promise<any> {
    const cleanName = functionName.replace(/[()]/g, '');
    const cacheKey = `ossl-${cleanName}`;

    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const offlineFunction = OSSLFunctions.getFunctionByName(cleanName);
    if (offlineFunction) {
      const response = this.formatOSSLResponse(offlineFunction);
      this.setCache(cacheKey, response);
      return response;
    }

    try {
      const searchUrl = `${LSLDocumentationService.BASE_URLS.OPENSIM_WIKI}index.php?title=Special:Search&search=${encodeURIComponent(cleanName)}`;
      let response = await axios.get(searchUrl, { timeout: 7000 });
      let $ = cheerio.load(response.data);

      const firstResultLink = $('.mw-search-result-heading a').first().attr('href');
      if (!firstResultLink) {
        throw new Error('Function not found on the wiki.');
      }

      const functionUrl = `${LSLDocumentationService.BASE_URLS.OPENSIM_WIKI}${firstResultLink}`;
      response = await axios.get(functionUrl, { timeout: 7000 });
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
    } catch (error) {
      return this.getOSSLFallbackResponse(functionName, error);
    }
  }

  async searchExamples(topic: string, platform: 'secondlife' | 'opensim' | 'both' = 'both'): Promise<any> {
    const repositories = LSLResources.getGitHubRepositories();
    const filteredRepos = repositories.filter(repo => {
      if (platform === 'both') return true;
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

  async getBestPractices(category: 'performance' | 'security' | 'memory' | 'general' = 'general'): Promise<any> {
    const practices = LSLResources.getBestPractices(category);
    
    return {
      content: [
        {
          type: 'text',
          text: `# LSL Best Practices - ${category.charAt(0).toUpperCase() + category.slice(1)}

${practices.map((practice: any) => `## ${practice.title}
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

  private extractExamples($: cheerio.CheerioAPI): string {
    const examples = $('pre').map((i, el) => $(el).text()).get();
    return examples.length > 0 ? examples.join('\n\n') : 'No examples found in documentation.';
  }

  private formatOSSLResponse(func: any): any {
    const permissionLevels: any = OSSLFunctions.getPermissionLevels();
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
${func.parameters.map((param: any) => `- **${param.name}** (${param.type}): ${param.description}`).join('\n')}

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

  private getOSSLFallbackResponse(name: string, error: any): any {
    const allFunctions = OSSLFunctions.getAllFunctions();
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

  private getFallbackResponse(name: string, type: string, error: any): any {
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

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry) return false;
    return Date.now() < expiry;
  }

  private setCache(key: string, value: any): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }

  async browseOSSLFunctions(category: string = 'all'): Promise<any> {
    const functions = category === 'all' 
      ? OSSLFunctions.getAllFunctions()
      : OSSLFunctions.getFunctionsByCategory(category);
    
    const categories = OSSLFunctions.getCategories();
    const permissionLevels = OSSLFunctions.getPermissionLevels();
    
    if (category === 'all') {
      const functionsByCategory = categories.map(cat => ({
        category: cat,
        functions: OSSLFunctions.getFunctionsByCategory(cat)
      }));
      
      return {
        content: [
          {
            type: 'text',
            text: `# OSSL Functions Overview

## Available Categories
${categories.map(cat => `- **${cat}** (${OSSLFunctions.getFunctionsByCategory(cat).length} functions)`).join('\n')}

## Functions by Category

${functionsByCategory.map(catGroup => `### ${catGroup.category} Functions
${catGroup.functions.map(func => `- **${func.name}** - ${func.description}`).join('\n')}
`).join('\n')}

## Permission Levels
${Object.entries(permissionLevels).map(([key, level]: [string, any]) => `- **${level.level}** (${key}): ${level.description}`).join('\n')}

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
    } else {
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
  const level = (permissionLevels as any)[perm];
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