import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
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
  Radio
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
    iconEmoji: '🏙️',
    artifactEmoji: '🧊',
    artifact: 'Quantum Core',
    previewVisual: 'linear-gradient(135deg, #091a28 0%, #032b44 50%, #081220 100%)'
  };

  const worldEmoji = world.iconEmoji || (world.id === 'fantasy' ? '🌲' : world.id === 'mystery' ? '🛰️' : '🏙️');
  const artifactEmoji = world.artifactEmoji || (world.id === 'fantasy' ? '💚' : world.id === 'mystery' ? '🗝️' : '🧊');

  const roleCode = state.role?.codeName || (state.role?.id === 'archivist' ? 'EXPLORER' : state.role?.id === 'synthesizer' ? 'GUARDIAN' : 'HACKER');
  const roleEmoji = state.role?.emoji || (roleCode === 'EXPLORER' ? '🧭' : roleCode === 'GUARDIAN' ? '🛡️' : '⚡');

  const traitCode = state.trait?.codeName || (state.trait?.id === 'daring' ? 'BRAVE' : state.trait?.id === 'harmonic' ? 'CAUTIOUS' : 'CURIOUS');
  const traitEmoji = state.trait?.emoji || (traitCode === 'BRAVE' ? '⚔️' : traitCode === 'CAUTIOUS' ? '🌿' : '🔮');

  const rawEncounter = (state.encounterChoice || 'help').toLowerCase();
  const encounterChoice = rawEncounter === 'evade' ? 'HIDE' : rawEncounter.toUpperCase(); // HELP | HIDE | TAKE
  const encounterEmoji = encounterChoice === 'HELP' ? '🤝' : encounterChoice === 'HIDE' ? '👤' : '💎';

  const artifactName = world.artifact || 'Quantum Core';
  const artifactDecision = (state.artifactDecision || 'save').toUpperCase(); // SAVE | CONTROL | DESTROY
  const decisionEmoji = artifactDecision === 'SAVE' ? '🛡️' : artifactDecision === 'CONTROL' ? '⚡' : '💥';

  const challengeResult = state.challengeResult || 'success';
  const challengeScore = state.challengeScore || (challengeResult === 'success' ? 95 : 35);
  const challengeEmoji = challengeResult === 'success' ? '🎯' : '⚠️';

  const finalDecision = (state.finalDecision || 'stay').toUpperCase(); // ESCAPE | STAY
  const finalEmoji = finalDecision === 'ESCAPE' ? '🚀' : '🏰';

  // Derived World DNA and analysis
  const dna = DecisionEngine.generateWorldDNA(state);
  const outcome = DecisionEngine.evaluateOutcome(state);

  // Timing configuration in milliseconds (~16-18s total)
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
      {/* Top Bar with Emoji Scene Stepper */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-xl animate-pulse">🎬</span>
          <span className="font-cyber text-xs tracking-widest text-cyan-300 font-bold uppercase">
            VISUAL REALITY RECAP
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
            SCENE {currentScene} / 8
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {currentScene < 8 && (
            <button
              onClick={handleSkipToFinal}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 px-3 py-1 rounded bg-slate-900/80 border border-slate-700 transition-colors flex items-center space-x-1"
            >
              <span>Fast-Forward</span>
              <span>⏩</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Step Timeline */}
      <div className="flex items-center justify-between gap-1 mb-6 px-1">
        {[
          { num: 1, icon: worldEmoji },
          { num: 2, icon: encounterEmoji },
          { num: 3, icon: artifactEmoji },
          { num: 4, icon: decisionEmoji },
          { num: 5, icon: artifactDecision === 'SAVE' ? '✨' : artifactDecision === 'CONTROL' ? '⚡' : '💥' },
          { num: 6, icon: challengeEmoji },
          { num: 7, icon: finalEmoji },
          { num: 8, icon: '👑' }
        ].map((step) => (
          <div
            key={step.num}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${
              step.num === currentScene ? 'scale-110' : 'opacity-60'
            }`}
          >
            <div
              className={`h-1.5 w-full rounded-full transition-all ${
                step.num === currentScene
                  ? 'bg-cyan-400 shadow-glow-cyan'
                  : step.num < currentScene
                  ? 'bg-cyan-800'
                  : 'bg-slate-900'
              }`}
            />
            <span className="text-xs sm:text-base">{step.icon}</span>
          </div>
        ))}
      </div>

      {/* Cinematic Viewport */}
      <div className="relative flex-1 min-h-[440px] sm:min-h-[500px] cyber-panel rounded-3xl border-2 border-cyan-500/30 overflow-hidden flex items-center justify-center p-6 sm:p-12 shadow-2xl">
        <AnimatePresence mode="wait">
          {/* ========================================================
              SCENE 1 — WORLD CREATED (2-3 sec)
              ======================================================== */}
          {currentScene === 1 && (
            <motion.div
              key="scene1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              {/* Background with subtle zoom */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute inset-0 opacity-40"
                style={{ background: world.previewVisual }}
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 space-y-4 max-w-xl">
                {/* Hero Emoji Avatar */}
                <motion.div
                  initial={{ y: -20, scale: 0.8 }}
                  animate={{ y: 0, scale: 1 }}
                  className="text-6xl sm:text-8xl filter drop-shadow-[0_0_25px_rgba(0,240,255,0.4)] mb-2"
                >
                  {worldEmoji}
                </motion.div>

                <h1 className="text-3xl sm:text-5xl font-cyber font-black tracking-wider text-white uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                  {world.name}
                </h1>

                {/* Visual Role & Trait Badges with Emojis */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-sm shadow-sm">
                    <span className="text-base">{roleEmoji}</span>
                    <span className="font-bold">{roleCode}</span>
                  </span>
                  <span className="text-slate-500">➕</span>
                  <span className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-purple-500/40 text-purple-300 font-mono text-sm shadow-sm">
                    <span className="text-base">{traitEmoji}</span>
                    <span className="font-bold">{traitCode}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 2 — IMPORTANT NARRATIVE CHOICE (HELP / HIDE / TAKE)
              ======================================================== */}
          {currentScene === 2 && (
            <motion.div
              key="scene2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="absolute inset-0 opacity-30" style={{ background: world.previewVisual }} />
              <div className="absolute inset-0 bg-black/60" />

              <div className="relative z-10 space-y-4 max-w-lg">
                <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-500/40">
                  CRITICAL CHOICE
                </span>

                <div className="text-7xl sm:text-8xl animate-bounce filter drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                  {encounterEmoji}
                </div>

                <div className="inline-block px-8 py-3 rounded-2xl bg-slate-900/90 border-2 border-amber-400 text-3xl sm:text-5xl font-cyber font-black text-white shadow-[0_0_35px_rgba(245,158,11,0.3)]">
                  [{encounterChoice}]
                </div>

                <p className="text-sm font-sans text-cyan-200">
                  {encounterChoice === 'HELP' && 'Empathy & Trust forged. Sanctum path unlocked! 🔓'}
                  {encounterChoice === 'HIDE' && 'Stealth & Veil prioritized. Undetected passage secured! 🕶️'}
                  {encounterChoice === 'TAKE' && 'Raw Power harvested. Local matrix entropy heightened! ⚡'}
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
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="absolute inset-0 bg-radial-gradient from-cyan-900/40 via-black to-black" />

              <div className="relative z-10 space-y-4 max-w-lg">
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-500/40">
                  THE AWAKENED RELIC
                </span>

                {/* Big Animated Artifact Emoji */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-7xl sm:text-9xl filter drop-shadow-[0_0_40px_rgba(0,240,255,0.6)] my-2"
                >
                  {artifactEmoji}
                </motion.div>

                <h2 className="text-3xl sm:text-5xl font-cyber font-black tracking-wider text-white uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]">
                  {artifactName}
                </h2>

                <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase flex items-center justify-center gap-1.5">
                  <span>✨</span>
                  <span>Harmonic Resonance Online</span>
                  <span>✨</span>
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
                  YOUR VERDICT
                </span>

                <div className="text-7xl sm:text-8xl my-1 animate-pulse">
                  {decisionEmoji}
                </div>

                <div
                  className={`inline-block px-10 py-4 rounded-2xl border-2 text-4xl sm:text-5xl font-cyber font-black tracking-widest uppercase shadow-2xl ${
                    artifactDecision === 'SAVE'
                      ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[0_0_45px_rgba(16,185,129,0.5)]'
                      : artifactDecision === 'CONTROL'
                      ? 'border-purple-400 bg-purple-950/80 text-purple-300 shadow-[0_0_45px_rgba(168,85,247,0.5)]'
                      : 'border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_45px_rgba(244,63,94,0.5)]'
                  }`}
                >
                  [{artifactDecision}]
                </div>

                <p className="text-sm font-sans text-slate-200">
                  {artifactDecision === 'SAVE' && '🛡️ Protection, crystal balance, and equilibrium restored.'}
                  {artifactDecision === 'CONTROL' && '⚡ Kinetic subjugation and overclocking enforced.'}
                  {artifactDecision === 'DESTROY' && '💥 Bonds shattered, liberating pure entropy.'}
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
              {/* SAVE: Calm floating sparkles and green aura */}
              {artifactDecision === 'SAVE' && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-emerald-500/20 to-transparent"
                  />
                  <div className="absolute inset-0">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: '-10%', opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.15 }}
                        className="absolute text-xl"
                        style={{ left: `${(i * 4.3) % 100}%` }}
                      >
                        {i % 2 === 0 ? '✨' : '🌿'}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* CONTROL: Electric shocks and flux glitch nodes */}
              {artifactDecision === 'CONTROL' && (
                <>
                  <div className="absolute inset-0 bg-purple-950/40 mix-blend-color-dodge animate-pulse" />
                  <div className="absolute inset-0 scanline opacity-90" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        x: [0, (i % 2 === 0 ? 50 : -50), 0],
                        y: [0, -35, 0]
                      }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="absolute text-2xl"
                      style={{ top: `${(i * 8) + 8}%`, left: `${(i * 12) + 6}%` }}
                    >
                      {i % 2 === 0 ? '⚡' : '⚠️'}
                    </motion.div>
                  ))}
                </>
              )}

              {/* DESTROY: Screen tremor, cracks, and fiery explosion embers */}
              {artifactDecision === 'DESTROY' && (
                <>
                  <motion.div
                    animate={{ x: [-5, 5, -3, 3, 0], y: [3, -3, 2, -2, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    className="absolute inset-0 bg-rose-950/40"
                  />
                  <div className="absolute top-1/4 left-10 right-10 h-[2px] bg-rose-500 shadow-[0_0_20px_#f43f5e] transform -rotate-6" />
                  <div className="absolute top-2/3 left-20 right-20 h-[2px] bg-amber-400 shadow-[0_0_20px_#f59e0b] transform rotate-12" />
                  <div className="absolute inset-0">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: '-10%', opacity: 0 }}
                        animate={{ y: '110%', opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                        className="absolute text-xl"
                        style={{ left: `${(i * 4.2) % 100}%` }}
                      >
                        {i % 2 === 0 ? '🔥' : '💥'}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              <div className="relative z-10 space-y-3 max-w-xl bg-black/70 p-6 sm:p-8 rounded-3xl border border-slate-700">
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400">
                  LIVE WORLD TRANSFORMATION
                </span>

                <div className="text-6xl sm:text-7xl">
                  {artifactDecision === 'SAVE' && '🌿✨💎'}
                  {artifactDecision === 'CONTROL' && '⚡⚠️🔮'}
                  {artifactDecision === 'DESTROY' && '🔥💥🚪'}
                </div>

                <h2 className="text-2xl sm:text-4xl font-cyber font-black text-white uppercase tracking-wider">
                  {artifactDecision === 'SAVE' && 'THE STABILIZED BIOME'}
                  {artifactDecision === 'CONTROL' && 'THE OVERCLOCKED GRID'}
                  {artifactDecision === 'DESTROY' && 'THE COLLAPSING REALITY'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 font-sans">
                  {artifactDecision === 'SAVE' && 'Crystalline harmony cascades through the atmosphere.'}
                  {artifactDecision === 'CONTROL' && 'High-voltage distortion forces structures under your dominion.'}
                  {artifactDecision === 'DESTROY' && 'Seismic ruptures blast open an emergency breach escape route!'}
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
                  MINI-CHALLENGE
                </span>

                <div className="text-6xl sm:text-7xl animate-pulse">
                  {challengeEmoji}
                </div>

                <h3 className="text-2xl sm:text-3xl font-cyber font-bold text-white uppercase">
                  {challengeResult === 'success' ? 'HARMONIZATION SUCCESS' : 'OVERLOAD FLUX'}
                </h3>

                <div className="inline-flex items-center justify-center px-6 py-2 rounded-2xl border-2 border-cyan-400 bg-slate-900 shadow-glow-cyan text-3xl sm:text-4xl font-cyber font-black text-cyan-300">
                  {challengeScore}%
                </div>
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
                  THE FINAL GATEWAY
                </span>

                <div className="text-7xl sm:text-8xl">
                  {finalEmoji}
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div
                    className={`px-5 py-3 rounded-2xl border-2 font-cyber font-black text-xl flex items-center space-x-2 ${
                      finalDecision === 'ESCAPE'
                        ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-glow-cyan scale-110'
                        : 'border-slate-800 bg-slate-950/60 text-slate-600 opacity-40'
                    }`}
                  >
                    <span>🚀</span>
                    <span>[ESCAPE]</span>
                  </div>

                  <div
                    className={`px-5 py-3 rounded-2xl border-2 font-cyber font-black text-xl flex items-center space-x-2 ${
                      finalDecision === 'STAY'
                        ? 'border-purple-400 bg-purple-950/90 text-purple-300 shadow-glow-purple scale-110'
                        : 'border-slate-800 bg-slate-950/60 text-slate-600 opacity-40'
                    }`}
                  >
                    <span>🏰</span>
                    <span>[STAY]</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-sans text-slate-300">
                  {finalDecision === 'ESCAPE'
                    ? 'Transcendence: Leaping beyond the threshold to explore infinite realities. 🌌'
                    : 'Dominion: Anchoring sovereignty as eternal guardian of this realm. 🛡️'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 8 — FINAL REALITY & VISUAL WORLD DNA
              ======================================================== */}
          {currentScene === 8 && (
            <motion.div
              key="scene8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
            >
              <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ background: world.previewVisual }} />
              <div className="absolute inset-0 bg-black/60 pointer-events-none" />

              <div className="relative z-10 space-y-5">
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/90 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">👑</span>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 block">
                        FINAL FORGED REALITY
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white uppercase tracking-wider">
                        {outcome.archetype}
                      </h2>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">DNA Hash</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">{dna.dnaHash}</span>
                  </div>
                </div>

                {/* AI Ending Narrative */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/75 border border-cyan-500/30">
                  <p className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed italic">
                    "{state.aiEnding?.epilogue || `As the ${roleCode}, you ${artifactDecision.toLowerCase()}ed the ${artifactName} and chose to ${finalDecision.toLowerCase()}. Reality stabilized along a unique quantum trajectory.`}"
                  </p>
                </div>

                {/* Visual World DNA Grid with Emojis */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-2 flex items-center space-x-1.5">
                    <span>🧬</span>
                    <span>YOUR ALTERRA WORLD DNA</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                      <span className="text-2xl">{worldEmoji}</span>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">WORLD</span>
                        <span className="text-white font-bold">{world.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                      <span className="text-2xl">{roleEmoji}</span>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">ROLE & TRAIT</span>
                        <span className="text-cyan-300 font-bold">{roleCode} · {traitCode}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                      <span className="text-2xl">{encounterEmoji}</span>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">CHOICE</span>
                        <span className="text-amber-300 font-bold">{encounterChoice}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                      <span className="text-2xl">{decisionEmoji}</span>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">FATE → CONVERGENCE</span>
                        <span className="text-purple-300 font-bold">{artifactDecision} → {finalDecision}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Easter Egg */}
                {dna.easterEggDiscovered && (
                  <div className="p-2.5 rounded-xl border border-purple-500/40 bg-purple-950/30 text-xs font-mono text-purple-300 flex items-center space-x-2">
                    <span className="text-lg">🔮</span>
                    <span>Secret Discovered: "This reality remembers choices you haven't made yet."</span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReplayJourney}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Replay Cinematic Journey</span>
                </button>

                <button
                  onClick={handlePlayAgain}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-400 transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Forge New Reality</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
