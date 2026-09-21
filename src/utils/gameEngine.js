/**
 * Alterra Game Engine Utilities
 * Validates state transitions and calculates game outcomes
 */

import { GAME_STAGES, STAGE_FLOW_ORDER } from '../data/gameState.js';

export const GameEngine = {
  /**
   * Returns the next canonical stage in the progression
   */
  getNextStage(currentStage) {
    const currentIndex = STAGE_FLOW_ORDER.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < STAGE_FLOW_ORDER.length - 1) {
      return STAGE_FLOW_ORDER[currentIndex + 1];
    }
    return currentStage;
  },

  /**
   * Returns the previous stage
   */
  getPreviousStage(currentStage) {
    const currentIndex = STAGE_FLOW_ORDER.indexOf(currentStage);
    if (currentIndex > 0) {
      return STAGE_FLOW_ORDER[currentIndex - 1];
    }
    return currentStage;
  },

  /**
   * Generates a unique "World DNA" signature hash based on all player selections
   */
  generateWorldDNA(state) {
    const worldCode = state.world?.id || 'VOID';
    const moodCode = (state.mood || 'UNK').substring(0, 3).toUpperCase();
    const roleCode = state.role?.id ? state.role.id.substring(0, 3).toUpperCase() : 'NON';
    const statCode = `${state.intensity || 50}-${state.chaos || 50}`;
    return `ALT-${worldCode.toUpperCase()}-${moodCode}-${roleCode}-${statCode}`;
  }
};
