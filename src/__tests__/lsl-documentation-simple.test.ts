import { OSSLFunctions } from '../data/ossl-functions';

describe('LSLDocumentationService Simple Tests', () => {
  describe('OSSL Functions Integration', () => {
    it('should have osIsNpc in database', () => {
      const func = OSSLFunctions.getFunctionByName('osIsNpc');
      expect(func).toBeDefined();
      expect(func?.name).toBe('osIsNpc');
      expect(func?.category).toBe('NPC');
    });

    it('should have osNpcSay in database', () => {
      const func = OSSLFunctions.getFunctionByName('osNpcSay');
      expect(func).toBeDefined();
      expect(func?.name).toBe('osNpcSay');
      expect(func?.category).toBe('NPC');
    });

    it('should have osTeleportAgent in database', () => {
      const func = OSSLFunctions.getFunctionByName('osTeleportAgent');
      expect(func).toBeDefined();
      expect(func?.name).toBe('osTeleportAgent');
      expect(func?.category).toBe('Agent');
    });

    it('should browse NPC functions', () => {
      const npcFunctions = OSSLFunctions.getFunctionsByCategory('NPC');
      expect(npcFunctions.length).toBeGreaterThan(0);
      
      const functionNames = npcFunctions.map(f => f.name);
      expect(functionNames).toContain('osIsNpc');
      expect(functionNames).toContain('osNpcSay');
      expect(functionNames).toContain('osNpcCreate');
      expect(functionNames).toContain('osNpcRemove');
    });

    it('should have proper permission levels', () => {
      const permissions = OSSLFunctions.getPermissionLevels();
      expect(permissions['OSSL_Public']).toBeDefined();
      expect(permissions['OSSL_NPC']).toBeDefined();
      expect(permissions['OSSL_High']).toBeDefined();
      
      expect(permissions['OSSL_Public'].level).toBe('Public');
      expect(permissions['OSSL_NPC'].level).toBe('NPC');
    });

    it('should validate all functions have required structure', () => {
      const functions = OSSLFunctions.getAllFunctions();
      expect(functions.length).toBeGreaterThan(20);
      
      functions.forEach(func => {
        expect(func.name).toBeDefined();
        expect(func.description).toBeDefined();
        expect(func.syntax).toBeDefined();
        expect(func.category).toBeDefined();
        expect(func.permissions).toBeDefined();
        expect(func.url).toContain('opensimulator.org');
      });
    });

    it('should categorize functions correctly', () => {
      const categories = OSSLFunctions.getCategories();
      expect(categories).toContain('NPC');
      expect(categories).toContain('Agent');
      expect(categories).toContain('Region');
      expect(categories).toContain('Graphics');
      
      // Check that each category has functions
      categories.forEach(category => {
        const funcsInCategory = OSSLFunctions.getFunctionsByCategory(category);
        expect(funcsInCategory.length).toBeGreaterThan(0);
      });
    });
  });
});