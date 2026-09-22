import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoxelCharacter from './VoxelCharacter';
import VirtualJoystick from './VirtualJoystick';
import { WORLDS } from '../data/worlds';
import { AudioService } from '../services/audioService';
import { Sparkles, Move, Compass, ArrowRight, Zap, Shield, Radio } from 'lucide-react';

/**
 * Nexus Gates Scene
 * The player walks their voxel character across a floating celestial platform.
 * 3 Massive Portal Gates are placed with distinct themes:
 * - Cyber Portal (Left): Neon cyan holographic gateway
 * - Fantasy Portal (Center): Ancient emerald rune monolith
 * - Mystery Portal (Right): Violet singularity vortex
 * 
 * Stepping close to a portal causes it to resonate, hum, and prompts entry.
 */
export default function NexusGatesScene({ onSelectWorld }) {
  // Player coordinates on the platform (-400 to 400 on X, -180 to 180 on Y)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 80 });
  const [direction, setDirection] = useState('up');
  const [isWalking, setIsWalking] = useState(false);
  const [hoveredGate, setHoveredGate] = useState(null);
  const [enteringGate, setEnteringGate] = useState(null);

  const keysPressed = useRef({});
  const lastStep = useRef(0);

  // Portal positions on the map
  const gates = [
    {
      id: 'cyber',
      name: 'Cybernetic Gate',
      sub: 'Neo-Kowloon 2099',
      world: WORLDS.cyber,
      x: -240,
      y: -70,
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
      y: -100,
      color: '#10b981',
      emoji: '🌲',
      portalBg: 'radial-gradient(ellipse at center, rgba(16,185,129,0.7) 0%, rgba(5,150,105,0.3) 50%, transparent 80%)'
    },
    {
      id: 'mystery',
      name: 'Singularity Rift Gate',
      sub: 'Station Tartarus',
      world: WORLDS.mystery,
      x: 240,
      y: -70,
      color: '#a855f7',
      emoji: '🛰️',
      portalBg: 'radial-gradient(ellipse at center, rgba(168,85,247,0.7) 0%, rgba(147,51,234,0.3) 50%, transparent 80%)'
    }
  ];

  // Proximity check loop
  useEffect(() => {
    let closest = null;
    let minDistance = 95; // threshold to trigger gate proximity

    gates.forEach((gate) => {
      const dist = Math.hypot(playerPos.x - gate.x, playerPos.y - gate.y);
      if (dist < minDistance) {
        closest = gate;
      }
    });

    if (closest !== hoveredGate) {
      setHoveredGate(closest);
      if (closest) {
        AudioService.playPortalHum();
      }
    }
  }, [playerPos]);

  // Movement loop
  useEffect(() => {
    if (enteringGate) return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        if (hoveredGate) handleEnterGate(hoveredGate);
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
          x: Math.max(-340, Math.min(340, prev.x + dx)),
          y: Math.max(-140, Math.min(140, prev.y + dy))
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
  }, [hoveredGate, enteringGate]);

  const handleEnterGate = (gate) => {
    setEnteringGate(gate);
    AudioService.playTone(440, 'sine', 0.8, 0.25, 880);
    setTimeout(() => {
      if (onSelectWorld) onSelectWorld(gate.world);
    }, 1000);
  };

  const handleJoystickMove = ({ x, y, isMoving: moving, direction: dir }) => {
    if (enteringGate) return;
    setIsWalking(moving);
    if (dir) setDirection(dir);
    if (moving) {
      setPlayerPos((prev) => ({
        x: Math.max(-340, Math.min(340, prev.x + x * 4.5)),
        y: Math.max(-140, Math.min(140, prev.y + y * 4.5))
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
      {/* Platform & Cosmic Dust Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 hud-grid-overlay opacity-30" />
        {/* Floating platform glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] rounded-[60px] bg-gradient-to-b from-cyan-950/20 via-slate-900/60 to-slate-950 border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.1)]" />
      </div>

      {/* Header Prompt */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center pointer-events-none z-30 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-950/85 border border-cyan-500/30 backdrop-blur-md px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center gap-3"
        >
          <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="text-sm text-slate-200 font-bold tracking-wider">
            STEP INTO A GATEWAY TO INITIALIZE REALITY
          </span>
        </motion.div>
        <span className="text-xs text-slate-400 mt-2">
          Use WASD / Arrow Keys or click to walk your character to any gate
        </span>
      </div>

      {/* 2.5D World Container */}
      <div className="relative z-20 w-full max-w-4xl h-[480px] flex items-center justify-center">
        {/* The 3 Gates */}
        {gates.map((gate) => {
          const isNearby = hoveredGate?.id === gate.id;
          return (
            <div
              key={gate.id}
              onClick={() => handleEnterGate(gate)}
              className="absolute flex flex-col items-center cursor-pointer group"
              style={{
                left: `calc(50% + ${gate.x}px - 70px)`,
                top: `calc(50% + ${gate.y}px - 110px)`,
                width: '140px'
              }}
            >
              {/* Gate Energy Archway */}
              <motion.div
                animate={{
                  scale: isNearby ? [1, 1.05, 1] : 1,
                  boxShadow: isNearby
                    ? `0 0 35px ${gate.color}88, inset 0 0 20px ${gate.color}44`
                    : `0 0 15px ${gate.color}33`
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative w-28 h-40 rounded-t-full border-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
                style={{
                  borderColor: gate.color,
                  backgroundColor: `${gate.color}10`
                }}
              >
                {/* Swirling energy core */}
                <div
                  className="absolute inset-0 animate-spin"
                  style={{
                    background: gate.portalBg,
                    animationDuration: isNearby ? '4s' : '12s'
                  }}
                />

                {/* Gate Emoji Icon */}
                <span className="relative z-10 text-4xl filter drop-shadow-md group-hover:scale-125 transition-transform">
                  {gate.emoji}
                </span>

                {/* Status Indicator */}
                <span
                  className="relative z-10 mt-2 text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase"
                  style={{
                    backgroundColor: `${gate.color}30`,
                    color: '#ffffff'
                  }}
                >
                  {isNearby ? 'READY' : 'ONLINE'}
                </span>
              </motion.div>

              {/* Pedestal & Gate Title */}
              <div className="mt-2 text-center">
                <p className="text-xs font-bold text-white tracking-wider group-hover:text-cyan-300 transition-colors">
                  {gate.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {gate.sub}
                </p>
              </div>

              {/* Interaction Callout when nearby */}
              {isNearby && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 px-3 py-1 bg-white text-slate-950 font-black text-xs rounded shadow-lg animate-bounce flex items-center gap-1"
                >
                  <span>ENTER [SPACE]</span>
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
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            style={{ backgroundColor: enteringGate.color }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              className="text-white text-2xl font-black tracking-widest uppercase text-center"
            >
              TRANSIT TO {enteringGate.name}...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Controls */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            if (hoveredGate) handleEnterGate(hoveredGate);
          }}
          actionLabel="ENTER"
        />
      </div>
    </div>
  );
}
