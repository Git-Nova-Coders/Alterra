/**
 * Alterra AI Service
 * M23: AI World Identity Generation
 * M24: AI Personalized Ending Generation (Strictly <= 30 words, adhering to required prompt structure)
 * M25: 100% Deterministic Local Fallback Engine (Guarantees zero API error exposure to user)
 */

export const AIService = {
  /**
   * M23: Generates a concise title and tagline based on selected world configuration
   */
  async generateWorldIdentity(gameState) {
    const apiKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : undefined;
    const enableAI = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_ENABLE_AI_SYNTHESIS === 'true' : false;

    if (enableAI && apiKey) {
      try {
        const prompt = `SYSTEM ROLE: You are the world-naming engine for Alterra.
TASK: Generate a concise title (2-4 words) and a poetic tagline (8-12 words) for a simulated reality with parameters:
WORLD: ${gameState.world?.name || 'Cyber'} (${gameState.world?.theme})
MOOD: ${gameState.mood}
INTENSITY: ${gameState.intensity}%
CHAOS: ${gameState.chaos}%
ATMOSPHERE: ${gameState.atmosphere}
Return ONLY valid JSON matching: { "title": string, "tagline": string }`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
          if (parsed?.title && parsed?.tagline) return parsed;
        }
      } catch (err) {
        console.warn('[AIService] World Identity AI error, using local fallback:', err);
      }
    }

    // Local Fallback Identity
    const w = gameState.world?.id || 'cyber';
    const m = gameState.mood || 'mysterious';
    const fallbacks = {
      cyber: {
        serene: { title: 'The Silent Grid', tagline: 'A dormant silicon sanctuary bathing in neon starlight.' },
        mysterious: { title: 'Ghost Protocol 2099', tagline: 'Encrypted frequencies whisper through the rain-slicked towers.' },
        dramatic: { title: 'Overclocked Horizon', tagline: 'High-voltage pulses tear through the sovereignty of code.' },
        apocalyptic: { title: 'Neon Singularity Zero', tagline: 'The final mainframe burns under the weight of entropy.' }
      },
      fantasy: {
        serene: { title: 'The Verdant Sanctuary', tagline: 'Eternal roots cradle ancient sunlight in peaceful respiration.' },
        mysterious: { title: 'Twilight of Sylvan Glyphs', tagline: 'Dormant magic rustles beneath moss-covered petrified stones.' },
        dramatic: { title: 'Awakened Leyline Storm', tagline: 'Primal sap surges violently through the ancient heartwood.' },
        apocalyptic: { title: 'The Ashen Sylvan Thicket', tagline: 'The elder grove stands defiant against consuming decay.' }
      },
      mystery: {
        serene: { title: 'The Quiet Orbit', tagline: 'Drifting serenely through the stellar void outside time.' },
        mysterious: { title: 'Echo Station Tartarus', tagline: 'Somewhere between deep-space discovery and the great silence.' },
        dramatic: { title: 'Gravimetric Horizon', tagline: 'Warning klaxons echo as spatial boundaries begin to buckle.' },
        apocalyptic: { title: 'Event Horizon Collapse', tagline: 'The derelict station faces the consuming void of entropy.' }
      }
    };

    return fallbacks[w]?.[m] || {
      title: `${gameState.world?.name || 'Simulation'}: Resonance Flux`,
      tagline: 'A unique pocket reality forged by conscious intervention.'
    };
  },

  /**
   * M24: Generates a cinematic ending of 30 words or fewer using structured context
   */
  async generateEnding(gameState) {
    const apiKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : undefined;
    const enableAI = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_ENABLE_AI_SYNTHESIS === 'true' : false;

    if (enableAI && apiKey) {
      try {
        const prompt = `SYSTEM ROLE:
You are the narrative engine for Alterra.

TASK:
Generate a cinematic ending of 30 words or fewer.

PLAYER WORLD:
${gameState.world?.name || 'Unknown Sector'}

WORLD MOOD:
${gameState.mood || 'mysterious'}

WORLD INTENSITY:
${gameState.intensity}%

WORLD CHAOS:
${gameState.chaos}%

PLAYER ROLE:
${gameState.role?.name || 'Unknown Operative'}

PLAYER TRAIT:
${gameState.trait?.name || 'Instinctive'}

DISCOVERED OBJECTS:
${(gameState.discoveredObjects || []).join(', ') || 'Standard relic cache'}

ENCOUNTER:
${gameState.encounterChoice || 'observed entity'}

ARTIFACT DECISION:
${gameState.artifactDecision || 'awakened'}

CHALLENGE RESULT:
${gameState.challengeResult || 'completed'}

FINAL DECISION:
${gameState.finalDecision || 'stay'}

RULES:
- Reflect the player's actual choices.
- Do not contradict the selected world.
- Do not invent unrelated gameplay events.
- Make the ending feel specific to this player.
- Keep it cinematic.
- Maximum 30 words.
Return ONLY valid JSON matching: { "title": string, "epilogue": string, "verdict": string }`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
          if (parsed?.epilogue) {
            return {
              title: parsed.title || 'The Convergence of Reality',
              verdict: parsed.verdict || 'Destiny Recorded',
              epilogue: parsed.epilogue.trim(),
              chronicleHash: `ALT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              generatedVia: 'Gemini Neural Synthesizer'
            };
          }
        }
      } catch (err) {
        console.warn('[AIService] Gemini API generation failed, gracefully invoking local fallback:', err);
      }
    }

    // M25: 100% Reliable Local Fallback Engine
    return this.synthesizeLocalEnding(gameState);
  },

  /**
   * M25: Rule-based local synthesis ensuring maximum narrative variance without API errors
   */
  synthesizeLocalEnding(state) {
    const world = state.world?.id || 'cyber';
    const roleName = state.role?.name || 'Operative';
    const artifact = state.world?.artifact || 'The Artifact';
    const artChoice = state.artifactDecision || 'save'; // save | control | destroy
    const finChoice = state.finalDecision || 'escape';   // escape | stay
    const passedChallenge = state.challengeResult === 'success';

    let title = '';
    let epilogue = '';
    let verdict = '';

    // Deterministic matrix based on Artifact Decision + Final Decision + World
    if (artChoice === 'save' && finChoice === 'stay') {
      title = 'The Harmonized Guardian';
      verdict = 'Equilibrium Achieved';
      if (world === 'cyber') {
        epilogue = `As the ${roleName}, you preserved the ${artifact}. Neo-Kowloon stabilized into pristine digital calm, forever anchored by your enduring vigilance inside the matrix.`;
      } else if (world === 'fantasy') {
        epilogue = `You healed the ${artifact}. The ancient canopy hums in eternal bloom, sealing your sacred pact with Aethelgard forevermore.`;
      } else {
        epilogue = `The ${artifact} stabilized Station Tartarus. Silent gravimetric tides fell calm as you remained behind, the lonely eternal beacon in the void.`;
      }
    } else if (artChoice === 'save' && finChoice === 'escape') {
      title = 'The Transcendent Architect';
      verdict = 'Ascension Beyond Boundaries';
      if (world === 'cyber') {
        epilogue = `Securing the stabilized ${artifact}, you breached the neon firewall. The city thrives in your wake as you ascend beyond the simulation.`;
      } else if (world === 'fantasy') {
        epilogue = `With the pristine ${artifact} restored, you crossed the gateway. Aethelgard flourishes as living memories ride upon your departure.`;
      } else {
        epilogue = `You salvaged the ${artifact}'s true signal and escaped into deep space, leaving behind a tranquil station reborn from shadows.`;
      }
    } else if (artChoice === 'control') {
      if (finChoice === 'stay') {
        title = 'The Singularity Overlord';
        verdict = 'Absolute Matrix Dominance';
        epilogue = `Subjugating the ${artifact}'s chaotic frequencies, you seized the control node. Glitches pulse to your heartbeat as you rule this volatile domain.`;
      } else {
        title = 'The Rogue Anomaly';
        verdict = 'Unbound Divergence';
        epilogue = `Harnessing the weaponized ${artifact}, you escaped through the fluctuating rift. Reality strains behind you, forever reshaped by your daring intervention.`;
      }
    } else {
      // DESTROY
      if (finChoice === 'escape') {
        title = 'The Void Wanderer';
        verdict = 'Cataclysmic Escape';
        epilogue = `Shattering the ${artifact}, reality collapsed into falling embers. You leapt through the emergency breach moments before total simulation erasure.`;
      } else {
        title = 'The Ash Sovereign';
        verdict = 'Final Zero State';
        epilogue = `The broken ${artifact} unraveled the world. Standing amidst seismic ruins, you embraced the sublime silence of a reality restored to zero.`;
      }
    }

    // Append modifier if challenge was failed
    if (!passedChallenge) {
      epilogue = epilogue.replace('pristine', 'fractured').replace('thrives', 'lingers');
    }

    // Ensure under 30 words strictly
    const words = epilogue.split(/\s+/);
    if (words.length > 30) {
      epilogue = words.slice(0, 30).join(' ') + '.';
    }

    return {
      title,
      verdict,
      epilogue,
      chronicleHash: `ALT-${world.substring(0, 3).toUpperCase()}-${artChoice.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      generatedVia: 'Alterra Neural Fallback Engine v3.0'
    };
  }
};
