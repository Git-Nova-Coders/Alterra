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
import RoleTraitSelection from './components/RoleTraitSelection';
import ExplorationScene from './components/ExplorationScene';
import EncounterScene from './components/EncounterScene';
import ArtifactDiscovery from './components/ArtifactDiscovery';
import ArtifactDecision from './components/ArtifactDecision';
import WorldReaction from './components/WorldReaction';
import MiniGame from './components/MiniGame';
import FinalDecision from './components/FinalDecision';
import AIEndingScene from './components/AIEndingScene';
import RealitySummary from './components/RealitySummary';
import CinematicJourneyRecap from './components/CinematicJourneyRecap';
import DarkAwakeningScene from './game/DarkAwakeningScene';
import NexusGatesScene from './game/NexusGatesScene';
import VoidManifestationScene from './game/VoidManifestationScene';
import { Shield, Sparkles, Compass, Terminal, Cpu, Flame, Target } from 'lucide-react';

export default function App() {
  const { state, setStage, selectWorld } = useGameState();
  const { currentStage, atmosphere, mood, intensity, world } = state;

  // Dynamic atmospheric visual filter calculated by VisualService
  const visualStyle = VisualService.getAtmosphericFilter(atmosphere, mood, intensity);

  // Router matching SDD state machine
  const renderCurrentStage = () => {
    switch (currentStage) {
      case GAME_STAGES.AWAKENING:
        return <DarkAwakeningScene onAwakened={() => setStage(GAME_STAGES.WORLD_SELECT)} />;

      case GAME_STAGES.LANDING:
        return <Landing />;

      case GAME_STAGES.WORLD_SELECT:
        return (
          <NexusGatesScene
            onSelectWorld={(chosenWorld) => {
              selectWorld(chosenWorld);
              setStage(GAME_STAGES.VOID_MANIFESTATION);
            }}
          />
        );

      case GAME_STAGES.VOID_MANIFESTATION:
        return (
          <VoidManifestationScene
            world={world}
            onWorldManifested={() => setStage(GAME_STAGES.EXPLORATION)}
          />
        );

      case GAME_STAGES.WORLD_DIRECTOR:
        return <WorldDirector />;

      case GAME_STAGES.MORPHING:
        return <MorphTransition />;

      case GAME_STAGES.WORLD_READY:
        return <RoleTraitSelection />;

      case GAME_STAGES.ROLE_SELECT:
        return <RoleTraitSelection />;

      case GAME_STAGES.TRAIT_SELECT:
        return <RoleTraitSelection />;

      case GAME_STAGES.EXPLORATION:
        return <ExplorationScene />;

      case GAME_STAGES.ENCOUNTER:
        return <EncounterScene />;

      case GAME_STAGES.CONSEQUENCE:
        return <EncounterScene />;

      case GAME_STAGES.ARTIFACT:
        return <ArtifactDiscovery />;

      case GAME_STAGES.ARTIFACT_DECISION:
        return <ArtifactDecision />;

      case GAME_STAGES.WORLD_REACTION:
        return <WorldReaction />;

      case GAME_STAGES.MINI_CHALLENGE:
        return <MiniGame />;

      case GAME_STAGES.FINAL_DECISION:
        return <FinalDecision />;

      case GAME_STAGES.AI_ENDING:
        return <AIEndingScene />;

      case GAME_STAGES.RESULT:
        return <CinematicJourneyRecap />;

      case GAME_STAGES.REPLAY:
        return <CinematicJourneyRecap />;

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
