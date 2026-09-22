import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoxelCharacter from './VoxelCharacter';
import VirtualJoystick from './VirtualJoystick';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import {
  Volume2,
  HeartHandshake,
  Zap,
  EyeOff,
  Flame,
  Grab,
  Shield,
  Compass,
  ArrowRight,
  Activity,
  AlertTriangle
} from 'lucide-react';

/**
 * Living World & Creature Encounter Scene (Phase 4)
 * The player explores the manifest world by walking in real-time.
 * Screen shake, sound pulses, and directional indicators signal a creature in pain.
 * When approaching the wounded creature, an interactive dialogue modal pops up
 * offering meaningful branching choices (Help/Heal, Harness/Take, Bypass/Evade)
 * which visibly transforms the environment around them.
 */
export default function LivingWorldScene() {
  const { state, dispatch, setStage } = useGameState();
  const world = state.world || { id: 'cyber', name: 'Neo-Kowloon 2099', theme: 'digital', accentColor: '#00f0ff' };
  const accentColor = world.accentColor || '#00f0ff';

  // Character movement state on the living world map
  const [playerPos, setPlayerPos] = useState({ x: -220, y: 50 });
  const [direction, setDirection] = useState('right');
  const [isWalking, setIsWalking] = useState(false);

  // Injured creature position on the map
  const creaturePos = { x: 180, y: -40 };

  // Spatial audio & screen shake
  const [distanceToCreature, setDistanceToCreature] = useState(400);
  const [screenRumble, setScreenRumble] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [choiceMade, setChoiceMade] = useState(state.encounterChoice || null);
  const [environmentToned, setEnvironmentToned] = useState(null); // 'healed' | 'subjugated' | 'bypassed'

  const keysPressed = useRef({});
  const lastStep = useRef(0);
  const lastGrowl = useRef(0);

  // Distance calculation & growl audio loop
  useEffect(() => {
    const dist = Math.hypot(playerPos.x - creaturePos.x, playerPos.y - creaturePos.y);
    setDistanceToCreature(dist);

    // If close enough, open interactive choice modal
    if (dist < 85 && !modalOpen && !choiceMade) {
      setModalOpen(true);
      AudioService.playTone(300, 'sawtooth', 0.8, 0.2, 100);
    }

    // Audio growls become louder and more frequent as player nears creature
    const now = Date.now();
    const growlInterval = Math.max(1200, dist * 6);
    if (now - lastGrowl.current > growlInterval && !choiceMade) {
      AudioService.playCreatureGrowl();
      setScreenRumble(true);
      setTimeout(() => setScreenRumble(false), 300);
      lastGrowl.current = now;
    }
  }, [playerPos, modalOpen, choiceMade]);

  // Movement loop
  useEffect(() => {
    if (modalOpen) return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        if (distanceToCreature < 95 && !modalOpen && !choiceMade) {
          setModalOpen(true);
        }
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const interval = setInterval(() => {
      let dx = 0;
      let dy = 0;
      const keys = keysPressed.current;

      if (keys['w'] || keys['arrowup']) { dy -= 4.5; setDirection('up'); }
      if (keys['s'] || keys['arrowdown']) { dy += 4.5; setDirection('down'); }
      if (keys['a'] || keys['arrowleft']) { dx -= 4.5; setDirection('left'); }
      if (keys['d'] || keys['arrowright']) { dx += 4.5; setDirection('right'); }

      if (dx !== 0 || dy !== 0) {
        setIsWalking(true);
        setPlayerPos((prev) => ({
          x: Math.max(-360, Math.min(360, prev.x + dx)),
          y: Math.max(-170, Math.min(170, prev.y + dy))
        }));

        const now = Date.now();
        if (now - lastStep.current > 300) {
          AudioService.playStep();
          lastStep.current = now;
        }
      } else {
        setIsWalking(false);
      }
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [modalOpen, distanceToCreature, choiceMade]);

  // Handle Creature Choice
  const handleSelectChoice = (choiceId) => {
    setChoiceMade(choiceId);
    setModalOpen(false);

    // Save choice to global game state
    dispatch({ type: GAME_ACTIONS.SET_ENCOUNTER_CHOICE, payload: choiceId });

    if (choiceId === 'help') {
      AudioService.playArtifactReaction('save');
      setEnvironmentToned('healed');
    } else if (choiceId === 'take') {
      AudioService.playArtifactReaction('control');
      setEnvironmentToned('subjugated');
    } else {
      AudioService.playTone(350, 'sine', 0.5, 0.15);
      setEnvironmentToned('bypassed');
    }
  };

  const handleJoystickMove = ({ x, y, isMoving: moving, direction: dir }) => {
    if (modalOpen) return;
    setIsWalking(moving);
    if (dir) setDirection(dir);
    if (moving) {
      setPlayerPos((prev) => ({
        x: Math.max(-360, Math.min(360, prev.x + x * 4.5)),
        y: Math.max(-170, Math.min(170, prev.y + y * 4.5))
      }));
      const now = Date.now();
      if (now - lastStep.current > 300) {
        AudioService.playStep();
        lastStep.current = now;
      }
    }
  };

  // World specific creature data
  const creatureData = {
    name:
      world.theme === 'magical'
        ? 'Primal Sylvan Guardian'
        : world.theme === 'cosmic'
        ? 'Wounded Void Entity'
        : 'Cybernetic Chimera Unit',
    emoji: world.theme === 'magical' ? '🦌' : world.theme === 'cosmic' ? '👾' : '🤖',
    condition: 'Suffering from fractured dimensional core and emitting pained distress signals.'
  };

  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center font-mono select-none transition-colors duration-1000 ${
        screenRumble ? 'translate-x-0.5 -translate-y-0.5' : ''
      }`}
      style={{
        backgroundColor:
          environmentToned === 'healed'
            ? '#021810'
            : environmentToned === 'subjugated'
            ? '#150624'
            : '#020611'
      }}
    >
      {/* Dynamic Background Terrain & Biome elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hud-grid-overlay opacity-35" />

        {/* Ambient environment particle field */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background:
              environmentToned === 'healed'
                ? 'radial-gradient(circle at 70% 40%, rgba(16,185,129,0.2) 0%, transparent 60%)'
                : environmentToned === 'subjugated'
                ? 'radial-gradient(circle at 70% 40%, rgba(168,85,247,0.25) 0%, transparent 60%)'
                : `radial-gradient(circle at 70% 40%, rgba(239,68,68,0.2) 0%, transparent 60%)`
          }}
        />
      </div>

      {/* Header HUD: Audio Signal Radar */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center z-30 px-4 pointer-events-none">
        <div className="bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md px-6 py-2.5 rounded-full shadow-xl flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <Volume2 className={`w-4 h-4 ${distanceToCreature < 180 ? 'animate-bounce' : ''}`} />
            <span>DISTRESS AUDIO DETECTED</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Distance:</span>
            <span className="font-mono text-cyan-400 font-bold">
              {Math.round(distanceToCreature)}m
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-amber-400">
            {distanceToCreature < 100
              ? '⚠️ Immediate vicinity! Creature ahead!'
              : 'Follow directional audio vibrations'}
          </span>
        </div>
      </div>

      {/* Playable Stage Area */}
      <div className="relative z-20 w-full max-w-4xl h-[460px] flex items-center justify-center">
        {/* Living Terrain Props (Boulders, foliage, data pillars) */}
        <div className="absolute left-1/4 top-1/3 text-3xl opacity-60 pointer-events-none">
          {world.theme === 'magical' ? '🌿' : world.theme === 'cosmic' ? '☄️' : '📡'}
        </div>
        <div className="absolute right-1/4 bottom-1/4 text-3xl opacity-60 pointer-events-none">
          {world.theme === 'magical' ? '🍄' : world.theme === 'cosmic' ? '🌌' : '🔋'}
        </div>
        <div className="absolute left-1/3 bottom-1/3 text-2xl opacity-50 pointer-events-none">
          {world.theme === 'magical' ? '🌸' : world.theme === 'cosmic' ? '🪐' : '🖥️'}
        </div>

        {/* Wounded Creature Landmark */}
        <div
          onClick={() => {
            if (!choiceMade) setModalOpen(true);
          }}
          className="absolute flex flex-col items-center cursor-pointer group"
          style={{
            left: `calc(50% + ${creaturePos.x}px - 50px)`,
            top: `calc(50% + ${creaturePos.y}px - 50px)`,
            width: '100px'
          }}
        >
          {/* Pulsing sound wave rings if still wounded */}
          {!choiceMade && (
            <div className="absolute inset-0 -m-4 rounded-full border-2 border-rose-500/40 animate-ping pointer-events-none" />
          )}

          {/* Voxel/Beast Container */}
          <motion.div
            animate={{
              scale: !choiceMade ? [1, 1.08, 0.95, 1] : 1,
              rotateZ: !choiceMade ? [-3, 3, -3] : 0
            }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-20 h-20 rounded-2xl bg-slate-900/90 border-2 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md"
            style={{
              borderColor: choiceMade ? '#10b981' : '#f43f5e',
              boxShadow: choiceMade
                ? '0 0 25px rgba(16,185,129,0.5)'
                : '0 0 35px rgba(244,63,94,0.6)'
            }}
          >
            <span className="text-4xl">{creatureData.emoji}</span>
            <span
              className="text-[9px] font-black tracking-widest uppercase mt-1 px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: choiceMade ? '#065f46' : '#9f1239',
                color: '#ffffff'
              }}
            >
              {choiceMade ? 'RESOLVED' : 'INJURED'}
            </span>
          </motion.div>

          <span className="text-xs font-bold text-white mt-1.5 text-center">
            {creatureData.name}
          </span>

          {/* Prompt when nearby */}
          {distanceToCreature < 95 && !choiceMade && (
            <span className="mt-1 px-2.5 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded-full shadow animate-bounce">
              INTERACT [SPACE]
            </span>
          )}
        </div>

        {/* Playable Voxel Character */}
        <div
          className="absolute z-30 transition-transform duration-75"
          style={{
            transform: `translate(${playerPos.x}px, ${playerPos.y}px)`,
            left: 'calc(50% - 32px)',
            top: 'calc(50% - 48px)'
          }}
        >
          <VoxelCharacter
            isWalking={isWalking}
            direction={direction}
            isFloating={false}
            scale={1.2}
          />
        </div>
      </div>

      {/* Choice Modal (The Critical Encounter) */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-xl w-full shadow-2xl text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-4xl mb-3 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                {creatureData.emoji}
              </div>

              <span className="text-xs font-bold tracking-widest text-rose-400 uppercase mb-1">
                Encounter: {creatureData.name}
              </span>
              <h3 className="text-xl font-black text-white mb-2">
                Growls in Agony from Core Trauma
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-md">
                {creatureData.condition} How do you decide its fate? Your choice directly mutates this world's reality.
              </p>

              {/* 3 Branching Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-4">
                {/* Help / Heal */}
                <button
                  onClick={() => handleSelectChoice('help')}
                  className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/40 flex flex-col items-center gap-2 text-center transition-all cursor-pointer group shadow-lg"
                >
                  <HeartHandshake className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-emerald-300">Soothe & Heal</span>
                  <span className="text-[10px] text-slate-400">
                    Channel bio-attunement to mend its wounds in harmony.
                  </span>
                </button>

                {/* Subjugate / Harness */}
                <button
                  onClick={() => handleSelectChoice('take')}
                  className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-900/40 flex flex-col items-center gap-2 text-center transition-all cursor-pointer group shadow-lg"
                >
                  <Zap className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-purple-300">Harness Core</span>
                  <span className="text-[10px] text-slate-400">
                    Siphon its raw energy to supercharge world power.
                  </span>
                </button>

                {/* Bypass / Evade */}
                <button
                  onClick={() => handleSelectChoice('evade')}
                  className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 flex flex-col items-center gap-2 text-center transition-all cursor-pointer group shadow-lg"
                >
                  <EyeOff className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-cyan-300">Slip Past</span>
                  <span className="text-[10px] text-slate-400">
                    Conceal your presence and let nature run its course.
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onward Journey Button once resolved */}
      {choiceMade && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 z-30 flex flex-col items-center gap-2"
        >
          <button
            onClick={() => setStage(GAME_STAGES.ARTIFACT)}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-widest rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-300/40 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>PROCEED TO WORLD ARTIFACT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-400">
            World shifted towards {choiceMade === 'help' ? 'Harmony 🌿' : choiceMade === 'take' ? 'Dominion ⚡' : 'Shadows 🕶️'}
          </span>
        </motion.div>
      )}

      {/* Mobile Touch Joystick */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            if (distanceToCreature < 95 && !modalOpen && !choiceMade) {
              setModalOpen(true);
            }
          }}
          actionLabel="ACTION"
        />
      </div>
    </div>
  );
}
