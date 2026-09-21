import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { GameEngine } from '../utils/gameEngine';
import { Sparkles, Terminal, Cpu, ArrowRight } from 'lucide-react';

export default function MorphTransition() {
  const { state, setStage } = useGameState();
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  const morphSteps = [
    'Synthesizing procedural terrain heightmaps...',
    `Calibrating quantum chaos at ${state.chaos}%...`,
    `Injecting ${state.mood.toUpperCase()} emotional shaders...`,
    `Infusing ${state.world?.artifact || 'Keystone'} artifact harmonic resonance...`,
    'Simulation matrices stabilized. Ready for consciousness upload.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 17;
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < morphSteps.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(stepTimer);
  }, [morphSteps.length]);

  const worldDNA = GameEngine.generateWorldDNA(state);

  const handleEnterWorld = () => {
    setStage(GAME_STAGES.WORLD_READY);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-panel p-8 rounded-2xl border border-cyan-500/30 relative overflow-hidden"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-cyan-400 flex items-center justify-center bg-cyan-950/40 relative">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-ping" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white mb-2">
          REALITY MORPHOSIS IN PROGRESS
        </h2>

        <p className="text-xs font-mono text-cyan-400 mb-6">
          Target: {state.world?.name || 'Default Grid'} // World DNA: <span className="text-white">{worldDNA}</span>
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700/80 mb-4">
          <div
            className="bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Dynamic Console Telemetry */}
        <div className="bg-black/60 rounded-lg p-3 border border-slate-800 text-left font-mono text-xs text-cyan-300 space-y-1 min-h-[70px] flex items-center">
          <Terminal className="w-4 h-4 text-cyan-400 inline-block mr-2 flex-shrink-0" />
          <span className="animate-pulse">{morphSteps[stepIndex]}</span>
        </div>

        {/* Ready to enter button */}
        <div className="mt-8">
          <button
            onClick={handleEnterWorld}
            disabled={progress < 70}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
          >
            <span>Enter Synthesized World</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
