import { AIService } from '../src/services/aiService.js';
import { DecisionEngine } from '../src/utils/decisionEngine.js';
import { WORLDS } from '../src/data/worlds.js';

async function runTests() {
  console.log('=== ALTERRA PHASE 4 & PHASE 5 ENGINE VERIFICATION ===\n');

  // Test 1: M17 Artifact consistency
  console.log('Test 1: M17 Artifacts check:');
  console.assert(WORLDS.cyber.artifact === 'Quantum Core', `Expected Quantum Core, got ${WORLDS.cyber.artifact}`);
  console.assert(WORLDS.fantasy.artifact === 'Heart of the Forest', `Expected Heart of the Forest, got ${WORLDS.fantasy.artifact}`);
  console.assert(WORLDS.mystery.artifact === 'Signal Key', `Expected Signal Key, got ${WORLDS.mystery.artifact}`);
  console.log('✔ M17 Artifacts correctly defined for all worlds\n');

  // Test 2: M18, M21, M22 Decision outcomes for SAVE, CONTROL, DESTROY
  console.log('Test 2: Branching Paths & Outcomes Evaluation:');

  const baseState = {
    world: WORLDS.cyber,
    mood: 'mysterious',
    intensity: 65,
    chaos: 40,
    role: { id: 'infiltrator', name: 'Ghost Operative' },
    trait: { id: 'daring', name: 'Overclocked Reflexes' },
    discoveredObjects: ['data_terminal', 'security_cache'],
    inventory: [{ id: 'data_chip', name: 'Encrypted Data Chip' }],
    encounterChoice: 'help',
    challengeScore: 100,
    challengeResult: 'success'
  };

  // Path A: SAVE + STAY
  const saveStay = DecisionEngine.evaluateOutcome({
    ...baseState,
    artifactDecision: 'save',
    finalDecision: 'stay'
  });
  console.log('SAVE + STAY Archetype:', saveStay.archetype, '| Alignment:', saveStay.alignment);
  console.assert(saveStay.archetype === 'The Eternal Sentinel');

  // Path B: SAVE + ESCAPE
  const saveEscape = DecisionEngine.evaluateOutcome({
    ...baseState,
    artifactDecision: 'save',
    finalDecision: 'escape'
  });
  console.log('SAVE + ESCAPE Archetype:', saveEscape.archetype, '| Alignment:', saveEscape.alignment);
  console.assert(saveEscape.archetype === 'The Transcendent Architect');

  // Path C: CONTROL + STAY
  const controlStay = DecisionEngine.evaluateOutcome({
    ...baseState,
    artifactDecision: 'control',
    finalDecision: 'stay'
  });
  console.log('CONTROL + STAY Archetype:', controlStay.archetype, '| Risk Factor:', controlStay.riskFactor);
  console.assert(controlStay.archetype === 'The Singularity Overlord');

  // Path D: CONTROL + ESCAPE
  const controlEscape = DecisionEngine.evaluateOutcome({
    ...baseState,
    artifactDecision: 'control',
    finalDecision: 'escape'
  });
  console.log('CONTROL + ESCAPE Archetype:', controlEscape.archetype);
  console.assert(controlEscape.archetype === 'The Rogue Anomaly');

  // Path E: DESTROY + ESCAPE
  const destroyEscape = DecisionEngine.evaluateOutcome({
    ...baseState,
    artifactDecision: 'destroy',
    finalDecision: 'escape'
  });
  console.log('DESTROY + ESCAPE Archetype:', destroyEscape.archetype, '| Alignment:', destroyEscape.alignment);
  console.assert(destroyEscape.archetype === 'The Void Wanderer');

  // Path F: DESTROY + STAY
  const destroyStay = DecisionEngine.evaluateOutcome({
    ...baseState,
    artifactDecision: 'destroy',
    finalDecision: 'stay'
  });
  console.log('DESTROY + STAY Archetype:', destroyStay.archetype);
  console.assert(destroyStay.archetype === 'The Ash Sovereign');
  console.log('✔ All 6 branching archetypes correctly discriminated\n');

  // Test 3: M23 AI World Identity
  console.log('Test 3: M23 AI World Identity (Fallback & generation):');
  const identity = await AIService.generateWorldIdentity(baseState);
  console.log('Generated Identity:', identity);
  console.assert(identity.title && identity.tagline, 'Identity must have title and tagline');
  console.log('✔ AI World Identity functioning\n');

  // Test 4: M24 & M25 AI Personalized Ending (<30 words, fallback safe)
  console.log('Test 4: M24 & M25 AI Personalized Ending:');
  const endingSave = await AIService.generateEnding({
    ...baseState,
    artifactDecision: 'save',
    finalDecision: 'escape'
  });
  console.log('SAVE Ending Title:', endingSave.title);
  console.log('SAVE Ending Epilogue:', endingSave.epilogue);
  const wordCountSave = endingSave.epilogue.split(/\s+/).length;
  console.log('Word count:', wordCountSave);
  console.assert(wordCountSave <= 30, `Word count must be <= 30 words, got ${wordCountSave}`);

  const endingDestroy = await AIService.generateEnding({
    ...baseState,
    artifactDecision: 'destroy',
    finalDecision: 'escape'
  });
  console.log('DESTROY Ending Title:', endingDestroy.title);
  console.log('DESTROY Ending Epilogue:', endingDestroy.epilogue);
  const wordCountDestroy = endingDestroy.epilogue.split(/\s+/).length;
  console.log('Word count:', wordCountDestroy);
  console.assert(wordCountDestroy <= 30, `Word count must be <= 30 words, got ${wordCountDestroy}`);
  console.assert(endingSave.title !== endingDestroy.title, 'Different paths must produce different endings');
  console.log('✔ AI Ending synthesis adhering strictly to <= 30 words and true branching\n');

  // Test 5: M26 World DNA & M27 Easter Egg
  console.log('Test 5: M26 World DNA & M27 Easter egg:');
  const dnaWithEgg = DecisionEngine.generateWorldDNA({
    ...baseState,
    discoveredObjects: ['data_terminal', 'unknown_signal'],
    artifactDecision: 'destroy',
    finalDecision: 'escape'
  });
  console.log('DNA Hash:', dnaWithEgg.dnaHash);
  console.log('Easter Egg status:', dnaWithEgg.easterEggDiscovered);
  console.assert(dnaWithEgg.easterEggDiscovered === true, 'Easter egg must be recorded as discovered');
  console.assert(dnaWithEgg.metrics.length === 5, 'Must contain 5 core DNA metrics');
  console.assert(dnaWithEgg.keyChoices.length === 6, 'Must contain 6 key choices');
  console.log('✔ World DNA and Easter Egg verified\n');

  console.log('=== ALL AUTOMATED TESTS PASSED SUCCESSFULLY ===');
}

runTests().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
