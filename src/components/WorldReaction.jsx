import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { ShieldCheck, Zap, AlertTriangle, ArrowRight, DoorOpen, Sparkles, Activity } from 'lucide-react';

export default function WorldReaction() {
  const { state, setStage } = useGameState();
  const decision = state.artifactDecision || 'save';
  const world = state.world?.name || 'Simulation Matrix';

  const [crackPoints, setCrackPoints] = useState([]);

  useEffect(() => {
    // Generate random cracks if destroy
    if (decision === 'destroy') {
      const points = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        width: `${Math.random() * 120 + 80}px`,
        rotate: `${Math.random() * 360}deg`
      }));
      setCrackPoints(points);
    }
  }, [decision]);

  // Visual states strictly fulfilling M19:
  // SAVE: stabilize environment, brighter lighting, calmer particles
  // CONTROL: glitches, moving objects, warning effects, instability
  // DESTROY: cracks, screen shake, falling particles, environment collapse, new exit

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* 1. VISIBLE TRANSFORMATION: SAVE (Bright, stabilized, calming auras) */}
      {decision === 'save' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/15 via-cyan-500/10 to-transparent" />
          <div className="w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-[140px] animate-pulse" />
          {/* Calmer floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '-10%', opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 6 + (i % 4),
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: 'easeInOut'
                }}
                className="absolute w-2 h-2 rounded-full bg-emerald-300 blur-[1px]"
                style={{ left: `${(i * 5.8) % 100}%` }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* 2. VISIBLE TRANSFORMATION: CONTROL (Glitches, jittering nodes, warning HUD, chromatic aberration) */}
      {decision === 'control' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {/* Chromatic split overlay */}
          <div className="absolute inset-0 bg-purple-950/20 mix-blend-color-dodge animate-pulse" />
          {/* Scanline interference */}
          <div className="absolute inset-0 scanline opacity-70" />
          {/* Moving jittering nodes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, (i % 2 === 0 ? 30 : -30), 0, (i % 2 === 0 ? -20 : 20)],
                y: [0, -25, 20, 0],
                opacity: [0.3, 0.9, 0.4]
              }}
              transition={{
                duration: 1.2 + (i % 3) * 0.4,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute w-6 h-6 border border-purple-400/70 bg-purple-950/60 rounded flex items-center justify-center text-[9px] font-mono text-purple-300"
              style={{
                top: `${(i * 9) + 5}%`,
                left: `${((i * 17) % 85) + 5}%`
              }}
            >
              ERR
            </motion.div>
          ))}
          {/* Warning strobe bar */}
          <div className="absolute top-2 left-0 right-0 py-1 bg-amber-500/20 border-y border-amber-400/40 text-center font-mono text-xs text-amber-300 tracking-widest uppercase animate-pulse">
            ⚠ WARNING: REALITY MATRIX OPERATING AT 185% COMPUTE OVERCLOCK ⚠
          </div>
        </motion.div>
      )}

      {/* 3. VISIBLE TRANSFORMATION: DESTROY (Cracks, screen shake, falling fire embers, emergency exit) */}
      {decision === 'destroy' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {/* Screen shake backdrop */}
          <motion.div
            animate={{
              x: [-4, 4, -3, 3, 0],
              y: [2, -3, 3, -2, 0]
            }}
            transition={{
              duration: 0.25,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="absolute inset-0 bg-rose-950/25"
          />
          {/* Fracture Cracks */}
          {crackPoints.map((cp) => (
            <div
              key={cp.id}
              className="absolute h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-amber-400 shadow-[0_0_15px_#f43f5e]"
              style={{
                top: cp.top,
                left: cp.left,
                width: cp.width,
                transform: `rotate(${cp.rotate})`
              }}
            />
          ))}
          {/* Falling fire/ash particle embers */}
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '-5%', opacity: 0 }}
              animate={{ y: '105%', opacity: [0, 1, 0] }}
              transition={{
                duration: 2.5 + (i % 3),
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeIn'
              }}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-b from-amber-400 to-rose-600 blur-[0.5px]"
              style={{ left: `${(i * 4.3) % 100}%` }}
            />
          ))}
        </motion.div>
      )}

      {/* Interactive HUD Reaction Console */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative z-20 cyber-panel p-8 sm:p-10 rounded-2xl max-w-2xl mx-auto text-center border-2 ${
          decision === 'save'
            ? 'border-emerald-400/80 shadow-[0_0_40px_rgba(16,185,129,0.4)] bg-slate-950/85'
            : decision === 'control'
            ? 'border-purple-400/80 shadow-glow-purple bg-slate-950/85'
            : 'border-rose-500/90 shadow-[0_0_45px_rgba(244,63,94,0.5)] bg-slate-950/85'
        }`}
      >
        <div className="inline-flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-full border mb-4 bg-black/60">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span className="text-white">CONSEQUENCE ENGINE // LIVE REALITY SHIFT</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-cyber font-black text-white tracking-wide uppercase mb-3">
          {decision === 'save' && 'EQUILIBRIUM RESTORED'}
          {decision === 'control' && 'REALITY OVERCLOCKED'}
          {decision === 'destroy' && 'STRUCTURAL COLLAPSE'}
        </h2>

        <p className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">
          World: {world} // Vector: [{decision.toUpperCase()}]
        </p>

        <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
          {decision === 'save' &&
            'The artifact radiates harmonic waves across the sector. Atmospheric turbulence drops to zero, illumination intensifies, and all living matrices hum in stable resonance.'}
          {decision === 'control' &&
            'Raw computational power surges through the biome. Data rain flickers with chromatic anomalies, kinetic nodes vibrate under your command, and alarms ring across the grid.'}
          {decision === 'destroy' &&
            'Fractures rip across the skybox. Seismic tremors tear apart physical geometry as burning embers fall from crumbling structures—blasting open a jagged emergency dimensional rift!'}
        </p>

        {/* Destroy specific bonus indicator: New Exit Available */}
        {decision === 'destroy' && (
          <div className="mb-6 p-3 rounded-lg border border-rose-500/50 bg-rose-950/40 text-xs font-mono text-rose-300 flex items-center justify-center space-x-2">
            <DoorOpen className="w-4 h-4 text-rose-400 animate-bounce" />
            <span className="font-bold">EMERGENCY BREACH EXIT UNLOCKED IN THE COLLAPSE!</span>
          </div>
        )}

        <button
          onClick={() => {
            AudioService.playClick();
            setStage(GAME_STAGES.MINI_CHALLENGE);
          }}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
        >
          <span>Engage Reality Stabilization Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
