import { useGameState } from './context/GameStateContext';
import { GAME_STAGES } from './data/gameState';
import { VisualService } from './services/visualService';
import HUD from './components/HUD';
import StageNavigator from './components/StageNavigator';
import Landing from './components/Landing';
import WorldSelection from './components/WorldSelection';
import WorldDirector from './components/WorldDirector';
import MorphTransition from './components/MorphTransition';
import GenericStageViewer from './components/GenericStageViewer';
import { Shield, Sparkles, Compass, Terminal, Cpu, Flame, Target } from 'lucide-react';

export default function App() {
  const { state } = useGameState();
  const { currentStage, atmosphere, mood, intensity } = state;

  // Dynamic atmospheric visual filter calculated by VisualService
  const visualStyle = VisualService.getAtmosphericFilter(atmosphere, mood, intensity);

  // Router matching SDD state machine
  const renderCurrentStage = () => {
    switch (currentStage) {
      case GAME_STAGES.LANDING:
        return <Landing />;

      case GAME_STAGES.WORLD_SELECT:
        return <WorldSelection />;

      case GAME_STAGES.WORLD_DIRECTOR:
        return <WorldDirector />;

      case GAME_STAGES.MORPHING:
        return <MorphTransition />;

      case GAME_STAGES.WORLD_READY:
        return (
          <GenericStageViewer
            stageName="WORLD READY"
            title="SIMULATION BOUNDARIES INITIALIZED"
            description="The world environment has compiled. Prepare to select your character archetype and operational trait."
            nextStageName={GAME_STAGES.ROLE_SELECT}
            icon={Compass}
          />
        );

      case GAME_STAGES.ROLE_SELECT:
        return (
          <GenericStageViewer
            stageName="ROLE SELECTION"
            title="CONSCIOUSNESS AVATAR ALIGNMENT"
            description="Foundation prepared for Phase 2: Infiltrator, Archivist, or Synthesizer role selection."
            nextStageName={GAME_STAGES.TRAIT_SELECT}
            icon={Shield}
          />
        );

      case GAME_STAGES.TRAIT_SELECT:
        return (
          <GenericStageViewer
            stageName="TRAIT SELECTION"
            title="ATTUNE PRIMARY OPERATIONAL TRAIT"
            description="Foundation prepared for Phase 2: Hyper-Vigilance, Resonant Attunement, or Overclocked Reflexes."
            nextStageName={GAME_STAGES.EXPLORATION}
            icon={Sparkles}
          />
        );

      case GAME_STAGES.EXPLORATION:
        return (
          <GenericStageViewer
            stageName="EXPLORATION"
            title="SECTOR EXPLORATION & OBJECT DISCOVERY"
            description="Phase 2 hook: Interactive objects, sensory clues, and dynamic environmental discovery."
            nextStageName={GAME_STAGES.ENCOUNTER}
            icon={Compass}
          />
        );

      case GAME_STAGES.ENCOUNTER:
        return (
          <GenericStageViewer
            stageName="ENCOUNTER"
            title="CRITICAL ENTITY INTERACTION"
            description="Phase 2 hook: Entity confrontation, dialogue branching, and world consequence engine."
            nextStageName={GAME_STAGES.CONSEQUENCE}
            icon={Flame}
          />
        );

      case GAME_STAGES.CONSEQUENCE:
        return (
          <GenericStageViewer
            stageName="CONSEQUENCE"
            title="LOCAL REALITY PERTURBATION"
            description="Consequence evaluation: The world alters state and unlocks the ancient artifact sanctum."
            nextStageName={GAME_STAGES.ARTIFACT}
            icon={Terminal}
          />
        );

      case GAME_STAGES.ARTIFACT:
        return (
          <GenericStageViewer
            stageName="ARTIFACT DISCOVERY"
            title="ANOMALOUS RELIC UNCOVERED"
            description={`Sanctum breached. Found relic: ${state.world?.artifact || 'Keystone of Origin'}.`}
            nextStageName={GAME_STAGES.ARTIFACT_DECISION}
            icon={Cpu}
          />
        );

      case GAME_STAGES.ARTIFACT_DECISION:
        return (
          <GenericStageViewer
            stageName="ARTIFACT DECISION"
            title="CHOOSE RELIC HARMONIZATION"
            description="Make your decision: Preserve the anomaly, commune with its signal, or consume its energy."
            nextStageName={GAME_STAGES.WORLD_REACTION}
            icon={Target}
          />
        );

      case GAME_STAGES.WORLD_REACTION:
        return (
          <GenericStageViewer
            stageName="WORLD REACTION"
            title="BIOME RESPONSIVE TRANSFORMATION"
            description="Watch the environment shift shaders, light arrays, and soundscapes based on your decision."
            nextStageName={GAME_STAGES.MINI_CHALLENGE}
            icon={Sparkles}
          />
        );

      case GAME_STAGES.MINI_CHALLENGE:
        return (
          <GenericStageViewer
            stageName="MINI CHALLENGE"
            title="NEURAL OVERCLOCK MINI-CHALLENGE"
            description="Timed node-deflection challenge to stabilize the regional reality matrix."
            nextStageName={GAME_STAGES.FINAL_DECISION}
            icon={Cpu}
          />
        );

      case GAME_STAGES.FINAL_DECISION:
        return (
          <GenericStageViewer
            stageName="FINAL DECISION"
            title="ULTIMATE CONVERGENCE CHOICE"
            description="Choose your final stance: Ascend beyond the simulation, stabilize the world, or trigger divergence."
            nextStageName={GAME_STAGES.AI_ENDING}
            icon={Target}
          />
        );

      case GAME_STAGES.AI_ENDING:
        return (
          <GenericStageViewer
            stageName="AI ENDING SYNTHESIS"
            title="NEURAL CHRONICLE COMPILATION"
            description="The AI service digests your choices, chaos rating, and artifact fate into a unique destiny."
            nextStageName={GAME_STAGES.RESULT}
            icon={Terminal}
          />
        );

      case GAME_STAGES.RESULT:
        return (
          <GenericStageViewer
            stageName="RESULT"
            title="FINAL REALITY CHRONICLE"
            description="View your World DNA hash, historical choices, and personalized ending dossier."
            nextStageName={GAME_STAGES.REPLAY}
            icon={Compass}
          />
        );

      case GAME_STAGES.REPLAY:
        return (
          <GenericStageViewer
            stageName="REPLAY"
            title="TIMELINE RESET AVAILABLE"
            description="Forge a new reality with different parameters, archetypes, and moral vectors."
            nextStageName={GAME_STAGES.LANDING}
            icon={Sparkles}
          />
        );

      default:
        return <Landing />;
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col justify-between hud-grid-overlay selection:bg-cyan-500 selection:text-black"
      style={visualStyle}
    >
      {/* Top HUD bar */}
      <HUD />

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-28">
        {renderCurrentStage()}
      </main>

      {/* Bottom Stage Matrix Controller */}
      <StageNavigator />
    </div>
  );
}
