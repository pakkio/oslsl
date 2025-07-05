import axios from 'axios';
import * as cheerio from 'cheerio';
import { LSLResources } from '../data/lsl-resources';

export class LSLDocumentationService {
  private static readonly BASE_URLS = {
    SECONDLIFE_WIKI: 'https://wiki.secondlife.com/wiki/',
    OPENSIM_WIKI: 'http://opensimulator.org/wiki/',
    LSL_WIKI: 'https://lslwiki.digiworldz.com/',
  };

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
    try {
      const cleanName = functionName.replace(/[()]/g, '');
      const url = `${LSLDocumentationService.BASE_URLS.OPENSIM_WIKI}${cleanName}`;
      
      const response = await axios.get(url, { timeout: 10000 });
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
    } catch (error) {
      return this.getFallbackResponse(functionName, 'OSSL function', error);
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
}