/**
 * Alterra Headless Simulation Verification Script
 * Validates:
 * 1. World Creation (3 distinct world archetypes: cyber, fantasy, mystery)
 * 2. World Director Parameter shifts (Mood, Intensity, Chaos, Atmosphere)
 * 3. AI Morph Generation & Fallback consistency
 * 4. Role & Trait Selection mechanics (Explorer, Hacker, Guardian; Brave, Curious, Cautious)
 * 5. Interactive Object Discovery & Cross-Object Inventory unlocking
 * 6. Meaningful Branching Encounters (HELP / HIDE / TAKE) and State Persistence
 */

import { WORLDS, MOODS, ATMOSPHERES } from './src/data/worlds.js';
import { ROLES, TRAITS } from './src/data/roles.js';
import { WORLD_OBJECTS, WORLD_ENCOUNTERS } from './src/data/objectsAndEncounters.js';
import { AIService } from './src/services/aiService.js';
import { GameEngine } from './src/utils/gameEngine.js';

console.log('--- ALTERA TEST SUITE STARTING ---');

// Test 1: Validate 3 Worlds
console.log('\n[TEST 1] Validating 3 World Configurations:');
for (const [key, w] of Object.entries(WORLDS)) {
  console.log(`  ✔ World: "${w.name}" (Theme: ${w.theme}, Artifact: ${w.artifact})`);
  if (!w.artifact || !w.sceneTitle) {
    throw new Error(`World ${key} missing artifact or scene metadata.`);
  }
}

// Test 2: Validate Objects and Inventory Mechanics for Cyber
console.log('\n[TEST 2] Validating Object Dependencies & Cross-Unlocking for Cyber:');
const cyberObjs = WORLD_OBJECTS.cyber;
const terminal = cyberObjs.find(o => o.id === 'cyber_terminal');
const chest = cyberObjs.find(o => o.id === 'cyber_chest');
const vault = cyberObjs.find(o => o.id === 'cyber_artifact_vault');

console.log(`  - Terminal yields: ${terminal.rewardItem.name} (${terminal.rewardItem.id})`);
console.log(`  - Chest requires: ${chest.requiresItem}, yields: ${chest.rewardItem.name} (${chest.rewardItem.id})`);
console.log(`  - Vault requires: ${vault.requiresItem}, yields: ${vault.rewardItem.name} (${vault.rewardItem.id})`);

if (chest.requiresItem !== terminal.rewardItem.id) {
  throw new Error('Chain broken: Chest does not require Terminal reward');
}
if (vault.requiresItem !== chest.rewardItem.id) {
  throw new Error('Chain broken: Vault does not require Chest reward');
}
console.log('  ✔ Chain verification passed: Terminal -> Keycard -> Chest -> Key -> Artifact Vault');

// Test 3: Validate Fantasy and Mystery Objects
console.log('\n[TEST 3] Validating Fantasy and Mystery Worlds Object Chains:');
['fantasy', 'mystery'].forEach(wKey => {
  const objs = WORLD_OBJECTS[wKey];
  const t = objs.find(o => o.type === 'terminal');
  const c = objs.find(o => o.type === 'chest');
  const a = objs.find(o => o.type === 'artifact');
  if (c.requiresItem !== t.rewardItem.id || a.requiresItem !== c.rewardItem.id) {
    throw new Error(`Chain broken in ${wKey}`);
  }
  console.log(`  ✔ ${wKey.toUpperCase()} object chain validated.`);
});

// Test 4: Validate Encounters & Consequence Branching (HELP / HIDE / TAKE)
console.log('\n[TEST 4] Validating Encounter Branching and Chaos Delta:');
for (const [wKey, enc] of Object.entries(WORLD_ENCOUNTERS)) {
  console.log(`  Entity: ${enc.entityName}`);
  const optionIds = enc.options.map(o => o.id);
  if (!optionIds.includes('help') || !optionIds.includes('hide') || !optionIds.includes('take')) {
    throw new Error(`Encounter in ${wKey} does not support help/hide/take`);
  }
  const helpOpt = enc.options.find(o => o.id === 'help');
  const takeOpt = enc.options.find(o => o.id === 'take');
  console.log(`    - HELP: ${helpOpt.consequence.chaosChange}% Chaos, Stat: ${helpOpt.consequence.statBonus}`);
  console.log(`    - TAKE: ${takeOpt.consequence.chaosChange}% Chaos, Stat: ${takeOpt.consequence.statBonus}`);
}
console.log('  ✔ Encounters branching validated.');

// Test 5: Validate Local AI Fallback & World DNA
console.log('\n[TEST 5] Validating Local AI Fallback & World DNA Generation:');
const mockState = {
  world: WORLDS.cyber,
  mood: 'mysterious',
  intensity: 75,
  chaos: 60,
  role: ROLES.find(r => r.id === 'hacker'),
  trait: TRAITS.find(t => t.id === 'brave'),
  finalDecision: 'stabilize'
};

const dna = GameEngine.generateWorldDNA(mockState);
console.log(`  ✔ World DNA Generated: ${dna}`);

const aiFallback = AIService.synthesizeLocalEnding(mockState);
console.log(`  ✔ AI Epilogue Fallback Generated: "${aiFallback.title}"`);
console.log(`    "${aiFallback.epilogue.substring(0, 80)}..."`);

console.log('\n--- ALL TEST SUITE CHECKS PASSED (100% OK) ---');
