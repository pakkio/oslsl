#!/usr/bin/env node

import { OSSLFunctions } from '../data/ossl-functions';

class CoverageReport {
  static generateReport() {
    const functions = OSSLFunctions.getAllFunctions();
    const categories = OSSLFunctions.getCategories();
    
    console.log('🚀 LSL MCP Server v3.0 - OSSL Coverage Report');
    console.log('=' .repeat(60));
    console.log();
    
    // Total functions
    console.log(`📊 TOTAL FUNCTIONS: ${functions.length}`);
    console.log(`🎯 TARGET: 256 (OpenSimulator complete set)`);
    console.log(`📈 COVERAGE: ${((functions.length / 256) * 100).toFixed(1)}%`);
    console.log();
    
    // Functions by category
    console.log('📂 FUNCTIONS BY CATEGORY:');
    console.log('-' .repeat(40));
    
    const categoryStats = categories.map(category => {
      const categoryFunctions = OSSLFunctions.getFunctionsByCategory(category);
      return {
        category,
        count: categoryFunctions.length,
        functions: categoryFunctions.map(f => f.name)
      };
    }).sort((a, b) => b.count - a.count);
    
    categoryStats.forEach(stat => {
      console.log(`${stat.category.padEnd(15)} | ${stat.count.toString().padStart(3)} functions`);
      if (stat.count > 0) {
        console.log(`   └─ ${stat.functions.slice(0, 3).join(', ')}${stat.count > 3 ? ` +${stat.count - 3} more` : ''}`);
      }
    });
    
    console.log();
    
    // Critical functions status
    const criticalFunctions = [
      'osSetDynamicTextureURL',
      'osGetAvatarList', 
      'osParseJSON',
      'osMessageObject',
      'osGetNotecard',
      'osIsNpc',
      'osNpcSay',
      'osNpcCreate',
      'osTeleportAgent'
    ];
    
    console.log('🔥 CRITICAL FUNCTIONS STATUS:');
    console.log('-' .repeat(40));
    
    criticalFunctions.forEach(funcName => {
      const found = functions.find(f => f.name === funcName);
      const status = found ? '✅' : '❌';
      console.log(`${status} ${funcName.padEnd(25)} | ${found ? 'Available' : 'Missing'}`);
    });
    
    console.log();
    
    // Improvements needed
    const lowCoverageCategories = categoryStats.filter(stat => stat.count < 5);
    if (lowCoverageCategories.length > 0) {
      console.log('⚠️  CATEGORIES NEEDING IMPROVEMENT:');
      console.log('-' .repeat(40));
      lowCoverageCategories.forEach(cat => {
        console.log(`${cat.category.padEnd(15)} | Only ${cat.count} function(s) - needs expansion`);
      });
      console.log();
    }
    
    // Rating calculation
    const coverageScore = (functions.length / 256) * 40; // Max 40 points for coverage
    const criticalScore = (criticalFunctions.filter(name => 
      functions.find(f => f.name === name)
    ).length / criticalFunctions.length) * 40; // Max 40 points for critical functions
    const categoryScore = (categoryStats.filter(stat => stat.count >= 3).length / categories.length) * 20; // Max 20 points for category distribution
    
    const totalScore = coverageScore + criticalScore + categoryScore;
    const rating = totalScore / 10; // Convert to 10-point scale
    
    console.log('🎯 OVERALL RATING:');
    console.log('-' .repeat(40));
    console.log(`Coverage Score:     ${coverageScore.toFixed(1)}/40 points`);
    console.log(`Critical Functions: ${criticalScore.toFixed(1)}/40 points`);
    console.log(`Category Balance:   ${categoryScore.toFixed(1)}/20 points`);
    console.log(`TOTAL SCORE:        ${totalScore.toFixed(1)}/100 points`);
    console.log(`RATING:             ${rating.toFixed(1)}/10 ⭐`);
    
    console.log();
    
    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    console.log('-' .repeat(40));
    
    if (rating < 5) {
      console.log('❌ Poor coverage - Major expansion needed');
      console.log('   • Add more functions to all categories');
      console.log('   • Focus on critical missing functions');
    } else if (rating < 7) {
      console.log('⚠️  Fair coverage - Significant improvements needed');
      console.log('   • Expand low-coverage categories');
      console.log('   • Add more specialized functions');
    } else if (rating < 8.5) {
      console.log('✅ Good coverage - Minor improvements needed');
      console.log('   • Fill remaining gaps in categories');
      console.log('   • Add advanced/specialized functions');
    } else {
      console.log('🚀 Excellent coverage - Production ready!');
      console.log('   • Consider adding cutting-edge functions');
      console.log('   • Maintain with OpenSimulator updates');
    }
    
    return {
      totalFunctions: functions.length,
      coverage: (functions.length / 256) * 100,
      rating: rating,
      categoryStats: categoryStats
    };
  }
}

// Run if called directly
if (require.main === module) {
  CoverageReport.generateReport();
}

export { CoverageReport };