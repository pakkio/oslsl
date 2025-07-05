import { LSLDocumentationService } from '../services/lsl-documentation';
import { OSSLFunctions } from '../data/ossl-functions';

// Mock axios to avoid actual HTTP calls during tests
jest.mock('axios');

describe('LSLDocumentationService', () => {
  let service: LSLDocumentationService;

  beforeEach(() => {
    service = new LSLDocumentationService();
  });

  describe('lookupOSSLFunction', () => {
    it('should return offline data for osIsNpc', async () => {
      const result = await service.lookupOSSLFunction('osIsNpc');
      
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('osIsNpc');
      expect(result.content[0].text).toContain('NPC');
      expect(result.content[0].text).toContain('Description');
      expect(result.content[0].text).toContain('Syntax');
      expect(result.content[0].text).toContain('Parameters');
      expect(result.content[0].text).toContain('Example');
    });

    it('should return offline data for osNpcSay', async () => {
      const result = await service.lookupOSSLFunction('osNpcSay');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('osNpcSay');
      expect(result.content[0].text).toContain('NPC');
      expect(result.content[0].text).toContain('message');
    });

    it('should return offline data for osTeleportAgent', async () => {
      const result = await service.lookupOSSLFunction('osTeleportAgent');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('osTeleportAgent');
      expect(result.content[0].text).toContain('Teleport');
      expect(result.content[0].text).toContain('agent');
    });

    it('should handle non-existent OSSL function gracefully', async () => {
      const result = await service.lookupOSSLFunction('osNonExistentFunction');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('osNonExistentFunction');
      expect(result.content[0].text).toContain('Error');
    });

    it('should handle function names with parentheses', async () => {
      const result = await service.lookupOSSLFunction('osIsNpc()');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('osIsNpc');
    });
  });

  describe('browseOSSLFunctions', () => {
    it('should return all functions when category is "all"', async () => {
      const result = await service.browseOSSLFunctions('all');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('OSSL Functions Overview');
      expect(result.content[0].text).toContain('Available Categories');
      expect(result.content[0].text).toContain('NPC');
      expect(result.content[0].text).toContain('Agent');
      expect(result.content[0].text).toContain('Permission Levels');
    });

    it('should return NPC functions when category is "NPC"', async () => {
      const result = await service.browseOSSLFunctions('NPC');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('OSSL NPC Functions');
      expect(result.content[0].text).toContain('osIsNpc');
      expect(result.content[0].text).toContain('osNpcSay');
      expect(result.content[0].text).toContain('osNpcCreate');
    });

    it('should return Agent functions when category is "Agent"', async () => {
      const result = await service.browseOSSLFunctions('Agent');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('OSSL Agent Functions');
      expect(result.content[0].text).toContain('osTeleportAgent');
    });

    it('should handle invalid category gracefully', async () => {
      const result = await service.browseOSSLFunctions('InvalidCategory');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('OSSL InvalidCategory Functions');
      expect(result.content[0].text).toContain('Available Functions (0)');
    });
  });

  describe('getBestPractices', () => {
    it('should return performance best practices', async () => {
      const result = await service.getBestPractices('performance');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('Performance');
      expect(result.content[0].text).toContain('Timer');
      expect(result.content[0].text).toContain('Sensor');
    });

    it('should return security best practices', async () => {
      const result = await service.getBestPractices('security');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('Security');
      expect(result.content[0].text).toContain('Validate');
      expect(result.content[0].text).toContain('Owner');
    });

    it('should return general best practices by default', async () => {
      const result = await service.getBestPractices();
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('General');
    });
  });

  describe('searchExamples', () => {
    it('should return example search results', async () => {
      const result = await service.searchExamples('npc');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('LSL Examples for "npc"');
      expect(result.content[0].text).toContain('GitHub Repositories');
      expect(result.content[0].text).toContain('Outworldz');
    });

    it('should filter by platform', async () => {
      const result = await service.searchExamples('timer', 'opensim');
      
      expect(result).toBeDefined();
      expect(result.content[0].text).toContain('timer');
    });
  });

  describe('caching functionality', () => {
    it('should cache OSSL function results', async () => {
      // First call
      const result1 = await service.lookupOSSLFunction('osIsNpc');
      // Second call (should be cached)
      const result2 = await service.lookupOSSLFunction('osIsNpc');
      
      expect(result1).toEqual(result2);
    });
  });
});