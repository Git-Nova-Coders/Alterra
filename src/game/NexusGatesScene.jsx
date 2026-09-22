import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoxelCharacter from './VoxelCharacter';
import VirtualJoystick from './VirtualJoystick';
import { WORLDS } from '../data/worlds';
import { AudioService } from '../services/audioService';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Zap,
  Shield,
  Layers,
  Flame,
  Wind,
  Globe2,
  Atom,
  Sliders,
  CheckCircle2
} from 'lucide-react';

/**
 * Phase 2: 3D Multi-Path Choice Nexus
 * 
 * In this scene, the player floats/walks through the celestial Gateway Nexus.
 * There are 3 primary Thematic Gateways:
 * 1. Cybernetic Gate (Neo-Kowloon 2099 - Digital)
 * 2. Verdant Monolith Gate (Aethelgard Canopy - Magical)
 * 3. Singularity Rift Gate (Station Tartarus - Cosmic)
 * 
 * Plus 3 interactive Floating Choice Pillars/Monoliths that tune the genesis properties:
 * A. Atmospheric Resonance Pillar (Dawn / Twilight / Night / Storm)
 * B. World Valence Pillar (Serene / Mysterious / Dramatic / Apocalyptic)
 * C. Gravitational Physics Pillar (Floaty Low-G / Balanced / Heavy Density)
 * 
 * The player physically walks up to gates or pillars, chooses options or bypasses them,
 * dynamically shaping the world state prior to entering the void!
 */
export default function NexusGatesScene({ onSelectWorld }) {
  // Player coordinates on the platform (-400 to 400 on X, -200 to 200 on Y)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 110 });
  const [direction, setDirection] = useState('up');
  const [isWalking, setIsWalking] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState(null); // gate or monolith
  const [enteringGate, setEnteringGate] = useState(null);

  // Active world customizations tuned via Nexus Monoliths
  const [selectedAtmosphere, setSelectedAtmosphere] = useState('night');
  const [selectedMood, setSelectedMood] = useState('mysterious');
  const [selectedGravity, setSelectedGravity] = useState('balanced');
  const [activeModal, setActiveModal] = useState(null); // 'atmosphere' | 'mood' | 'gravity'

  const keysPressed = useRef({});
  const lastStep = useRef(0);

  // The 3 Dimensional World Portals
  const gates = [
    {
      id: 'cyber',
      name: 'Cybernetic Gate',
      sub: 'Neo-Kowloon 2099',
      world: WORLDS.cyber,
      x: -250,
      y: -80,
      color: '#00f0ff',
      emoji: '🏙️',
      portalBg: 'radial-gradient(ellipse at center, rgba(0,240,255,0.7) 0%, rgba(6,182,212,0.3) 50%, transparent 80%)'
    },
    {
      id: 'fantasy',
      name: 'Verdant Monolith Gate',
      sub: 'Aethelgard Canopy',
      world: WORLDS.fantasy,
      x: 0,
      y: -120,
      color: '#10b981',
      emoji: '🌲',
      portalBg: 'radial-gradient(ellipse at center, rgba(16,185,129,0.7) 0%, rgba(5,150,105,0.3) 50%, transparent 80%)'
    },
    {
      id: 'mystery',
      name: 'Singularity Rift Gate',
      sub: 'Station Tartarus',
      world: WORLDS.mystery,
      x: 250,
      y: -80,
      color: '#a855f7',
      emoji: '🛰️',
      portalBg: 'radial-gradient(ellipse at center, rgba(168,85,247,0.7) 0%, rgba(147,51,234,0.3) 50%, transparent 80%)'
    }
  ];

  // The 3 Interactive Genesis Tuning Monoliths
  const monoliths = [
    {
      id: 'mono-atmo',
      title: 'Atmospheric Lens',
      sub: `Current: ${selectedAtmosphere.toUpperCase()}`,
      type: 'atmosphere',
      icon: Wind,
      x: -150,
      y: 70,
      color: '#38bdf8',
      desc: 'Tunes light refraction & particle fog'
    },
    {
      id: 'mono-mood',
      title: 'Valence Resonator',
      sub: `Current: ${selectedMood.toUpperCase()}`,
      type: 'mood',
      icon: Flame,
      x: 0,
      y: 60,
      color: '#f59e0b',
      desc: 'Tunes world intensity & threat balance'
    },
    {
      id: 'mono-grav',
      title: 'Graviton Obelisk',
      sub: `Current: ${selectedGravity.toUpperCase()}`,
      type: 'gravity',
      icon: Atom,
      x: 150,
      y: 70,
      color: '#ec4899',
      desc: 'Tunes kinematic leap & inertia laws'
    }
  ];

  // Proximity detection loop
  useEffect(() => {
    if (activeModal || enteringGate) return;

    let closest = null;
    let minDistance = 85;

    // Check gates proximity
    gates.forEach((gate) => {
      const dist = Math.hypot(playerPos.x - gate.x, playerPos.y - gate.y);
      if (dist < minDistance) {
        closest = { ...gate, isGate: true };
      }
    });

    // Check monoliths proximity
    if (!closest) {
      monoliths.forEach((mono) => {
        const dist = Math.hypot(playerPos.x - mono.x, playerPos.y - mono.y);
        if (dist < 75) {
          closest = { ...mono, isGate: false };
        }
      });
    }

    if (closest?.id !== hoveredEntity?.id) {
      setHoveredEntity(closest);
      if (closest) {
        AudioService.playTone(closest.isGate ? 440 : 660, 'sine', 0.2, 0.1);
      }
    }
  }, [playerPos, activeModal, enteringGate, selectedAtmosphere, selectedMood, selectedGravity]);

  // Player controls
  useEffect(() => {
    if (enteringGate || activeModal) return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        if (hoveredEntity) {
          if (hoveredEntity.isGate) {
            handleEnterGate(hoveredEntity);
          } else {
            setActiveModal(hoveredEntity.type);
            AudioService.playTone(550, 'sine', 0.3, 0.15);
          }
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
  }, [hoveredEntity, enteringGate, activeModal]);

  const handleEnterGate = (gate) => {
    setEnteringGate(gate);
    AudioService.playTone(440, 'sine', 0.8, 0.25, 880);

    // Merge chosen monolith tuning into world config
    const tunedWorld = {
      ...gate.world,
      initialAtmosphere: selectedAtmosphere,
      mood: selectedMood,
      gravity: selectedGravity
    };

    setTimeout(() => {
      if (onSelectWorld) onSelectWorld(tunedWorld);
    }, 1200);
  };

  const handleJoystickMove = ({ x, y, isMoving: moving, direction: dir }) => {
    if (enteringGate || activeModal) return;
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

  return (
    <div className="relative w-full min-h-screen bg-[#02050e] overflow-hidden flex flex-col items-center justify-center font-mono select-none">
      {/* 3D Celestial Platform Backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hud-grid-overlay opacity-30" />
        
        {/* Outer glowing halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[920px] h-[520px] rounded-[60px] bg-gradient-to-b from-cyan-950/20 via-slate-900/70 to-slate-950 border border-cyan-500/25 shadow-[0_0_90px_rgba(6,182,212,0.15)]" />
        
        {/* Monolith alignment ley-lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-1 border-t border-dashed border-cyan-500/20" />
      </div>

      {/* Top Banner Navigation & Status */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center pointer-events-none z-30 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md px-6 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center gap-3"
        >
          <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="text-sm text-slate-100 font-bold tracking-wider">
            CHOOSE A REALITY GATE OR TUNE GENESIS MONOLITHS
          </span>
        </motion.div>
        
        {/* Active Customization Badges */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            ATMOSPHERE: {selectedAtmosphere.toUpperCase()}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300">
            VALENCE: {selectedMood.toUpperCase()}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300">
            GRAVITY: {selectedGravity.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 2.5D Arena Container */}
      <div className="relative z-20 w-full max-w-5xl h-[520px] flex items-center justify-center">
        {/* 1. The 3 Primary World Gates */}
        {gates.map((gate) => {
          const isNearby = hoveredEntity?.id === gate.id;
          return (
            <div
              key={gate.id}
              onClick={() => handleEnterGate(gate)}
              className="absolute flex flex-col items-center cursor-pointer group transition-transform duration-200"
              style={{
                left: `calc(50% + ${gate.x}px - 70px)`,
                top: `calc(50% + ${gate.y}px - 110px)`,
                width: '140px'
              }}
            >
              <motion.div
                animate={{
                  scale: isNearby ? [1, 1.06, 1] : 1,
                  boxShadow: isNearby
                    ? `0 0 45px ${gate.color}aa, inset 0 0 25px ${gate.color}55`
                    : `0 0 15px ${gate.color}33`
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative w-28 h-40 rounded-t-full border-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
                style={{
                  borderColor: gate.color,
                  backgroundColor: `${gate.color}15`
                }}
              >
                <div
                  className="absolute inset-0 animate-spin"
                  style={{
                    background: gate.portalBg,
                    animationDuration: isNearby ? '3.5s' : '12s'
                  }}
                />

                <span className="relative z-10 text-4xl filter drop-shadow-md group-hover:scale-125 transition-transform">
                  {gate.emoji}
                </span>

                <span
                  className="relative z-10 mt-2 text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase"
                  style={{
                    backgroundColor: `${gate.color}30`,
                    color: '#ffffff'
                  }}
                >
                  {isNearby ? 'LEAP IN' : 'GATEWAY'}
                </span>
              </motion.div>

              <div className="mt-2 text-center">
                <p className="text-xs font-bold text-white tracking-wider group-hover:text-cyan-300 transition-colors">
                  {gate.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {gate.sub}
                </p>
              </div>

              {isNearby && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 px-3 py-1 bg-white text-slate-950 font-black text-xs rounded shadow-lg animate-bounce flex items-center gap-1"
                >
                  <span>LEAP [SPACE]</span>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* 2. The 3 Genesis Tuning Monoliths */}
        {monoliths.map((mono) => {
          const isNearby = hoveredEntity?.id === mono.id;
          const IconComponent = mono.icon;
          return (
            <div
              key={mono.id}
              onClick={() => {
                setActiveModal(mono.type);
                AudioService.playTone(550, 'sine', 0.25, 0.15);
              }}
              className="absolute flex flex-col items-center cursor-pointer group"
              style={{
                left: `calc(50% + ${mono.x}px - 50px)`,
                top: `calc(50% + ${mono.y}px - 40px)`,
                width: '100px'
              }}
            >
              {/* Floating Monolith Body */}
              <motion.div
                animate={{
                  y: isNearby ? [-3, 3, -3] : [0, 4, 0],
                  scale: isNearby ? 1.1 : 1,
                  boxShadow: isNearby
                    ? `0 0 25px ${mono.color}bb`
                    : `0 0 10px ${mono.color}44`
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center backdrop-blur-md transition-all"
                style={{
                  borderColor: mono.color,
                  backgroundColor: `${mono.color}15`
                }}
              >
                <IconComponent className="w-6 h-6" style={{ color: mono.color }} />
                <div className="w-4 h-0.5 mt-1.5 rounded-full" style={{ backgroundColor: mono.color }} />
              </motion.div>

              <div className="mt-1 text-center">
                <p className="text-[11px] font-bold text-slate-200 group-hover:text-white transition-colors">
                  {mono.title}
                </p>
                <p className="text-[9px] font-mono" style={{ color: mono.color }}>
                  {mono.sub}
                </p>
              </div>

              {isNearby && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 px-2 py-0.5 bg-slate-100 text-slate-900 font-bold text-[10px] rounded shadow animate-bounce"
                >
                  TUNE [SPACE]
                </motion.div>
              )}
            </div>
          );
        })}

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

      {/* Screen flash on entering portal */}
      <AnimatePresence>
        {enteringGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center backdrop-blur-md"
            style={{ backgroundColor: `${enteringGate.color}dd` }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 1 }}
              className="text-white text-3xl font-black tracking-widest uppercase text-center drop-shadow-lg"
            >
              WARPING TO {enteringGate.name}...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Genesis Monolith Tuning Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              {activeModal === 'atmosphere' && (
                <div>
                  <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2 mb-1">
                    <Wind className="w-5 h-5" /> ATMOSPHERIC RESONANCE
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Calibrate the atmospheric density and lighting parameters for the reality ahead:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'dawn', label: 'Ion Dawn', desc: 'Crisp golden refraction' },
                      { id: 'twilight', label: 'Biolum Twilight', desc: 'Subtle neon purple mist' },
                      { id: 'night', label: 'Zero Midnight', desc: 'Stark high-contrast shadows' },
                      { id: 'storm', label: 'EM Storm', desc: 'Violent energetic arcs' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedAtmosphere(item.id);
                          AudioService.playTone(480, 'sine', 0.2, 0.1);
                          setActiveModal(null);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedAtmosphere === item.id
                            ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-cyan-500/50'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'mood' && (
                <div>
                  <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5" /> VALENCE RESONATOR
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Shape the emotional tension and creature behavior profiles:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'serene', label: 'Serene Harmonics', desc: 'Peaceful resonance' },
                      { id: 'mysterious', label: 'Veiled Enigma', desc: 'Uncharted signals' },
                      { id: 'dramatic', label: 'High Stakes', desc: 'Aggressive encounters' },
                      { id: 'apocalyptic', label: 'Cataclysmic', desc: 'Reality near collapse' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedMood(item.id);
                          AudioService.playTone(520, 'sine', 0.2, 0.1);
                          setActiveModal(null);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedMood === item.id
                            ? 'bg-amber-950 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-amber-500/50'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'gravity' && (
                <div>
                  <h3 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-1">
                    <Atom className="w-5 h-5" /> GRAVITON OBELISK
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Dictate the fundamental kinetic and inertia constants:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: 'Low-G', desc: 'Floaty leaps' },
                      { id: 'balanced', label: 'Earth Standard', desc: 'Balanced inertia' },
                      { id: 'dense', label: 'Super-Dense', desc: 'Heavy grounding' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedGravity(item.id);
                          AudioService.playTone(580, 'sine', 0.2, 0.1);
                          setActiveModal(null);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedGravity === item.id
                            ? 'bg-pink-950 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-pink-500/50'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Controls */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            if (hoveredEntity) {
              if (hoveredEntity.isGate) handleEnterGate(hoveredEntity);
              else setActiveModal(hoveredEntity.type);
            }
          }}
          actionLabel={hoveredEntity?.isGate ? 'LEAP' : 'TUNE'}
        />
      </div>
    </div>
  );
}
