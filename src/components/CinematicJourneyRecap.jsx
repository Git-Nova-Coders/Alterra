import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { DecisionEngine } from '../utils/decisionEngine';
import {
  Compass,
  Sparkles,
  Shield,
  Zap,
  Activity,
  Key,
  Cpu,
  Flame,
  DoorOpen,
  Anchor,
  RefreshCw,
  HeartHandshake,
  EyeOff,
  Grab,
  Radio,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function CinematicJourneyRecap() {
  const { state, setStage, resetGame } = useGameState();

  // Sequence state: 1 (World) -> 2 (Choice) -> 3 (Artifact) -> 4 (Artifact Decision) -> 5 (World Transformation) -> 6 (Challenge) -> 7 (Final Decision) -> 8 (Final Reality & World DNA)
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // Extract structured journey data from state
  const world = state.world || {
    id: 'cyber',
    name: 'Neo-Kowloon 2099',
    theme: 'digital',
    artifact: 'Quantum Core',
    previewVisual: 'linear-gradient(135deg, #091a28 0%, #032b44 50%, #081220 100%)'
  };

  const roleCode = state.role?.codeName || (state.role?.id === 'archivist' ? 'EXPLORER' : state.role?.id === 'synthesizer' ? 'GUARDIAN' : 'HACKER');
  const traitCode = state.trait?.codeName || (state.trait?.id === 'daring' ? 'BRAVE' : state.trait?.id === 'harmonic' ? 'CAUTIOUS' : 'CURIOUS');

  const encounterChoice = (state.encounterChoice || 'help').toUpperCase(); // HELP | HIDE | TAKE
  const artifactName = world.artifact || 'Quantum Core';
  const artifactDecision = (state.artifactDecision || 'save').toUpperCase(); // SAVE | CONTROL | DESTROY
  const challengeResult = state.challengeResult || 'success';
  const challengeScore = state.challengeScore || (challengeResult === 'success' ? 92 : 45);
  const finalDecision = (state.finalDecision || 'stay').toUpperCase(); // ESCAPE | STAY

  // Derived World DNA and analysis
  const dna = DecisionEngine.generateWorldDNA(state);
  const outcome = DecisionEngine.evaluateOutcome(state);

  // Scene timing configuration in milliseconds (targeting ~16-18s total)
  // Scene 1: 2200ms
  // Scene 2: 2000ms
  // Scene 3: 2000ms
  // Scene 4: 2000ms
  // Scene 5: 3500ms
  // Scene 6: 1800ms
  // Scene 7: 2200ms
  // Scene 8: Final reality view (stays active)
  useEffect(() => {
    if (!isPlaying) return;

    let timeout;
    if (currentScene === 1) {
      AudioService.playTone(320, 'sine', 0.8, 0.15, 640);
      timeout = setTimeout(() => setCurrentScene(2), 2400);
    } else if (currentScene === 2) {
      AudioService.playDiscovery();
      timeout = setTimeout(() => setCurrentScene(3), 2200);
    } else if (currentScene === 3) {
      AudioService.playArtifactAwaken();
      timeout = setTimeout(() => setCurrentScene(4), 2200);
    } else if (currentScene === 4) {
      AudioService.playTone(440, 'triangle', 0.6, 0.18, 220);
      timeout = setTimeout(() => setCurrentScene(5), 2200);
    } else if (currentScene === 5) {
      AudioService.playWorldReaction(artifactDecision.toLowerCase());
      timeout = setTimeout(() => setCurrentScene(6), 3600);
    } else if (currentScene === 6) {
      if (challengeResult === 'success') AudioService.playSuccess();
      else AudioService.playFailure();
      timeout = setTimeout(() => setCurrentScene(7), 2000);
    } else if (currentScene === 7) {
      AudioService.playTone(finalDecision === 'ESCAPE' ? 880 : 330, 'sine', 1.0, 0.2);
      timeout = setTimeout(() => {
        setCurrentScene(8);
        setIsPlaying(false);
      }, 2400);
    }

    return () => clearTimeout(timeout);
  }, [currentScene, isPlaying, artifactDecision, challengeResult, finalDecision]);

  const handleReplayJourney = () => {
    AudioService.playClick();
    setCurrentScene(1);
    setIsPlaying(true);
  };

  const handlePlayAgain = () => {
    AudioService.playClick();
    resetGame();
    setStage(GAME_STAGES.WORLD_SELECT);
  };

  const handleSkipToFinal = () => {
    AudioService.playClick();
    setIsPlaying(false);
    setCurrentScene(8);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between max-w-6xl mx-auto px-4 py-6">
      {/* Top Cinematic Bar & Timeline Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-cyber text-xs tracking-widest text-cyan-300 font-bold uppercase">
            CINEMATIC REALITY SYNTHESIS
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            SCENE {currentScene} / 8
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {currentScene < 8 && (
            <button
              onClick={handleSkipToFinal}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 transition-colors"
            >
              Skip to Reality DNA →
            </button>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-8 gap-1.5 mb-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx + 1 === currentScene
                ? 'bg-cyan-400 shadow-glow-cyan'
                : idx + 1 < currentScene
                ? 'bg-cyan-900/80'
                : 'bg-slate-900'
            }`}
          />
        ))}
      </div>

      {/* Cinematic Viewport (The Video-Like Window) */}
      <div className="relative flex-1 min-h-[440px] sm:min-h-[500px] cyber-panel rounded-3xl border-2 border-cyan-500/30 overflow-hidden flex items-center justify-center p-6 sm:p-12 shadow-2xl">
        <AnimatePresence mode="wait">
          {/* ========================================================
              SCENE 1 — WORLD CREATED (2-3 sec)
              ======================================================== */}
          {currentScene === 1 && (
            <motion.div
              key="scene1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              {/* Camera zoom effect on background visual */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute inset-0 opacity-40"
                style={{ background: world.previewVisual }}
              />
              <div className="absolute inset-0 bg-black/50" />

              <div className="relative z-10 space-y-4 max-w-xl">
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-500/40">
                  SCENE 1 // THE GENESIS WORLD
                </span>

                <h1 className="text-4xl sm:text-6xl font-cyber font-black tracking-wider text-white uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                  {world.name}
                </h1>

                <div className="flex items-center justify-center space-x-3 text-xs sm:text-sm font-mono text-cyan-300">
                  <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700">
                    ROLE: <strong>{roleCode}</strong>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700">
                    TRAIT: <strong>{traitCode}</strong>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto">
                  A unique simulated reality spawned under {state.mood.toUpperCase()} emotional shaders with {state.chaos}% quantum entropy.
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 2 — IMPORTANT NARRATIVE CHOICE (HELP / HIDE / TAKE)
              ======================================================== */}
          {currentScene === 2 && (
            <motion.div
              key="scene2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: world.previewVisual }}
              />
              <div className="absolute inset-0 bg-black/60" />

              <div className="relative z-10 space-y-5 max-w-lg">
                <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-500/40">
                  SCENE 2 // CRITICAL INTERACTION
                </span>

                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Faced with the crisis of an entrapped entity:
                </p>

                <div className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
                  {encounterChoice === 'HELP' && <HeartHandshake className="w-8 h-8 text-emerald-400" />}
                  {encounterChoice === 'HIDE' || encounterChoice === 'EVADE' ? <EyeOff className="w-8 h-8 text-cyan-400" /> : null}
                  {encounterChoice === 'TAKE' && <Grab className="w-8 h-8 text-amber-400" />}
                  <span className="text-3xl sm:text-4xl font-cyber font-black text-white tracking-wider">
                    [{encounterChoice === 'EVADE' ? 'HIDE' : encounterChoice}]
                  </span>
                </div>

                <p className="text-sm font-sans text-cyan-200">
                  {encounterChoice === 'HELP' && 'You chose empathy. Trust forged an unbreakable bond, uncovering the sanctum secret threshold.'}
                  {(encounterChoice === 'HIDE' || encounterChoice === 'EVADE') && 'You chose stealth. Slipping into shadows, you safeguarded your own passage.'}
                  {encounterChoice === 'TAKE' && 'You chose opportunism. Seizing raw power, you altered environmental stability.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 3 — ARTIFACT REVEAL
              ======================================================== */}
          {currentScene === 3 && (
            <motion.div
              key="scene3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="absolute inset-0 bg-radial-gradient from-cyan-900/40 via-black to-black" />

              <div className="relative z-10 space-y-6 max-w-lg">
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-500/40">
                  SCENE 3 // THE AWAKENED RELIC
                </span>

                {/* Animated Core Icon */}
                <div className="relative flex items-center justify-center mx-auto w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-3xl animate-ping" />
                  <div className="w-24 h-24 rounded-2xl border-2 border-cyan-400 bg-cyan-950/80 shadow-glow-cyan flex items-center justify-center transform rotate-45 animate-spin" style={{ animationDuration: '12s' }}>
                    {world.id === 'fantasy' ? (
                      <Sparkles className="w-10 h-10 text-emerald-300 transform -rotate-45" />
                    ) : world.id === 'mystery' ? (
                      <Key className="w-10 h-10 text-purple-300 transform -rotate-45" />
                    ) : (
                      <Cpu className="w-10 h-10 text-cyan-200 transform -rotate-45" />
                    )}
                  </div>
                </div>

                <h2 className="text-3xl sm:text-5xl font-cyber font-black tracking-wider text-white uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]">
                  {artifactName}
                </h2>

                <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase">
                  Ancient Resonance Fully Synchronized
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 4 — ARTIFACT DECISION (SAVE / CONTROL / DESTROY)
              ======================================================== */}
          {currentScene === 4 && (
            <motion.div
              key="scene4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="absolute inset-0 bg-black/70" />

              <div className="relative z-10 space-y-4 max-w-lg">
                <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 bg-slate-900/80 px-3.5 py-1 rounded-full border border-slate-700">
                  SCENE 4 // THE DEFINITIVE VECTOR
                </span>

                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  At the convergence of the artifact, you chose:
                </p>

                <div
                  className={`inline-block px-10 py-5 rounded-2xl border-2 text-4xl sm:text-5xl font-cyber font-black tracking-widest uppercase shadow-2xl ${
                    artifactDecision === 'SAVE'
                      ? 'border-emerald-400 bg-emerald-950/70 text-emerald-300 shadow-[0_0_45px_rgba(16,185,129,0.5)]'
                      : artifactDecision === 'CONTROL'
                      ? 'border-purple-400 bg-purple-950/70 text-purple-300 shadow-[0_0_45px_rgba(168,85,247,0.5)]'
                      : 'border-rose-500 bg-rose-950/70 text-rose-300 shadow-[0_0_45px_rgba(244,63,94,0.5)]'
                  }`}
                >
                  [{artifactDecision}]
                </div>

                <p className="text-sm font-sans text-slate-200">
                  {artifactDecision === 'SAVE' && 'Order, preservation, and stabilization decreed across reality.'}
                  {artifactDecision === 'CONTROL' && 'Overclocked dominance and kinetic submission forced upon the matrix.'}
                  {artifactDecision === 'DESTROY' && 'Shattered physical bonds, liberating pure raw entropy into the skybox.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 5 — WORLD TRANSFORMATION (PRIMARY WOW MOMENT)
              ======================================================== */}
          {currentScene === 5 && (
            <motion.div
              key="scene5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 overflow-hidden"
            >
              {/* SAVE TRANSFORMATION: Brilliant radiant emerald aura, floating particles, absolute calm */}
              {artifactDecision === 'SAVE' && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-emerald-500/20 to-transparent"
                  />
                  <div className="absolute inset-0">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: '-10%', opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute w-2 h-2 rounded-full bg-emerald-300 blur-[0.5px]"
                        style={{ left: `${(i * 5) % 100}%` }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* CONTROL TRANSFORMATION: Glitch RGB split, oscillating nodes, warning strobes */}
              {artifactDecision === 'CONTROL' && (
                <>
                  <div className="absolute inset-0 bg-purple-950/40 mix-blend-color-dodge animate-pulse" />
                  <div className="absolute inset-0 scanline opacity-90" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        x: [0, (i % 2 === 0 ? 40 : -40), 0],
                        y: [0, -30, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute w-8 h-8 rounded border border-purple-400 bg-purple-900/60 flex items-center justify-center font-mono text-[9px] text-purple-200"
                      style={{ top: `${(i * 12) + 10}%`, left: `${(i * 14) + 5}%` }}
                    >
                      FLUX
                    </motion.div>
                  ))}
                </>
              )}

              {/* DESTROY TRANSFORMATION: Visceral screen shake, cracks, falling embers */}
              {artifactDecision === 'DESTROY' && (
                <>
                  <motion.div
                    animate={{ x: [-5, 5, -3, 3, 0], y: [3, -3, 2, -2, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    className="absolute inset-0 bg-rose-950/40"
                  />
                  {/* Procedural cracks */}
                  <div className="absolute top-1/4 left-10 right-10 h-[2px] bg-rose-500 shadow-[0_0_20px_#f43f5e] transform -rotate-6" />
                  <div className="absolute top-2/3 left-20 right-20 h-[2px] bg-amber-400 shadow-[0_0_20px_#f59e0b] transform rotate-12" />
                  {/* Falling embers */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: '-10%', opacity: 0 }}
                        animate={{ y: '110%', opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }}
                        className="absolute w-2 h-2 rounded-full bg-gradient-to-b from-amber-400 to-rose-600"
                        style={{ left: `${(i * 4.2) % 100}%` }}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="relative z-10 space-y-4 max-w-xl bg-black/60 p-8 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400">
                  SCENE 5 // VISUAL WORLD TRANSFORMATION
                </span>

                <h2 className="text-3xl sm:text-5xl font-cyber font-black text-white uppercase tracking-wider">
                  {artifactDecision === 'SAVE' && 'THE STABILIZED REALITY'}
                  {artifactDecision === 'CONTROL' && 'THE OVERCLOCKED DOMAIN'}
                  {artifactDecision === 'DESTROY' && 'THE COLLAPSING HORIZON'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                  {artifactDecision === 'SAVE' && 'The ecosystem stabilized into crystalline order. Ambient light intensified as calm harmonic particles cleansed the atmosphere.'}
                  {artifactDecision === 'CONTROL' && 'Data pulses and chromatic glitches surge through the landscape. Kinetic structures warp to obey your overclocked sovereignty.'}
                  {artifactDecision === 'DESTROY' && 'Seismic ruptures split the world open. Geometry unraveled in fire and falling embers, blowing open an emergency breach portal!'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 6 — CHALLENGE RESULT
              ======================================================== */}
          {currentScene === 6 && (
            <motion.div
              key="scene6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="absolute inset-0 bg-black/60" />

              <div className="relative z-10 space-y-4 max-w-md">
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-500/40">
                  SCENE 6 // NEURAL OVERCLOCK EVALUATION
                </span>

                <h3 className="text-2xl sm:text-3xl font-cyber font-bold text-white uppercase">
                  CHALLENGE {challengeResult === 'success' ? 'STABILIZED' : 'OVERLOADED'}
                </h3>

                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-cyan-400 bg-slate-900 shadow-glow-cyan text-3xl font-cyber font-black text-white">
                  {challengeScore}%
                </div>

                <p className="text-xs font-mono text-cyan-300">
                  {challengeResult === 'success'
                    ? '✔ Resonance 100% synchronized — maximum outcome clarity unlocked.'
                    : '⚠ Dimensional turbulence recorded — unpredictable flux vector applied.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 7 — FINAL GATEWAY CONVERGENCE (ESCAPE vs STAY)
              ======================================================== */}
          {currentScene === 7 && (
            <motion.div
              key="scene7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="absolute inset-0 bg-black/70" />

              <div className="relative z-10 space-y-5 max-w-lg">
                <span className="text-[11px] font-mono tracking-widest uppercase text-purple-400 bg-purple-950/80 px-3.5 py-1 rounded-full border border-purple-500/40">
                  SCENE 7 // GATEWAY CONVERGENCE
                </span>

                <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white uppercase">
                  THE GATEWAY OPENS
                </h2>

                <div className="flex items-center justify-center space-x-6">
                  <div
                    className={`px-6 py-4 rounded-xl border-2 font-cyber font-black text-xl transition-all ${
                      finalDecision === 'ESCAPE'
                        ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-glow-cyan scale-110'
                        : 'border-slate-800 bg-slate-950/60 text-slate-600 opacity-40'
                    }`}
                  >
                    <DoorOpen className="w-6 h-6 mx-auto mb-1" />
                    [ESCAPE]
                  </div>

                  <div
                    className={`px-6 py-4 rounded-xl border-2 font-cyber font-black text-xl transition-all ${
                      finalDecision === 'STAY'
                        ? 'border-purple-400 bg-purple-950/90 text-purple-300 shadow-glow-purple scale-110'
                        : 'border-slate-800 bg-slate-950/60 text-slate-600 opacity-40'
                    }`}
                  >
                    <Anchor className="w-6 h-6 mx-auto mb-1" />
                    [STAY]
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-sans text-slate-300">
                  {finalDecision === 'ESCAPE'
                    ? 'You stepped through the dimensional threshold into the infinite multiverse.'
                    : 'You anchored your consciousness here, claiming eternal dominion over this world.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 8 — FINAL REALITY & WORLD DNA DOSSIER
              ======================================================== */}
          {currentScene === 8 && (
            <motion.div
              key="scene8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
            >
              {/* Dynamic transformed backdrop based on actual journey choices */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{ background: world.previewVisual }}
              />
              <div className="absolute inset-0 bg-black/60 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/90 pb-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 block">
                      FINAL SYNTHESIZED REALITY // ARCHIVE 2026
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-cyber font-black text-white uppercase tracking-wider">
                      {outcome.archetype}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">Genome Signature</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">{dna.dnaHash}</span>
                  </div>
                </div>

                {/* AI Ending Narrative Recap */}
                <div className="p-5 rounded-2xl bg-black/70 border border-cyan-500/30">
                  <p className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed italic">
                    "{state.aiEnding?.epilogue || `As the ${state.role?.name || roleCode}, you ${artifactDecision.toLowerCase()}ed the ${artifactName} and chose to ${finalDecision.toLowerCase()}. Reality stabilized along a unique quantum trajectory.`}"
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                    <span>Alignment: <strong className="text-cyan-300">{outcome.alignment}</strong></span>
                    <span>Resonance: <strong className="text-purple-300">{outcome.resonanceRating}%</strong></span>
                  </div>
                </div>

                {/* Compact World DNA Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">World</span>
                    <span className="text-white font-bold">{world.name.split(' ')[0]}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Role & Trait</span>
                    <span className="text-cyan-300 font-bold">{roleCode} / {traitCode}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Choice</span>
                    <span className="text-amber-300 font-bold">{encounterChoice}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Artifact & Final</span>
                    <span className="text-purple-300 font-bold">{artifactDecision} → {finalDecision}</span>
                  </div>
                </div>

                {/* Optional Easter Egg */}
                {dna.easterEggDiscovered && (
                  <div className="p-3 rounded-xl border border-purple-500/40 bg-purple-950/30 text-xs font-mono text-purple-300 flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Secret Discovered: "This reality remembers choices you haven't made yet."</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: REPLAY JOURNEY vs PLAY AGAIN */}
              <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReplayJourney}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Replay Journey</span>
                </button>

                <button
                  onClick={handlePlayAgain}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-400 transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Play Again (New Reality)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
