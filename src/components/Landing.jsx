import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { Sparkles, Terminal, ArrowRight, Compass, ShieldAlert, Cpu } from 'lucide-react';

export default function Landing() {
  const { setStage } = useGameState();

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-6 relative z-10"
      >
        {/* Futuristic Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 font-mono text-xs tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>REALITY RECONFIGURATION PROTOCOL ACTIVE</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cyber font-black tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(0,240,255,0.2)]">
          AL<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">TERRA</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl text-cyan-200/90 font-mono tracking-widest uppercase">
          Your World. Your Choices. Your Reality.
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          You don't just explore a pre-built world. You sculpt its atmospheric physics, trigger an AI morphosis, step directly into the simulated environment, and navigate consequences that forge a personalized reality.
        </p>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left max-w-3xl mx-auto">
          <div className="cyber-panel p-4 rounded-lg border border-cyan-500/20">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1.5">
              <Compass className="w-4 h-4" />
              <span className="font-bold">GENESIS</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Choose from 3 core archetypes & tune atmospheric chaos & intensity.
            </p>
          </div>

          <div className="cyber-panel p-4 rounded-lg border border-cyan-500/20">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs mb-1.5">
              <Cpu className="w-4 h-4" />
              <span className="font-bold">MORPHOSIS</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              AI transforms your parameters into an active, living game board.
            </p>
          </div>

          <div className="cyber-panel p-4 rounded-lg border border-cyan-500/20">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span className="font-bold">CONVERGENCE</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Interactive challenges, artifact discoveries, and synthesized endings.
            </p>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setStage(GAME_STAGES.AWAKENING)}
            className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-cyber font-black text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 hover:brightness-110 active:scale-95 transition-all duration-300 shadow-[0_0_35px_rgba(6,182,212,0.4)] border border-white/50 cursor-pointer"
          >
            <span>Awaken into 3D World</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setStage(GAME_STAGES.WORLD_SELECT)}
            className="group inline-flex items-center space-x-2 px-6 py-4 rounded-xl font-mono font-bold text-xs tracking-wider uppercase border border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Direct Portal Gates</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
