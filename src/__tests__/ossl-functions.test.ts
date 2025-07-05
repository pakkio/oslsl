import { OSSLFunctions } from '../data/ossl-functions';

describe('OSSLFunctions', () => {
  describe('getAllFunctions', () => {
    it('should return an array of OSSL functions', () => {
      const functions = OSSLFunctions.getAllFunctions();
      expect(Array.isArray(functions)).toBe(true);
      expect(functions.length).toBeGreaterThan(0);
    });

    it('should include osIsNpc function', () => {
      const functions = OSSLFunctions.getAllFunctions();
      const osIsNpc = functions.find(f => f.name === 'osIsNpc');
      expect(osIsNpc).toBeDefined();
      expect(osIsNpc?.description).toContain('NPC');
      expect(osIsNpc?.syntax).toBe('integer osIsNpc(key npc)');
      expect(osIsNpc?.category).toBe('NPC');
    });

    it('should include osNpcSay function', () => {
      const functions = OSSLFunctions.getAllFunctions();
      const osNpcSay = functions.find(f => f.name === 'osNpcSay');
      expect(osNpcSay).toBeDefined();
      expect(osNpcSay?.description).toContain('NPC');
      expect(osNpcSay?.category).toBe('NPC');
    });

    it('should include osTeleportAgent function', () => {
      const functions = OSSLFunctions.getAllFunctions();
      const osTeleportAgent = functions.find(f => f.name === 'osTeleportAgent');
      expect(osTeleportAgent).toBeDefined();
      expect(osTeleportAgent?.description).toContain('Teleport');
      expect(osTeleportAgent?.category).toBe('Agent');
    });
  });

  describe('getFunctionByName', () => {
    it('should return function by exact name', () => {
      const func = OSSLFunctions.getFunctionByName('osIsNpc');
      expect(func).toBeDefined();
      expect(func?.name).toBe('osIsNpc');
    });

    it('should return undefined for non-existent function', () => {
      const func = OSSLFunctions.getFunctionByName('nonExistentFunction');
      expect(func).toBeUndefined();
    });
  });

  describe('getFunctionsByCategory', () => {
    it('should return NPC functions', () => {
      const npcFunctions = OSSLFunctions.getFunctionsByCategory('NPC');
      expect(Array.isArray(npcFunctions)).toBe(true);
      expect(npcFunctions.length).toBeGreaterThan(0);
      expect(npcFunctions.every(f => f.category === 'NPC')).toBe(true);
    });

    it('should return Agent functions', () => {
      const agentFunctions = OSSLFunctions.getFunctionsByCategory('Agent');
      expect(Array.isArray(agentFunctions)).toBe(true);
      expect(agentFunctions.length).toBeGreaterThan(0);
      expect(agentFunctions.every(f => f.category === 'Agent')).toBe(true);
    });

    it('should return empty array for invalid category', () => {
      const functions = OSSLFunctions.getFunctionsByCategory('InvalidCategory');
      expect(Array.isArray(functions)).toBe(true);
      expect(functions.length).toBe(0);
    });
  });

  describe('getCategories', () => {
    it('should return array of categories', () => {
      const categories = OSSLFunctions.getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('NPC');
      expect(categories).toContain('Agent');
      expect(categories).toContain('Region');
    });
  });

  describe('getPermissionLevels', () => {
    it('should return permission levels object', () => {
      const permissions = OSSLFunctions.getPermissionLevels();
      expect(typeof permissions).toBe('object');
      expect(permissions['OSSL_Public']).toBeDefined();
      expect(permissions['OSSL_High']).toBeDefined();
      expect(permissions['OSSL_NPC']).toBeDefined();
    });

    it('should have proper permission structure', () => {
      const permissions = OSSLFunctions.getPermissionLevels();
      const publicPerm = permissions['OSSL_Public'];
      expect(publicPerm.level).toBe('Public');
      expect(publicPerm.description).toBeDefined();
      expect(publicPerm.threat).toBeDefined();
    });
  });

  describe('function data integrity', () => {
    it('should have all required fields for each function', () => {
      const functions = OSSLFunctions.getAllFunctions();
      functions.forEach(func => {
        expect(func.name).toBeDefined();
        expect(func.description).toBeDefined();
        expect(func.syntax).toBeDefined();
        expect(func.parameters).toBeDefined();
        expect(Array.isArray(func.parameters)).toBe(true);
        expect(func.returnType).toBeDefined();
        expect(func.category).toBeDefined();
        expect(func.example).toBeDefined();
        expect(func.availability).toBeDefined();
        expect(func.permissions).toBeDefined();
        expect(func.url).toBeDefined();
      });
    });

    it('should have valid parameter structure', () => {
      const functions = OSSLFunctions.getAllFunctions();
      functions.forEach(func => {
        func.parameters.forEach((param: any) => {
          expect(param.name).toBeDefined();
          expect(param.type).toBeDefined();
          expect(param.description).toBeDefined();
        });
      });
    });

    it('should have valid URLs', () => {
      const functions = OSSLFunctions.getAllFunctions();
      functions.forEach(func => {
        expect(func.url).toMatch(/^https?:\/\//);
        expect(func.url).toContain('opensimulator.org');
      });
    });
  });
});