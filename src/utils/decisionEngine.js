/**
 * Alterra Decision Engine & World DNA Generator
 * Implements M22 (Comprehensive Decision Engine) and M26 (World DNA)
 * Evaluates 12+ dimensions to produce non-trivial, distinct realities
 */

export const DecisionEngine = {
  /**
   * Evaluates player choices across all dimensions:
   * world, mood, intensity, chaos, role, trait, discoveredObjects, inventory,
   * encounterChoice, artifactDecision, challengeScore, finalDecision
   */
  evaluateOutcome(state) {
    const {
      world,
      mood = 'mysterious',
      intensity = 50,
      chaos = 50,
      role,
      trait,
      discoveredObjects = [],
      inventory = [],
      encounterChoice = 'investigate',
      artifactDecision = 'save',
      challengeScore = 0,
      challengeResult = 'success',
      finalDecision = 'stay'
    } = state;

    // Calculate core alignment score (-100 to +100)
    // Save: +40, Control: 0, Destroy: -40
    let alignmentScore = 0;
    if (artifactDecision === 'save') alignmentScore += 40;
    else if (artifactDecision === 'destroy') alignmentScore -= 40;

    // Encounter modifier: help: +15, evade: 0, take: -15
    if (encounterChoice === 'help') alignmentScore += 15;
    else if (encounterChoice === 'take') alignmentScore -= 15;

    // Role bias
    if (role?.id === 'archivist') alignmentScore += 10;
    if (role?.id === 'infiltrator') alignmentScore -= 10;

    // Calculate entropy & risk
    const entropyIndex = Math.round((chaos * 0.6) + (intensity * 0.4));
    const riskFactor = Math.min(100, Math.round(
      (artifactDecision === 'destroy' ? 45 : artifactDecision === 'control' ? 30 : 10) +
      (chaos * 0.35) +
      (challengeResult === 'failure' ? 20 : 0)
    ));

    const curiosityFactor = Math.min(100, Math.round(
      (discoveredObjects.length * 20) +
      (inventory.length * 15) +
      (trait?.id === 'hyperfocused' ? 25 : 15)
    ));

    const resonanceRating = Math.max(10, Math.min(100, Math.round(
      (artifactDecision === 'save' ? 85 : artifactDecision === 'control' ? 50 : 25) +
      (challengeScore * 0.2) +
      (mood === 'serene' ? 15 : mood === 'apocalyptic' ? -15 : 0)
    )));

    // Outcome Archetype title
    let outcomeArchetype = 'The Boundary Shaper';
    if (artifactDecision === 'save' && finalDecision === 'stay') {
      outcomeArchetype = 'The Eternal Sentinel';
    } else if (artifactDecision === 'save' && finalDecision === 'escape') {
      outcomeArchetype = 'The Transcendent Architect';
    } else if (artifactDecision === 'control' && finalDecision === 'stay') {
      outcomeArchetype = 'The Singularity Overlord';
    } else if (artifactDecision === 'control' && finalDecision === 'escape') {
      outcomeArchetype = 'The Rogue Anomaly';
    } else if (artifactDecision === 'destroy' && finalDecision === 'escape') {
      outcomeArchetype = 'The Void Wanderer';
    } else if (artifactDecision === 'destroy' && finalDecision === 'stay') {
      outcomeArchetype = 'The Ash Sovereign';
    }

    return {
      archetype: outcomeArchetype,
      alignment: alignmentScore > 20 ? 'Order & Harmony' : alignmentScore < -20 ? 'Entropy & Ruin' : 'Dynamic Flux',
      entropyIndex,
      riskFactor,
      curiosityFactor,
      resonanceRating,
      isSecretUnlocked: discoveredObjects.includes('unknown_signal') || discoveredObjects.includes('secret_beacon'),
    };
  },

  /**
   * M26: Generates the structured World DNA signature
   */
  generateWorldDNA(state) {
    const analysis = this.evaluateOutcome(state);
    const worldCode = state.world?.id ? state.world.id.substring(0, 3).toUpperCase() : 'CYB';
    const moodCode = state.mood ? state.mood.substring(0, 3).toUpperCase() : 'MYS';
    const artCode = state.artifactDecision ? state.artifactDecision.substring(0, 3).toUpperCase() : 'SAV';
    const finCode = state.finalDecision ? state.finalDecision.substring(0, 3).toUpperCase() : 'ESC';
    const hash = `ALT::${worldCode}-${moodCode}-${artCode}-${finCode}-${analysis.entropyIndex}`;

    return {
      dnaHash: hash,
      metrics: [
        { label: 'World Affinity', value: `${state.world?.name || 'Standard'}`, percent: 90, color: 'cyan' },
        { label: 'Entropy Index', value: `${analysis.entropyIndex}%`, percent: analysis.entropyIndex, color: 'purple' },
        { label: 'Risk Vector', value: `${analysis.riskFactor}%`, percent: analysis.riskFactor, color: 'amber' },
        { label: 'Curiosity Rating', value: `${analysis.curiosityFactor}%`, percent: analysis.curiosityFactor, color: 'emerald' },
        { label: 'Reality Resonance', value: `${analysis.resonanceRating}%`, percent: analysis.resonanceRating, color: 'blue' }
      ],
      keyChoices: [
        { title: 'World Chosen', value: state.world?.name || 'Cyber City' },
        { title: 'Role & Trait', value: `${state.role?.name || 'Operative'} (${state.trait?.name || 'Curious'})` },
        { title: 'Entity Encounter', value: (state.encounterChoice || 'help').toUpperCase() },
        { title: 'Artifact Fate', value: (state.artifactDecision || 'save').toUpperCase() },
        { title: 'Challenge Result', value: (state.challengeResult || 'success').toUpperCase() },
        { title: 'Gateway Convergence', value: (state.finalDecision || 'escape').toUpperCase() }
      ],
      easterEggDiscovered: analysis.isSecretUnlocked
    };
  }
};
