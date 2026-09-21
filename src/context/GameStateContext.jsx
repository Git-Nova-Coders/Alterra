/**
 * GameState Context & Reducer
 * Centralized game state management for Alterra Phase 1 & onwards
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { INITIAL_GAME_STATE, GAME_STAGES, STAGE_FLOW_ORDER } from '../data/gameState';
import { WORLDS } from '../data/worlds';

const GameStateContext = createContext(null);

// Action Types
export const GAME_ACTIONS = {
  SET_STAGE: 'SET_STAGE',
  NEXT_STAGE: 'NEXT_STAGE',
  PREV_STAGE: 'PREV_STAGE',
  SELECT_WORLD: 'SELECT_WORLD',
  UPDATE_WORLD_DIRECTOR: 'UPDATE_WORLD_DIRECTOR',
  SELECT_ROLE: 'SELECT_ROLE',
  SELECT_TRAIT: 'SELECT_TRAIT',
  ADD_INVENTORY_ITEM: 'ADD_INVENTORY_ITEM',
  RECORD_DISCOVERED_OBJECT: 'RECORD_DISCOVERED_OBJECT',
  SET_ENCOUNTER_CHOICE: 'SET_ENCOUNTER_CHOICE',
  SET_ARTIFACT: 'SET_ARTIFACT',
  SET_ARTIFACT_DECISION: 'SET_ARTIFACT_DECISION',
  SET_CHALLENGE_SCORE: 'SET_CHALLENGE_SCORE',
  SET_FINAL_DECISION: 'SET_FINAL_DECISION',
  SET_AI_ENDING: 'SET_AI_ENDING',
  SET_GENERATING_AI: 'SET_GENERATING_AI',
  RESET_GAME: 'RESET_GAME',
  LOAD_STATE: 'LOAD_STATE'
};

function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.SET_STAGE: {
      const targetStage = action.payload;
      if (!Object.values(GAME_STAGES).includes(targetStage)) return state;
      return {
        ...state,
        currentStage: targetStage,
        history: [...state.history, targetStage]
      };
    }

    case GAME_ACTIONS.NEXT_STAGE: {
      const currentIndex = STAGE_FLOW_ORDER.indexOf(state.currentStage);
      if (currentIndex >= 0 && currentIndex < STAGE_FLOW_ORDER.length - 1) {
        const next = STAGE_FLOW_ORDER[currentIndex + 1];
        return {
          ...state,
          currentStage: next,
          history: [...state.history, next]
        };
      }
      return state;
    }

    case GAME_ACTIONS.PREV_STAGE: {
      const currentIndex = STAGE_FLOW_ORDER.indexOf(state.currentStage);
      if (currentIndex > 0) {
        const prev = STAGE_FLOW_ORDER[currentIndex - 1];
        return {
          ...state,
          currentStage: prev,
          history: [...state.history, prev]
        };
      }
      return state;
    }

    case GAME_ACTIONS.SELECT_WORLD: {
      const worldData = typeof action.payload === 'string' ? WORLDS[action.payload] : action.payload;
      return {
        ...state,
        world: worldData,
        // Adopt default world atmosphere/intensity if not customized
        intensity: worldData?.defaultIntensity ?? state.intensity,
        chaos: worldData?.defaultChaos ?? state.chaos,
        atmosphere: worldData?.initialAtmosphere ?? state.atmosphere,
        artifact: worldData?.artifact ?? state.artifact
      };
    }

    case GAME_ACTIONS.UPDATE_WORLD_DIRECTOR: {
      const { mood, intensity, chaos, atmosphere } = action.payload;
      return {
        ...state,
        ...(mood !== undefined && { mood }),
        ...(intensity !== undefined && { intensity }),
        ...(chaos !== undefined && { chaos }),
        ...(atmosphere !== undefined && { atmosphere }),
      };
    }

    case GAME_ACTIONS.SELECT_ROLE:
      return { ...state, role: action.payload };

    case GAME_ACTIONS.SELECT_TRAIT:
      return { ...state, trait: action.payload };

    case GAME_ACTIONS.ADD_INVENTORY_ITEM:
      if (state.inventory.some(item => item.id === action.payload.id)) return state;
      return { ...state, inventory: [...state.inventory, action.payload] };

    case GAME_ACTIONS.RECORD_DISCOVERED_OBJECT:
      if (state.discoveredObjects.includes(action.payload)) return state;
      return { ...state, discoveredObjects: [...state.discoveredObjects, action.payload] };

    case GAME_ACTIONS.SET_ENCOUNTER_CHOICE:
      return { ...state, encounterChoice: action.payload };

    case GAME_ACTIONS.SET_ARTIFACT:
      return { ...state, artifact: action.payload };

    case GAME_ACTIONS.SET_ARTIFACT_DECISION:
      return { ...state, artifactDecision: action.payload };

    case GAME_ACTIONS.SET_CHALLENGE_SCORE:
      return {
        ...state,
        challengeScore: action.payload.score,
        challengeResult: action.payload.result
      };

    case GAME_ACTIONS.SET_FINAL_DECISION:
      return {
        ...state,
        finalDecision: action.payload.decision,
        endingType: action.payload.endingType
      };

    case GAME_ACTIONS.SET_AI_ENDING:
      return {
        ...state,
        aiEnding: action.payload,
        isGeneratingAI: false
      };

    case GAME_ACTIONS.SET_GENERATING_AI:
      return { ...state, isGeneratingAI: action.payload };

    case GAME_ACTIONS.RESET_GAME:
      return {
        ...INITIAL_GAME_STATE,
        history: [GAME_STAGES.LANDING]
      };

    case GAME_ACTIONS.LOAD_STATE:
      return { ...action.payload };

    default:
      return state;
  }
}

export function GameStateProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

  // Convenient Dispatch Helpers
  const setStage = (stage) => dispatch({ type: GAME_ACTIONS.SET_STAGE, payload: stage });
  const nextStage = () => dispatch({ type: GAME_ACTIONS.NEXT_STAGE });
  const prevStage = () => dispatch({ type: GAME_ACTIONS.PREV_STAGE });
  const selectWorld = (world) => dispatch({ type: GAME_ACTIONS.SELECT_WORLD, payload: world });
  const updateWorldDirector = (params) => dispatch({ type: GAME_ACTIONS.UPDATE_WORLD_DIRECTOR, payload: params });
  const selectRole = (role) => dispatch({ type: GAME_ACTIONS.SELECT_ROLE, payload: role });
  const selectTrait = (trait) => dispatch({ type: GAME_ACTIONS.SELECT_TRAIT, payload: trait });
  const resetGame = () => dispatch({ type: GAME_ACTIONS.RESET_GAME });

  const value = {
    state,
    dispatch,
    setStage,
    nextStage,
    prevStage,
    selectWorld,
    updateWorldDirector,
    selectRole,
    selectTrait,
    resetGame
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
