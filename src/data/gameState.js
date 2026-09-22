/**
 * Game Stage Lifecycle Machine
 * Implements the exact stage pipeline from SDD Section 5
 */

export const GAME_STAGES = {
  AWAKENING: 'AWAKENING',
  LANDING: 'LANDING',
  WORLD_SELECT: 'WORLD_SELECT',
  WORLD_DIRECTOR: 'WORLD_DIRECTOR',
  MORPHING: 'MORPHING',
  WORLD_READY: 'WORLD_READY',
  VOID_MANIFESTATION: 'VOID_MANIFESTATION',
  ROLE_SELECT: 'ROLE_SELECT',
  TRAIT_SELECT: 'TRAIT_SELECT',
  EXPLORATION: 'EXPLORATION',
  ENCOUNTER: 'ENCOUNTER',
  CONSEQUENCE: 'CONSEQUENCE',
  ARTIFACT: 'ARTIFACT',
  ARTIFACT_DECISION: 'ARTIFACT_DECISION',
  WORLD_REACTION: 'WORLD_REACTION',
  MINI_CHALLENGE: 'MINI_CHALLENGE',
  FINAL_DECISION: 'FINAL_DECISION',
  AI_ENDING: 'AI_ENDING',
  RESULT: 'RESULT',
  REPLAY: 'REPLAY',
};

export const STAGE_FLOW_ORDER = [
  GAME_STAGES.AWAKENING,
  GAME_STAGES.LANDING,
  GAME_STAGES.WORLD_SELECT,
  GAME_STAGES.VOID_MANIFESTATION,
  GAME_STAGES.WORLD_DIRECTOR,
  GAME_STAGES.MORPHING,
  GAME_STAGES.WORLD_READY,
  GAME_STAGES.ROLE_SELECT,
  GAME_STAGES.TRAIT_SELECT,
  GAME_STAGES.EXPLORATION,
  GAME_STAGES.ENCOUNTER,
  GAME_STAGES.CONSEQUENCE,
  GAME_STAGES.ARTIFACT,
  GAME_STAGES.ARTIFACT_DECISION,
  GAME_STAGES.WORLD_REACTION,
  GAME_STAGES.MINI_CHALLENGE,
  GAME_STAGES.FINAL_DECISION,
  GAME_STAGES.AI_ENDING,
  GAME_STAGES.RESULT,
  GAME_STAGES.REPLAY
];

/**
 * Initial Core Game State adhering to SDD Section 6
 */
export const INITIAL_GAME_STATE = {
  // Navigation & lifecycle
  currentStage: GAME_STAGES.LANDING,
  history: [GAME_STAGES.LANDING],

  // World creation
  world: null,                  // 'cyber' | 'fantasy' | 'mystery' | Object
  mood: 'mysterious',           // 'serene' | 'mysterious' | 'dramatic' | 'apocalyptic'
  intensity: 50,                // 0 - 100
  chaos: 50,                    // 0 - 100
  atmosphere: 'night',          // 'dawn' | 'noon' | 'twilight' | 'night' | 'storm'

  // Character
  role: null,                   // Role object or ID
  trait: null,                  // Trait object or ID

  // Exploration
  discoveredObjects: [],        // list of object IDs found
  inventory: [],                // list of collected items

  // Story & Encounters
  encounterChoice: null,        // 'investigate' | 'defend' | 'evade'
  artifact: null,               // Discovered artifact metadata
  artifactDecision: null,       // 'preserve' | 'commune' | 'consume'

  // Challenge
  challengeScore: 0,            // numeric score
  challengeResult: null,        // 'success' | 'partial' | 'failure'

  // Final Outcome & AI Synthesis
  finalDecision: null,          // 'ascend' | 'stabilize' | 'diverge'
  endingType: null,             // calculated ending archetype
  aiEnding: null,               // AI synthesized story conclusion

  // System status
  isGeneratingAI: false,
  error: null,
};
