#!/usr/bin/env node

const { LSLSemanticAnalysisService } = require('./dist/services/lsl-semantic-analysis.js');
const fs = require('fs');

async function testSemanticAnalysis() {
    const analysisService = new LSLSemanticAnalysisService();
    
    // Read test LSL file
    const testCode = fs.readFileSync('./test-enhanced.lsl', 'utf8');
    
    console.log('🔍 Testing Enhanced LSL Semantic Analysis...\n');
    
    // Analyze the code
    const analysis = analysisService.analyzeCode(testCode);
    
    // Generate and display report
    const report = analysisService.generateAnalysisReport(analysis);
    console.log(report);
    
    console.log('\n🎯 Testing Function Similarity...\n');
    
    // Test similarity search
    const similarToLlSay = analysisService.embeddingsService.findSimilarFunctions('llSay', 3);
    console.log('Functions similar to llSay:');
    similarToLlSay.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.functionName} (${result.similarity.toFixed(3)}) - ${result.reason}`);
    });
    
    console.log('\n📊 Testing Pattern Analysis...\n');
    
    // Test pattern analysis
    const patterns = analysisService.embeddingsService.analyzeCodePatterns(testCode);
    console.log('Detected patterns:');
    patterns.forEach(pattern => {
        console.log(`  - ${pattern.pattern}: ${pattern.confidence.toFixed(3)} confidence`);
    });
}

testSemanticAnalysis().catch(console.error);