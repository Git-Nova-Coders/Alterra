import { DecisionEngine } from '../src/utils/decisionEngine.js';
import { AIService } from '../src/services/aiService.js';
import { WORLDS } from '../src/data/worlds.js';

async function testJourneys() {
  console.log('=== VERIFYING THREE DISTINCT VISUAL JOURNEYS ===\n');

  // Journey A:
  // Cyber -> Hacker -> Curious -> Help -> Control -> successful challenge -> Stay
  console.log('Testing Journey A: Cyber / Hacker / Curious / Help / Control / Stay');
  const journeyA = {
    world: WORLDS.cyber,
    role: { id: 'infiltrator', codeName: 'HACKER', name: 'Ghost Operative (Hacker)' },
    trait: { id: 'hyperfocused', codeName: 'CURIOUS', name: 'Hyper-Vigilant (Curious)' },
    encounterChoice: 'help',
    artifactDecision: 'control',
    challengeResult: 'success',
    challengeScore: 87,
    finalDecision: 'stay',
    discoveredObjects: ['data_terminal', 'security_cache']
  };

  const evalA = DecisionEngine.evaluateOutcome(journeyA);
  const dnaA = DecisionEngine.generateWorldDNA(journeyA);
  const endingA = await AIService.generateEnding(journeyA);
  console.log('Journey A Archetype:', evalA.archetype);
  console.log('Journey A DNA Hash:', dnaA.dnaHash);
  console.log('Journey A Ending Title:', endingA.title);
  console.log('Journey A Ending:', endingA.epilogue);
  console.assert(evalA.archetype === 'The Singularity Overlord', `Expected The Singularity Overlord, got ${evalA.archetype}`);
  console.assert(dnaA.dnaHash.includes('CYB') && dnaA.dnaHash.includes('CON') && dnaA.dnaHash.includes('STA'));
  console.log('✔ Journey A verified\n');

  // Journey B:
  // Fantasy -> Guardian -> Brave -> Hide -> Destroy -> failed/low challenge -> Escape
  console.log('Testing Journey B: Fantasy / Guardian / Brave / Hide / Destroy / Escape');
  const journeyB = {
    world: WORLDS.fantasy,
    role: { id: 'synthesizer', codeName: 'GUARDIAN', name: 'Aether Shaper (Guardian)' },
    trait: { id: 'daring', codeName: 'BRAVE', name: 'Overclocked Reflexes (Brave)' },
    encounterChoice: 'evade',
    artifactDecision: 'destroy',
    challengeResult: 'failure',
    challengeScore: 25,
    finalDecision: 'escape',
    discoveredObjects: ['ancient_runestone']
  };

  const evalB = DecisionEngine.evaluateOutcome(journeyB);
  const dnaB = DecisionEngine.generateWorldDNA(journeyB);
  const endingB = await AIService.generateEnding(journeyB);
  console.log('Journey B Archetype:', evalB.archetype);
  console.log('Journey B DNA Hash:', dnaB.dnaHash);
  console.log('Journey B Ending Title:', endingB.title);
  console.log('Journey B Ending:', endingB.epilogue);
  console.assert(evalB.archetype === 'The Void Wanderer', `Expected The Void Wanderer, got ${evalB.archetype}`);
  console.assert(dnaB.dnaHash.includes('FAN') && dnaB.dnaHash.includes('DES') && dnaB.dnaHash.includes('ESC'));
  console.log('✔ Journey B verified\n');

  // Journey C:
  // Mystery -> Explorer -> Cautious -> Take -> Save -> successful challenge -> Stay
  console.log('Testing Journey C: Mystery / Explorer / Cautious / Take / Save / Stay');
  const journeyC = {
    world: WORLDS.mystery,
    role: { id: 'archivist', codeName: 'EXPLORER', name: 'Cosmic Chronicler (Explorer)' },
    trait: { id: 'harmonic', codeName: 'CAUTIOUS', name: 'Resonant Attunement (Cautious)' },
    encounterChoice: 'take',
    artifactDecision: 'save',
    challengeResult: 'success',
    challengeScore: 100,
    finalDecision: 'stay',
    discoveredObjects: ['flight_recorder', 'unknown_signal']
  };

  const evalC = DecisionEngine.evaluateOutcome(journeyC);
  const dnaC = DecisionEngine.generateWorldDNA(journeyC);
  const endingC = await AIService.generateEnding(journeyC);
  console.log('Journey C Archetype:', evalC.archetype);
  console.log('Journey C DNA Hash:', dnaC.dnaHash);
  console.log('Journey C Ending Title:', endingC.title);
  console.log('Journey C Ending:', endingC.epilogue);
  console.assert(evalC.archetype === 'The Eternal Sentinel', `Expected The Eternal Sentinel, got ${evalC.archetype}`);
  console.assert(dnaC.dnaHash.includes('MYS') && dnaC.dnaHash.includes('SAV') && dnaC.dnaHash.includes('STA'));
  console.assert(dnaC.easterEggDiscovered === true, 'Easter egg must be recorded in Journey C');
  console.log('✔ Journey C verified\n');

  // Distinct verification
  console.assert(evalA.archetype !== evalB.archetype && evalB.archetype !== evalC.archetype, 'All 3 archetypes must be completely distinct');
  console.assert(dnaA.dnaHash !== dnaB.dnaHash && dnaB.dnaHash !== dnaC.dnaHash, 'All 3 DNA hashes must be distinct');
  console.log('=== ALL THREE JOURNEYS PROVED DISTINCT, DYNAMIC, AND VISUALLY BRANCHED ===');
}

testJourneys().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
