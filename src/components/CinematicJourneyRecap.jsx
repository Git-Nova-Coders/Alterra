import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { WORLDS } from '../data/worlds';
import { AudioService } from '../services/audioService';
import { DecisionEngine } from '../utils/decisionEngine';
import VoxelCharacter from '../game/VoxelCharacter';
import {
  Play,
  Pause,
  RotateCcw,
  Compass,
  Maximize2,
  Film,
  Volume2,
  VolumeX,
  FastForward,
  Sparkles,
  Share2
} from 'lucide-react';

/**
 * Cinematic Video Journey Recap
 * Full 16:9 Cinema-Widescreen animated movie experience.
 * ZERO walls of text. Pure visual storytelling showing:
 * "What I chose" -> "What happened" -> "How my world changed" -> "What reality I created"
 * Features letterbox bars, film grain/scanlines, camera pans, character action choreography,
 * dynamic weather/particle shaders, and video playback controls (Play/Pause, Scrub, Replay).
 */
export default function CinematicJourneyRecap() {
  const { state, setStage, resetGame } = useGameState();

  // Video playback timeline (6 cinematic scenes)
  // Scene 1: Prologue - The Cosmic Awakening (Character floating in dark void, opening eyes)
  // Scene 2: The Portal Leap (Character running and diving into chosen themed gateway)
  // Scene 3: World Manifestation (Character walking across barren void as terrain erupts)
  // Scene 4: The Creature Resolution (Wounded beast encounter & the moral choice)
  // Scene 5: World Transformation (Cataclysmic / Harmonic environmental mutation)
  // Scene 6: The Final Reality & World DNA (The ultimate created reality)
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Extracted journey data
  const rawWorld = state.world;
  const world = (typeof rawWorld === 'string' ? WORLDS[rawWorld] : rawWorld) || {
    id: 'cyber',
    name: 'Neo-Kowloon 2099',
    iconEmoji: '🏙️',
    theme: 'digital',
    accentColor: '#00f0ff',
    artifactEmoji: '🧊',
    artifact: 'Quantum Core',
    previewVisual: 'linear-gradient(135deg, #091a28 0%, #032b44 50%, #081220 100%)'
  };

  const worldEmoji = world.iconEmoji || (world.id === 'fantasy' ? '🌲' : world.id === 'mystery' ? '🛰️' : '🏙️');
  const artifactEmoji = world.artifactEmoji || (world.id === 'fantasy' ? '💚' : world.id === 'mystery' ? '🗝️' : '🧊');
  const accentColor = world.accentColor || '#00f0ff';

  const rawEncounter = (state.encounterChoice || 'help').toLowerCase();
  const encounterChoice = rawEncounter === 'evade' ? 'HIDE' : rawEncounter.toUpperCase(); // HELP | HIDE | TAKE
  const encounterEmoji = encounterChoice === 'HELP' ? '🤝' : encounterChoice === 'HIDE' ? '👤' : '⚡';

  const artifactDecision = (state.artifactDecision || 'save').toUpperCase(); // SAVE | CONTROL | DESTROY
  const decisionEmoji = artifactDecision === 'SAVE' ? '🛡️' : artifactDecision === 'CONTROL' ? '⚡' : '💥';

  const finalDecision = (state.finalDecision || 'STAY').toUpperCase();
  const finalEmoji = finalDecision === 'ESCAPE' ? '🚀' : '🏰';

  // Evaluate final archetypes & World DNA
  const outcome = DecisionEngine.evaluateOutcome(state || {
    world,
    encounterChoice: rawEncounter,
    artifactDecision: artifactDecision.toLowerCase(),
    finalDecision: finalDecision.toLowerCase()
  });

  const dna = DecisionEngine.generateWorldDNA(state || {});

  // Scene Timers for automated video playback
  useEffect(() => {
    if (!isPlaying) return;

    let timeout;
    const sceneDurations = [0, 4200, 3800, 4200, 4500, 4800, 7000];

    // Trigger procedural audio soundtrack for each scene
    if (currentScene === 1) {
      AudioService.playAwakening();
    } else if (currentScene === 2) {
      AudioService.playPortalHum();
    } else if (currentScene === 3) {
      AudioService.playTone(520, 'sine', 0.6, 0.2, 780);
    } else if (currentScene === 4) {
      if (encounterChoice === 'HELP') AudioService.playArtifactReaction('save');
      else if (encounterChoice === 'TAKE') AudioService.playArtifactReaction('control');
      else AudioService.playTone(350, 'sine', 0.5, 0.15);
    } else if (currentScene === 5) {
      AudioService.playWorldReaction(artifactDecision.toLowerCase());
    } else if (currentScene === 6) {
      AudioService.playTone(finalDecision === 'ESCAPE' ? 880 : 330, 'sine', 1.2, 0.2);
    }

    if (currentScene < 6) {
      timeout = setTimeout(() => {
        setCurrentScene((s) => s + 1);
      }, sceneDurations[currentScene]);
    } else {
      setIsPlaying(false);
    }

    return () => clearTimeout(timeout);
  }, [currentScene, isPlaying, encounterChoice, artifactDecision, finalDecision]);

  // Update progress bar
  useEffect(() => {
    setVideoProgress(((currentScene - 1) / 5) * 100);
  }, [currentScene]);

  const handleTogglePlay = () => {
    if (currentScene === 6 && !isPlaying) {
      setCurrentScene(1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    const muted = AudioService.toggleMute();
    setIsMuted(muted);
  };

  const handleReplay = () => {
    AudioService.playClick();
    setCurrentScene(1);
    setIsPlaying(true);
  };

  const handleNewGame = () => {
    AudioService.playClick();
    resetGame();
    setStage(GAME_STAGES.AWAKENING);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-3 sm:p-6 font-mono select-none">
      {/* 16:9 Cinema Widescreen Player Container */}
      <div className="relative w-full max-w-5xl aspect-video min-h-[460px] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-slate-800 bg-black flex flex-col justify-between">
        
        {/* Top Cinema Letterbox Bar */}
        <div className="relative z-30 w-full h-12 bg-gradient-to-b from-black via-black/80 to-transparent px-6 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-black tracking-widest text-slate-300 uppercase flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>ALTERRA: THE MANIFEST REALITY</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-cyan-400/90 font-bold bg-slate-900/90 border border-cyan-500/30 px-3 py-1 rounded-full">
              SCENE 0{currentScene} // 06
            </span>
          </div>
        </div>

        {/* Video Camera Viewport */}
        <div className="relative w-full flex-1 min-h-[380px] overflow-hidden flex items-center justify-center">
          
          {/* Subtle Film Grain / Scanline Filter Overlay */}
          <div className="absolute inset-0 scanline opacity-25 pointer-events-none z-20" />

          <AnimatePresence mode="popLayout">
            {/* ========================================================
                VIDEO SCENE 1: THE COSMIC AWAKENING
                ======================================================== */}
            {currentScene === 1 && (
              <motion.div
                key="vscene1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#02050f]"
              >
                {/* Parallax Starfield */}
                <motion.div
                  animate={{ scale: [1, 1.15] }}
                  transition={{ duration: 4.2, ease: 'linear' }}
                  className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black"
                />

                {/* Drifting Stardust */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [-15, 15, -15], opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 3 + (i % 3), repeat: Infinity }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
                    style={{
                      left: `${(i * 3.7) % 100}%`,
                      top: `${(i * 7.1) % 100}%`
                    }}
                  />
                ))}

                {/* Floating Voxel Character Waking Up from Sleeping posture */}
                <motion.div
                  initial={{ y: 25, rotateX: 60, scale: 1.5 }}
                  animate={{ y: 0, rotateX: 0, scale: 1.8 }}
                  transition={{ duration: 3.2, ease: 'easeOut' }}
                  className="relative z-10 flex flex-col items-center"
                  style={{ perspective: 800 }}
                >
                  <VoxelCharacter
                    isFloating={true}
                    isSleeping={false}
                    isNudgingEyes={false}
                    eyesClosed={false}
                    scale={1.8}
                  />
                </motion.div>

                {/* Visual Icon Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-6 z-10 flex items-center gap-2 text-2xl bg-black/70 px-5 py-2 rounded-full border border-cyan-500/40 backdrop-blur-md shadow-lg"
                >
                  <span>😴</span>
                  <span className="text-xs font-bold text-cyan-300 tracking-wider">
                    PROLOGUE // SLUMBER & AWAKENING IN THE VOID
                  </span>
                  <span>👁️</span>
                </motion.div>
              </motion.div>
            )}

            {/* ========================================================
                VIDEO SCENE 2: THE PORTAL LEAP
                ======================================================== */}
            {currentScene === 2 && (
              <motion.div
                key="vscene2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#030712]"
              >
                {/* Background Gate Energy Swirl */}
                <motion.div
                  animate={{ scale: [1, 1.25], rotate: 180 }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className="absolute w-[600px] h-[600px] rounded-full opacity-50 blur-xl"
                  style={{
                    background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`
                  }}
                />

                {/* Themed Gateway Arch */}
                <div
                  className="relative z-10 w-44 h-64 rounded-t-full border-4 flex flex-col items-center justify-center overflow-hidden shadow-2xl"
                  style={{
                    borderColor: accentColor,
                    boxShadow: `0 0 50px ${accentColor}80`
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `radial-gradient(circle, ${accentColor} 0%, transparent 80%)`
                    }}
                  />
                  <span className="text-7xl relative z-10 filter drop-shadow-lg animate-pulse">
                    {worldEmoji}
                  </span>
                </div>

                {/* Character Running & Diving Into Gate */}
                <motion.div
                  initial={{ x: -280, y: 70, scale: 1.4 }}
                  animate={{ x: 0, y: 0, scale: 0.2, rotateZ: 360 }}
                  transition={{ duration: 3.2, ease: 'easeInOut' }}
                  className="absolute z-20"
                >
                  <VoxelCharacter isWalking={true} direction="right" scale={1.4} />
                </motion.div>

                {/* Visual Icon Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 z-10 flex items-center gap-2 text-2xl bg-black/60 px-4 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md"
                >
                  <span>{worldEmoji}</span>
                  <span className="text-xs font-bold text-cyan-300 tracking-wider">
                    GATEWAY CHOSEN // TRANSIT TO {world.name.toUpperCase()}
                  </span>
                  <span>🌀</span>
                </motion.div>
              </motion.div>
            )}

            {/* ========================================================
                VIDEO SCENE 3: REAL-TIME WORLD MANIFESTATION
                ======================================================== */}
            {currentScene === 3 && (
              <motion.div
                key="vscene3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#01040a]"
              >
                {/* Expanding Void Grid */}
                <div className="absolute inset-0 hud-grid-overlay opacity-30" />

                {/* Erupting Terrain Blocks popping up as character walks */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.18 }}
                    className="absolute w-12 h-12 rounded-sm border shadow-lg"
                    style={{
                      left: `${15 + ((i * 14) % 75)}%`,
                      top: `${30 + ((i * 11) % 45)}%`,
                      backgroundColor:
                        world.id === 'fantasy' ? '#064e3b' : world.id === 'mystery' ? '#3b0764' : '#0e3a5a',
                      borderColor: accentColor
                    }}
                  />
                ))}

                {/* Character Walking across the newly formed tiles */}
                <motion.div
                  initial={{ x: -180 }}
                  animate={{ x: 180 }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className="relative z-10"
                >
                  <VoxelCharacter isWalking={true} direction="right" scale={1.5} />
                </motion.div>

                {/* Visual Icon Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 z-10 flex items-center gap-2 text-2xl bg-black/60 px-4 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md"
                >
                  <span>🏗️</span>
                  <span className="text-xs font-bold text-cyan-300 tracking-wider">
                    EXPLORATION // TERRAIN ERUPTION & SEEDING
                  </span>
                  <span>🌱</span>
                </motion.div>
              </motion.div>
            )}

            {/* ========================================================
                VIDEO SCENE 4: THE CREATURE ENCOUNTER & RESOLUTION
                ======================================================== */}
            {currentScene === 4 && (
              <motion.div
                key="vscene4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#05060f]"
              >
                {/* Ambient Aura reflecting the choice */}
                <div
                  className="absolute inset-0 opacity-40 transition-colors duration-1000"
                  style={{
                    background:
                      encounterChoice === 'HELP'
                        ? 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)'
                        : encounterChoice === 'TAKE'
                        ? 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)'
                  }}
                />

                {/* Interactive Tableau: Character & Beast face to face */}
                <div className="relative z-10 flex items-center justify-center gap-16 sm:gap-24">
                  {/* Player Character */}
                  <motion.div
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <VoxelCharacter isWalking={false} direction="right" scale={1.5} />
                  </motion.div>

                  {/* Resonant Energy Ray Connecting them */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 1.2 }}
                    className="h-2 w-20 sm:w-32 rounded-full shadow-[0_0_20px_#ffffff]"
                    style={{
                      backgroundColor:
                        encounterChoice === 'HELP'
                          ? '#10b981'
                          : encounterChoice === 'TAKE'
                          ? '#a855f7'
                          : '#06b6d4'
                    }}
                  />

                  {/* The Creature */}
                  <motion.div
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="w-24 h-24 rounded-3xl bg-slate-900/90 border-2 flex flex-col items-center justify-center shadow-2xl"
                    style={{
                      borderColor:
                        encounterChoice === 'HELP'
                          ? '#10b981'
                          : encounterChoice === 'TAKE'
                          ? '#a855f7'
                          : '#06b6d4'
                    }}
                  >
                    <span className="text-5xl">
                      {world.theme === 'magical' ? '🦌' : world.theme === 'cosmic' ? '👾' : '🤖'}
                    </span>
                  </motion.div>
                </div>

                {/* Visual Icon Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-6 z-10 flex items-center gap-3 text-2xl bg-black/60 px-5 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md"
                >
                  <span>{encounterEmoji}</span>
                  <span className="text-xs font-bold text-cyan-300 tracking-wider">
                    CRITICAL RESOLUTION // {encounterChoice === 'HELP' ? 'SOOTHE & HARMONIZE' : encounterChoice === 'TAKE' ? 'SUBJUGATE & HARNESS' : 'SLIP PAST & CONCEAL'}
                  </span>
                  <span>✨</span>
                </motion.div>
              </motion.div>
            )}

            {/* ========================================================
                VIDEO SCENE 5: LIVE WORLD TRANSFORMATION
                ======================================================== */}
            {currentScene === 5 && (
              <motion.div
                key="vscene5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              >
                {/* SAVE: Calming celestial particles and golden sylvan aura */}
                {artifactDecision === 'SAVE' && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-teal-900/40 to-black"
                    />
                    {Array.from({ length: 28 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: '110%', opacity: 0 }}
                        animate={{ y: '-10%', opacity: [0, 1, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.12 }}
                        className="absolute text-2xl"
                        style={{ left: `${(i * 3.8) % 100}%` }}
                      >
                        {i % 2 === 0 ? '✨' : '🌿'}
                      </motion.div>
                    ))}
                  </>
                )}

                {/* CONTROL: Cybernetic neon overdrive, electric storm */}
                {artifactDecision === 'CONTROL' && (
                  <>
                    <div className="absolute inset-0 bg-purple-950/60 animate-pulse" />
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          x: [0, i % 2 === 0 ? 60 : -60, 0],
                          opacity: [0.2, 1, 0.2]
                        }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="absolute text-3xl"
                        style={{ top: `${(i * 6) + 5}%`, left: `${(i * 12) + 5}%` }}
                      >
                        ⚡
                      </motion.div>
                    ))}
                  </>
                )}

                {/* DESTROY: Volcanic seismic rift, falling magma embers */}
                {artifactDecision === 'DESTROY' && (
                  <>
                    <motion.div
                      animate={{ x: [-4, 4, -2, 2, 0] }}
                      transition={{ duration: 0.15, repeat: Infinity }}
                      className="absolute inset-0 bg-rose-950/70"
                    />
                    {Array.from({ length: 26 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: '-10%', opacity: 0 }}
                        animate={{ y: '110%', opacity: [0, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.08 }}
                        className="absolute text-2xl"
                        style={{ left: `${(i * 4) % 100}%` }}
                      >
                        {i % 2 === 0 ? '🔥' : '💥'}
                      </motion.div>
                    ))}
                  </>
                )}

                {/* Hero Artifact at center */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10 text-8xl sm:text-9xl filter drop-shadow-[0_0_50px_#ffffff]"
                >
                  {artifactEmoji}
                </motion.div>

                {/* Visual Icon Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 z-10 flex items-center gap-3 text-2xl bg-black/60 px-5 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md"
                >
                  <span>{decisionEmoji}</span>
                  <span className="text-xs font-bold text-cyan-300 tracking-wider">
                    REALITY TRANSFORMATION // {artifactDecision}
                  </span>
                  <span>{decisionEmoji}</span>
                </motion.div>
              </motion.div>
            )}

            {/* ========================================================
                VIDEO SCENE 6: THE CREATED REALITY & WORLD DNA
                ======================================================== */}
            {currentScene === 6 && (
              <motion.div
                key="vscene6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto bg-slate-950/90"
              >
                {/* Dynamic Atmospheric Backdrop */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{ background: world.previewVisual }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Archetype Crown & Title */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl animate-bounce">👑</span>
                      <div>
                        <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block">
                          FINAL REALITY BORN
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider">
                          {outcome.archetype}
                        </h2>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">GENESIS HASH</span>
                      <span className="text-xs font-bold text-cyan-300">{dna.dnaHash}</span>
                    </div>
                  </div>

                  {/* Visual Journey Sequence Emojis */}
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                      <span className="text-3xl mb-1">{worldEmoji}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">WORLD</span>
                      <span className="text-xs text-white font-black">{world?.name ? world.name.split(' ')[0] : 'NEO-KOWLOON'}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                      <span className="text-3xl mb-1">{encounterEmoji}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">CREATURE</span>
                      <span className="text-xs text-amber-300 font-black">{encounterChoice}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                      <span className="text-3xl mb-1">{decisionEmoji}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">ARTIFACT</span>
                      <span className="text-xs text-cyan-300 font-black">{artifactDecision}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                      <span className="text-3xl mb-1">{finalEmoji}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">DESTINY</span>
                      <span className="text-xs text-purple-300 font-black">{finalDecision}</span>
                    </div>
                  </div>
                </div>

                {/* Post-Video Interactive CTAs */}
                <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleReplay}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay Movie Recap</span>
                  </button>

                  <button
                    onClick={handleNewGame}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-400 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Create New Universe</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Cinema Video Controls Bar */}
        <div className="relative z-30 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-4 flex flex-col gap-2">
          {/* Video Scrub Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden flex items-center">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500"
              style={{ width: `${videoProgress}%` }}
              transition={{ ease: 'linear', duration: 0.2 }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 flex items-center justify-center text-cyan-400 transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                onClick={handleMuteToggle}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>00:0{currentScene}</span>
                <span>/</span>
                <span>00:06</span>
              </div>
            </div>

            {/* Scene Jump Pills */}
            <div className="flex items-center gap-1">
              {[
                { num: 1, label: '🌌' },
                { num: 2, label: worldEmoji },
                { num: 3, label: '🌱' },
                { num: 4, label: encounterEmoji },
                { num: 5, label: decisionEmoji },
                { num: 6, label: '👑' }
              ].map((pill) => (
                <button
                  key={pill.num}
                  onClick={() => {
                    AudioService.playClick();
                    setCurrentScene(pill.num);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition-all cursor-pointer ${
                    currentScene === pill.num
                      ? 'border-cyan-400 bg-cyan-950/80 scale-110 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'border-slate-800 bg-slate-950/60 opacity-60 hover:opacity-100'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
