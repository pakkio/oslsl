const { OSSLFunctions } = require('./dist/data/ossl-functions.js');

console.log('🔍 LSL MCP Server v3.0 - Statistiche Database OSSL');
console.log('=' * 60);

const allFunctions = OSSLFunctions.getAllFunctions();
const categories = OSSLFunctions.getCategories();

console.log(`📊 TOTALE FUNZIONI OSSL: ${allFunctions.length}`);
console.log(`📂 CATEGORIE DISPONIBILI: ${categories.length}`);
console.log('');

// Statistiche per categoria
console.log('📋 FUNZIONI PER CATEGORIA:');
categories.forEach(category => {
  const functionsInCategory = OSSLFunctions.getFunctionsByCategory(category);
  console.log(`  ${category}: ${functionsInCategory.length} funzioni`);
});

console.log('');

// Funzioni critiche richieste
const criticalFunctions = [
  'osSetDynamicTextureURL',
  'osGetAvatarList', 
  'osParseJSON',
  'osMessageObject',
  'osGetNotecard',
  'osIsNpc',
  'osNpcSay'
];

console.log('✅ VERIFICA FUNZIONI CRITICHE:');
criticalFunctions.forEach(funcName => {
  const func = OSSLFunctions.getFunctionByName(funcName);
  const status = func ? '✅' : '❌';
  console.log(`  ${status} ${funcName}: ${func ? 'TROVATA' : 'MANCANTE'}`);
});

console.log('');

// Coverage estimate
const estimatedTotalOSSL = 256; // From OpenSim wiki
const coveragePercent = Math.round((allFunctions.length / estimatedTotalOSSL) * 100);

console.log(`📈 COPERTURA STIMATA: ${coveragePercent}% (${allFunctions.length}/${estimatedTotalOSSL})`);

// Rating calculation
let rating = 0;
if (coveragePercent >= 80) rating = 10;
else if (coveragePercent >= 60) rating = 8;
else if (coveragePercent >= 40) rating = 7;
else if (coveragePercent >= 25) rating = 6;
else if (coveragePercent >= 15) rating = 5;
else rating = 4;

console.log(`⭐ RATING CALCOLATO: ${rating}/10`);

if (rating >= 7) {
  console.log('🎉 OBIETTIVO RAGGIUNTO! Rating >= 7');
} else {
  console.log(`🎯 Serve ancora lavoro per raggiungere 7+ (attuale: ${rating})`);
  console.log(`📝 Funzioni mancanti stimate: ${estimatedTotalOSSL - allFunctions.length}`);
}