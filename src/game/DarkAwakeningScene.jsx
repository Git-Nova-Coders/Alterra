import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoxelCharacter from './VoxelCharacter';
import VirtualJoystick from './VirtualJoystick';
import { AudioService } from '../services/audioService';
import { Sparkles, Eye, Compass, Move, ArrowUpRight, Hand, Waves } from 'lucide-react';

/**
 * 3D Sleeping & Awakening Scene (Phase 1)
 * - Character is shown sleeping horizontally in zero-G void with gentle breathing
 * - Interactive eye-nudging / rubbing clean:
 *   - Player swipes/drags mouse or touches screen, or presses [Space]/[Enter]
 *   - Character raises hands, rubs eyes clean, and straightens up
 *   - Multi-stage vision clearing (Deep Slumber -> 1st Nudge -> 2nd Nudge clean vision)
 * - Waking up reveals the deep dark 3D void space with ambient stardust and floating choice pillars
 */
export default function DarkAwakeningScene({ onAwakened }) {
  // Awakening stages:
  // 0: SLEEPING (horizontal, eyes shut, deep dream blur)
  // 1: FIRST_NUDGE (hands rubbing eyes, slit vision, 50% blur)
  // 2: FULLY_AWAKE (eyes clean, standing upright in 3D void)
  const [awakenStage, setAwakenStage] = useState(0);
  const [nudgeProgress, setNudgeProgress] = useState(0); // 0 to 100%
  const [isNudgingArm, setIsNudgingArm] = useState(false);

  // Position in space once awake
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down');
  const [spaceDust, setSpaceDust] = useState([]);
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  const keysPressed = useRef({});
  const lastStepTime = useRef(0);
  const dragStart = useRef(null);

  // Generate cosmic floating dust
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

  // Trigger eye nudge action
  const performNudge = () => {
    if (awakenStage >= 2) return;

    setIsNudgingArm(true);
    AudioService.playTone(380, 'sine', 0.25, 0.15, 520);

    setTimeout(() => {
      setIsNudgingArm(false);
    }, 650);

    if (awakenStage === 0) {
      setAwakenStage(1);
      setNudgeProgress(50);
      AudioService.playAwakening();
    } else if (awakenStage === 1) {
      setAwakenStage(2);
      setNudgeProgress(100);
      AudioService.playSuccess();
    }
  };

  // Drag / swipe handling to wipe eyes clean
  const handlePointerDown = (e) => {
    if (awakenStage < 2) {
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e) => {
    if (dragStart.current && awakenStage < 2) {
      const dx = Math.abs(e.clientX - dragStart.current.x);
      const dy = Math.abs(e.clientY - dragStart.current.y);
      if (dx > 25 || dy > 25) {
        performNudge();
      }
      dragStart.current = null;
    }
  };

  // Keyboard navigation and spacebar nudging
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;

      // Space or Enter nudges eyes when sleeping
      if ((e.key === ' ' || e.key === 'Enter') && awakenStage < 2) {
        e.preventDefault();
        performNudge();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Movement loop active once fully awake
    const interval = setInterval(() => {
      if (awakenStage < 2) return;

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
  }, [awakenStage]);

  // Mobile joystick input
  const handleJoystickMove = ({ x, y, isMoving: moving, direction: dir }) => {
    if (awakenStage < 2) return;
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
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative w-full min-h-screen bg-[#02050e] overflow-hidden flex flex-col items-center justify-center font-mono select-none"
    >
      {/* Dynamic Nebulae & Particle Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-950/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] bg-indigo-950/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-violet-950/25 rounded-full blur-3xl" />

        {spaceDust.map((dust) => (
          <div
            key={dust.id}
            className="absolute rounded-full bg-white transition-transform duration-75"
            style={{
              left: `${dust.x}%`,
              top: `${dust.y}%`,
              width: `${dust.size}px`,
              height: `${dust.size}px`,
              opacity: awakenStage === 0 ? dust.opacity * 0.3 : dust.opacity,
              boxShadow: `0 0 6px rgba(255,255,255,${dust.opacity})`,
              transform: `translate(${-pos.x * (dust.size / 3)}px, ${-pos.y * (dust.size / 3)}px)`
            }}
          />
        ))}
      </div>

      {/* Realistic Eyelid Shutter & Slumber Blur */}
      <AnimatePresence>
        {awakenStage === 0 && (
          <motion.div
            key="deep-slumber"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <span className="text-4xl animate-bounce">😴</span>
              <p className="text-cyan-400 font-bold text-sm tracking-widest uppercase animate-pulse">
                [ SLUMBERING IN THE VOID ]
              </p>
              <span className="text-xs text-slate-400 max-w-xs">
                You are fast asleep in the dark expanse. Wipe or nudge your eyes to wake up.
              </span>
            </div>
          </motion.div>
        )}

        {awakenStage === 1 && (
          <motion.div
            key="slit-vision"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between"
          >
            {/* Upper eyelid */}
            <motion.div
              animate={{ height: ['45%', '38%', '42%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full bg-black/80 backdrop-blur-md border-b border-cyan-500/30"
            />
            {/* Slit center banner */}
            <div className="w-full flex items-center justify-center">
              <span className="text-cyan-300 font-bold tracking-widest text-[11px] px-3 py-1 bg-black/75 rounded-full border border-cyan-500/40 animate-pulse">
                EYES BLURRY • NUDGE ONCE MORE TO CLEAR
              </span>
            </div>
            {/* Lower eyelid */}
            <motion.div
              animate={{ height: ['45%', '38%', '42%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full bg-black/80 backdrop-blur-md border-t border-cyan-500/30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header HUD: Story & Eye-Nudging Instructions */}
      <div className="absolute top-8 inset-x-0 flex flex-col items-center pointer-events-none z-30 px-4 text-center">
        {awakenStage < 2 ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)] max-w-md pointer-events-auto"
          >
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1.5">
              <Hand className="w-4 h-4 animate-pulse text-amber-400" />
              <span>Nudge Eyes Clean</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed mb-3">
              {awakenStage === 0
                ? 'Your character is floating unconscious. Wipe across the screen or press SPACE to rub your eyes.'
                : 'Vision is hazy! Rub your eyes clean once more to fully wake up.'}
            </p>

            {/* Interactive Nudge Button */}
            <button
              onClick={performNudge}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>{awakenStage === 0 ? '👆 NUDGE EYES AWAKE [SPACE]' : '✨ RUB EYES CLEAN [SPACE]'}</span>
            </button>
          </motion.div>
        ) : (
          /* Awake HUD */
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.15)] max-w-md"
          >
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Prologue: Eyes Open in Dark Space</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              You gaze into the infinite dark void. Ethereal portals resonate in the distance ahead.
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-3 text-xs text-cyan-300/80 bg-slate-950/70 border border-slate-800 px-3 py-1 rounded-full">
              <Move className="w-3 h-3 text-cyan-400" />
              <span>WASD / Joystick to float freely</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 3D Character Rendering Area */}
      <div
        className="relative z-20 flex items-center justify-center transition-all duration-300"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`
        }}
      >
        <VoxelCharacter
          isWalking={isMoving}
          direction={direction}
          isFloating={awakenStage === 2}
          isSleeping={awakenStage === 0}
          isNudgingEyes={isNudgingArm}
          eyesClosed={awakenStage < 2}
          scale={1.4}
        />
      </div>

      {/* Gateway Transit CTA once awake */}
      {awakenStage === 2 && (
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
            Space navigated: {Math.round(distanceTraveled)}m
          </span>
        </motion.div>
      )}

      {/* Mobile Virtual Joystick */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            if (awakenStage < 2) performNudge();
            else if (onAwakened) onAwakened();
          }}
          actionLabel={awakenStage < 2 ? 'NUDGE' : 'GATES'}
        />
      </div>
    </div>
  );
}

