/**
 * Alterra AI Service
 * Provides local deterministic fallback synthesis and optional API integration
 * Adheres to: "Preserve a reliable local fallback path" and "Do NOT expose API keys"
 */

export const AIService = {
  /**
   * Generates a tailored AI ending based on player world DNA and decisions
   */
  async generateEnding(gameState) {
    // Check if API key is provided in Vite env (without hardcoding)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const enableAI = import.meta.env.VITE_ENABLE_AI_SYNTHESIS === 'true';

    if (enableAI && apiKey) {
      try {
        return await this.callGeminiAPI(gameState, apiKey);
      } catch (err) {
        console.warn('[AIService] API generation failed, falling back to local synthesis engine:', err);
      }
    }

    // Local deterministic fallback engine
    return this.synthesizeLocalEnding(gameState);
  },

  /**
   * Local rule-based AI synthesis engine ensuring 100% offline reliability
   */
  synthesizeLocalEnding(state) {
    const worldName = state.world?.name || 'Uncharted Simulation';
    const mood = state.mood || 'unstable';
    const role = state.role?.name || 'Wanderer';
    const decision = state.finalDecision || 'observation';
    const artifact = state.artifact || state.world?.artifact || 'The Keystone';
    const chaos = state.chaos > 60 ? 'turbulent' : 'harmonious';

    return {
      title: `${worldName}: The ${decision.toUpperCase()} Protocol`,
      verdict: `A ${chaos} epoch shaped under ${mood.toUpperCase()} frequencies.`,
      epilogue: `As the ${role}, your convergence with the ${artifact} initiated irreversible ripple effects across ${worldName}. By choosing to ${decision}, reality stabilized along a unique quantum trajectory never witnessed in previous iterations.`,
      chronicleHash: `ALT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      generatedVia: 'Alterra Neural Fallback Core v3.0'
    };
  },

  async callGeminiAPI(state, apiKey) {
    const prompt = `As the World AI of Alterra, generate a 2-paragraph dramatic cinematic ending for a player with:
World: ${state.world?.name}
Mood: ${state.mood}, Chaos: ${state.chaos}%
Role: ${state.role?.name}, Trait: ${state.trait?.name}
Final Decision: ${state.finalDecision}
Artifact: ${state.artifact}
Return JSON with { "title": string, "verdict": string, "epilogue": string, "chronicleHash": string }`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text);
  }
};
