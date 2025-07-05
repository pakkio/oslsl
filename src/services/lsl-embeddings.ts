import { LSLParser, LSLToken } from './lsl-parser.js';

export interface LSLEmbedding {
  functionName: string;
  vector: number[];
  metadata: {
    category: string;
    complexity: number;
    parameters: string[];
    returnType: string;
  };
}

export interface SimilarityResult {
  functionName: string;
  similarity: number;
  reason: string;
}

export class LSLEmbeddingsService {
  private static readonly VECTOR_DIMENSIONS = 128;
  private functionEmbeddings: Map<string, LSLEmbedding> = new Map();
  private patternEmbeddings: Map<string, number[]> = new Map();

  constructor() {
    this.initializeBasicEmbeddings();
  }

  private initializeBasicEmbeddings(): void {
    // Initialize embeddings for common LSL functions
    const commonFunctions = [
      { name: 'llSay', category: 'communication', complexity: 1, params: ['integer', 'string'] },
      { name: 'llWhisper', category: 'communication', complexity: 1, params: ['integer', 'string'] },
      { name: 'llShout', category: 'communication', complexity: 1, params: ['integer', 'string'] },
      { name: 'llListen', category: 'communication', complexity: 2, params: ['integer', 'string', 'key', 'string'] },
      { name: 'llSensor', category: 'detection', complexity: 3, params: ['string', 'key', 'integer', 'float', 'float'] },
      { name: 'llSetText', category: 'display', complexity: 2, params: ['string', 'vector', 'float'] },
      { name: 'llGetPos', category: 'movement', complexity: 1, params: [] },
      { name: 'llSetPos', category: 'movement', complexity: 2, params: ['vector'] },
      { name: 'llGetRot', category: 'movement', complexity: 1, params: [] },
      { name: 'llSetRot', category: 'movement', complexity: 2, params: ['rotation'] },
      { name: 'llApplyImpulse', category: 'physics', complexity: 3, params: ['vector', 'integer'] },
      { name: 'llSetVelocity', category: 'physics', complexity: 3, params: ['vector', 'integer'] },
      { name: 'llGetOwner', category: 'avatar', complexity: 1, params: [] },
      { name: 'llRequestPermissions', category: 'permissions', complexity: 3, params: ['key', 'integer'] },
      { name: 'llTakeControls', category: 'controls', complexity: 3, params: ['integer', 'integer', 'integer'] },
      { name: 'llHTTPRequest', category: 'network', complexity: 4, params: ['string', 'list', 'string'] },
      { name: 'llEmail', category: 'network', complexity: 3, params: ['string', 'string', 'string'] },
      { name: 'llSetTimerEvent', category: 'timing', complexity: 2, params: ['float'] },
      { name: 'llSleep', category: 'timing', complexity: 1, params: ['float'] },
      { name: 'llGetInventoryName', category: 'inventory', complexity: 2, params: ['integer', 'integer'] },
      { name: 'llGiveInventory', category: 'inventory', complexity: 3, params: ['key', 'string'] }
    ];

    for (const func of commonFunctions) {
      const embedding = this.createFunctionEmbedding(func);
      this.functionEmbeddings.set(func.name, embedding);
    }

    // Initialize pattern embeddings
    this.initializePatternEmbeddings();
  }

  private createFunctionEmbedding(func: any): LSLEmbedding {
    const vector = new Array(LSLEmbeddingsService.VECTOR_DIMENSIONS).fill(0);
    
    // Encode category
    const categoryHash = this.hashString(func.category);
    for (let i = 0; i < 20; i++) {
      vector[i] = ((categoryHash >> i) & 1) ? 1 : -1;
    }

    // Encode complexity
    const complexityRange = Math.min(func.complexity / 5, 1);
    for (let i = 20; i < 30; i++) {
      vector[i] = complexityRange * (Math.random() - 0.5) * 2;
    }

    // Encode parameter count
    const paramCount = func.params.length;
    for (let i = 30; i < 40; i++) {
      vector[i] = paramCount > 0 ? Math.sin(i * paramCount / 10) : 0;
    }

    // Encode function name semantics
    const nameHash = this.hashString(func.name);
    for (let i = 40; i < 80; i++) {
      vector[i] = ((nameHash >> (i - 40)) & 1) ? 0.5 : -0.5;
    }

    // Encode parameter types
    const paramTypes = func.params.join('|');
    const paramHash = this.hashString(paramTypes);
    for (let i = 80; i < 120; i++) {
      vector[i] = ((paramHash >> (i - 80)) & 1) ? 0.3 : -0.3;
    }

    // Random noise for uniqueness
    for (let i = 120; i < 128; i++) {
      vector[i] = (Math.random() - 0.5) * 0.1;
    }

    return {
      functionName: func.name,
      vector,
      metadata: {
        category: func.category,
        complexity: func.complexity,
        parameters: func.params,
        returnType: this.inferReturnType(func.name)
      }
    };
  }

  private initializePatternEmbeddings(): void {
    const patterns = [
      { name: 'communication', keywords: ['say', 'whisper', 'shout', 'listen', 'chat', 'message'] },
      { name: 'movement', keywords: ['pos', 'position', 'move', 'teleport', 'rot', 'rotation'] },
      { name: 'physics', keywords: ['impulse', 'force', 'velocity', 'physics', 'collision'] },
      { name: 'detection', keywords: ['sensor', 'detect', 'scan', 'search', 'find'] },
      { name: 'timing', keywords: ['timer', 'delay', 'sleep', 'wait', 'schedule'] },
      { name: 'avatar', keywords: ['owner', 'agent', 'avatar', 'user', 'person'] },
      { name: 'inventory', keywords: ['inventory', 'item', 'object', 'give', 'rez'] },
      { name: 'network', keywords: ['http', 'email', 'request', 'response', 'web'] },
      { name: 'display', keywords: ['text', 'color', 'alpha', 'texture', 'glow'] },
      { name: 'controls', keywords: ['control', 'permission', 'attach', 'detach'] }
    ];

    for (const pattern of patterns) {
      const vector = this.createPatternVector(pattern.keywords);
      this.patternEmbeddings.set(pattern.name, vector);
    }
  }

  private createPatternVector(keywords: string[]): number[] {
    const vector = new Array(LSLEmbeddingsService.VECTOR_DIMENSIONS).fill(0);
    
    for (let i = 0; i < keywords.length; i++) {
      const keywordHash = this.hashString(keywords[i]);
      for (let j = 0; j < 128; j++) {
        const bit = (keywordHash >> (j % 32)) & 1;
        vector[j] += bit ? 1 : -1;
      }
    }

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= magnitude;
      }
    }

    return vector;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private inferReturnType(functionName: string): string {
    const name = functionName.toLowerCase();
    if (name.includes('get') && name.includes('pos')) return 'vector';
    if (name.includes('get') && name.includes('rot')) return 'rotation';
    if (name.includes('get') && name.includes('owner')) return 'key';
    if (name.includes('get') && name.includes('name')) return 'string';
    if (name.includes('listen')) return 'integer';
    if (name.includes('say') || name.includes('whisper') || name.includes('shout')) return 'void';
    if (name.includes('set')) return 'void';
    if (name.includes('request')) return 'key';
    return 'void';
  }

  findSimilarFunctions(functionName: string, maxResults: number = 5): SimilarityResult[] {
    const queryEmbedding = this.functionEmbeddings.get(functionName);
    if (!queryEmbedding) {
      return this.findSimilarByName(functionName, maxResults);
    }

    const results: SimilarityResult[] = [];

    for (const [name, embedding] of this.functionEmbeddings) {
      if (name === functionName) continue;

      const similarity = this.cosineSimilarity(queryEmbedding.vector, embedding.vector);
      const reason = this.explainSimilarity(queryEmbedding.metadata, embedding.metadata);

      results.push({
        functionName: name,
        similarity,
        reason
      });
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }

  findSimilarByName(functionName: string, maxResults: number = 5): SimilarityResult[] {
    const results: SimilarityResult[] = [];
    const queryName = functionName.toLowerCase();

    for (const [name, embedding] of this.functionEmbeddings) {
      if (name === functionName) continue;

      const nameSimilarity = this.calculateNameSimilarity(queryName, name.toLowerCase());
      if (nameSimilarity > 0.3) {
        results.push({
          functionName: name,
          similarity: nameSimilarity,
          reason: 'Similar function name'
        });
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }

  findFunctionsByPattern(pattern: string): SimilarityResult[] {
    const patternVector = this.patternEmbeddings.get(pattern);
    if (!patternVector) return [];

    const results: SimilarityResult[] = [];

    for (const [name, embedding] of this.functionEmbeddings) {
      const similarity = this.cosineSimilarity(patternVector, embedding.vector);
      
      if (similarity > 0.3) {
        results.push({
          functionName: name,
          similarity,
          reason: `Matches ${pattern} pattern`
        });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  private calculateNameSimilarity(name1: string, name2: string): number {
    const tokens1 = LSLParser.tokenize(name1).filter(t => t.type !== 'whitespace');
    const tokens2 = LSLParser.tokenize(name2).filter(t => t.type !== 'whitespace');

    if (tokens1.length === 0 && tokens2.length === 0) return 1.0;
    if (tokens1.length === 0 || tokens2.length === 0) return 0.0;

    const set1 = new Set(tokens1.map(t => t.value));
    const set2 = new Set(tokens2.map(t => t.value));

    const intersection = [...set1].filter(x => set2.has(x)).length;
    const union = set1.size + set2.size - intersection;

    return union > 0 ? intersection / union : 0.0;
  }

  private explainSimilarity(meta1: any, meta2: any): string {
    const reasons: string[] = [];

    if (meta1.category === meta2.category) {
      reasons.push(`Same category (${meta1.category})`);
    }

    if (Math.abs(meta1.complexity - meta2.complexity) <= 1) {
      reasons.push('Similar complexity');
    }

    if (meta1.parameters.length === meta2.parameters.length) {
      reasons.push('Same parameter count');
    }

    const commonParams = meta1.parameters.filter((p: string) => meta2.parameters.includes(p));
    if (commonParams.length > 0) {
      reasons.push(`Common parameter types: ${commonParams.join(', ')}`);
    }

    if (meta1.returnType === meta2.returnType) {
      reasons.push(`Same return type (${meta1.returnType})`);
    }

    return reasons.length > 0 ? reasons.join('; ') : 'General similarity';
  }

  addCustomFunction(name: string, category: string, complexity: number, params: string[]): void {
    const func = { name, category, complexity, params };
    const embedding = this.createFunctionEmbedding(func);
    this.functionEmbeddings.set(name, embedding);
  }

  analyzeCodePatterns(code: string): { pattern: string; confidence: number }[] {
    const tokens = LSLParser.tokenize(code);
    const functionCalls = tokens.filter(t => t.type === 'function').map(t => t.value);

    const patternScores: Map<string, number> = new Map();

    for (const [pattern, vector] of this.patternEmbeddings) {
      let score = 0;
      
      for (const funcName of functionCalls) {
        const embedding = this.functionEmbeddings.get(funcName);
        if (embedding) {
          const similarity = this.cosineSimilarity(vector, embedding.vector);
          score += similarity;
        }
      }

      if (score > 0) {
        patternScores.set(pattern, score / functionCalls.length);
      }
    }

    return Array.from(patternScores.entries())
      .map(([pattern, confidence]) => ({ pattern, confidence }))
      .sort((a, b) => b.confidence - a.confidence);
  }
}