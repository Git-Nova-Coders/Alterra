import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoxelCharacter from './VoxelCharacter';
import VirtualJoystick from './VirtualJoystick';
import { AudioService } from '../services/audioService';
import { Sparkles, Eye, Compass, Move, ArrowUpRight } from 'lucide-react';

/**
 * Dark Awakening Scene
 * - Player character floats in infinite zero-G dark space
 * - Eye-opening cinematic blur & eyelid shutter
 * - Responsive 360-degree controls (WASD, Arrow keys, Mobile Touch Joystick)
 * - Drifting stardust particles
 * - Audio feedback on awakening & navigation
 * - Triggers onward journey to the Nexus Gates
 */
export default function DarkAwakeningScene({ onAwakened }) {
  // Eye state: 0 = completely closed, 1 = slit open, 2 = fully open
  const [eyeState, setEyeState] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // relative offset in space
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down');
  const [spaceDust, setSpaceDust] = useState([]);
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  const keysPressed = useRef({});
  const lastStepTime = useRef(0);

  // Generate cosmic particles
  useEffect(() => {
    const dust = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 20 + 10
    }));
    setSpaceDust(dust);
  }, []);

  // Eye opening sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setEyeState(1); // slits open
      AudioService.playAwakening();
    }, 1200);

    const timer2 = setTimeout(() => {
      setEyeState(2); // fully awake
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Keyboard navigation loop
  useEffect(() => {
    if (eyeState < 2) return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
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

      if (keys['w'] || keys['arrowup']) { dy -= 4; setDirection('up'); }
      if (keys['s'] || keys['arrowdown']) { dy += 4; setDirection('down'); }
      if (keys['a'] || keys['arrowleft']) { dx -= 4; setDirection('left'); }
      if (keys['d'] || keys['arrowright']) { dx += 4; setDirection('right'); }

      if (dx !== 0 || dy !== 0) {
        setIsMoving(true);
        setPos((prev) => ({
          x: Math.max(-280, Math.min(280, prev.x + dx)),
          y: Math.max(-200, Math.min(200, prev.y + dy))
        }));
        setDistanceTraveled((d) => d + Math.sqrt(dx * dx + dy * dy));

        // Play step/thruster audio periodically
        const now = Date.now();
        if (now - lastStepTime.current > 320) {
          AudioService.playStep();
          lastStepTime.current = now;
        }
      } else {
        setIsMoving(false);
      }
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [eyeState]);

  // Handle mobile joystick input
  const handleJoystickMove = ({ x, y, isMoving: moving, direction: dir }) => {
    if (eyeState < 2) return;
    setIsMoving(moving);
    if (dir) setDirection(dir);
    if (moving) {
      setPos((prev) => ({
        x: Math.max(-280, Math.min(280, prev.x + x * 4)),
        y: Math.max(-200, Math.min(200, prev.y + y * 4))
      }));
      setDistanceTraveled((d) => d + 3);

      const now = Date.now();
      if (now - lastStepTime.current > 320) {
        AudioService.playStep();
        lastStepTime.current = now;
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#03060f] overflow-hidden flex flex-col items-center justify-center font-mono">
      {/* Background Starfield & Floating Nebulae */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle deep nebula glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] bg-indigo-900/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-violet-950/20 rounded-full blur-3xl" />

        {/* Space dust particles that drift based on player movement */}
        {spaceDust.map((dust) => (
          <div
            key={dust.id}
            className="absolute rounded-full bg-white transition-transform duration-75"
            style={{
              left: `${dust.x}%`,
              top: `${dust.y}%`,
              width: `${dust.size}px`,
              height: `${dust.size}px`,
              opacity: dust.opacity,
              boxShadow: `0 0 6px rgba(255,255,255,${dust.opacity})`,
              transform: `translate(${-pos.x * (dust.size / 3)}px, ${-pos.y * (dust.size / 3)}px)`
            }}
          />
        ))}
      </div>

      {/* Cinematic Eyelid Shutter Opening Overlay */}
      <AnimatePresence>
        {eyeState === 0 && (
          <motion.div
            key="eyelid-closed"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-40 flex items-center justify-center pointer-events-none"
          >
            <p className="text-cyan-500/70 text-xs tracking-widest uppercase animate-pulse">
              [ ... adrift in the void ... ]
            </p>
          </motion.div>
        )}

        {eyeState === 1 && (
          <motion.div
            key="eyelid-slit"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: [1, 0.4, 0.7, 0.2] }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between"
          >
            <div className="w-full h-[45%] bg-black backdrop-blur-md shadow-2xl" />
            <div className="w-full h-[10%] flex items-center justify-center">
              <span className="text-cyan-400 font-bold tracking-widest text-xs px-3 py-1 bg-black/60 rounded border border-cyan-500/30">
                EYES OPENING...
              </span>
            </div>
            <div className="w-full h-[45%] bg-black backdrop-blur-md shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD & Story Banner */}
      <div className="absolute top-8 inset-x-0 flex flex-col items-center pointer-events-none z-30 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: eyeState === 2 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.15)] max-w-md"
        >
          <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Prologue: The Awakening</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            You drift in silent, infinite space. Gradually opening your eyes, a strange resonance echoes ahead.
          </p>
        </motion.div>

        {/* Controls indicator */}
        {eyeState === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 flex items-center gap-4 text-xs text-cyan-300/80 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-full"
          >
            <div className="flex items-center gap-1">
              <Move className="w-3 h-3 text-cyan-400" />
              <span>WASD / Arrow Keys to float</span>
            </div>
            <span className="text-slate-600">|</span>
            <span>Reach distance threshold or step forward</span>
          </motion.div>
        )}
      </div>

      {/* Playable Floating Character Area */}
      <div
        className="relative z-20 flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`
        }}
      >
        <VoxelCharacter
          isWalking={isMoving}
          direction={direction}
          isFloating={true}
          eyesClosed={eyeState < 2}
          scale={1.25}
        />
      </div>

      {/* Awakening Progression Button / Gateway Trigger */}
      {eyeState === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-10 z-30 flex flex-col items-center gap-3"
        >
          <button
            onClick={() => {
              AudioService.playTone(600, 'sine', 0.3, 0.2);
              if (onAwakened) onAwakened();
            }}
            className="group relative px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm tracking-widest rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-cyan-300/40 flex items-center gap-3 active:scale-95 transition-all cursor-pointer"
          >
            <span>APPROACH THE LIGHT GATES</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <span className="text-[11px] text-slate-400 tracking-wider">
            Coordinates calibrated • Space shifted: {Math.round(distanceTraveled)}m
          </span>
        </motion.div>
      )}

      {/* Mobile Virtual Joystick */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            if (onAwakened) onAwakened();
          }}
          actionLabel="GATES"
        />
      </div>
    </div>
  );
}
