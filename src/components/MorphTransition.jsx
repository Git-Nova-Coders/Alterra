import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { GameEngine } from '../utils/gameEngine';
import { AIService } from '../services/aiService';
import WorldCanvasVisual from './WorldCanvasVisual';
import { Sparkles, Terminal, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MorphTransition() {
  const { state, setStage } = useGameState();
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);
  const [aiIdentity, setAiIdentity] = useState({
    title: state.world?.aiTitleFallback || 'SYNTHETIC EPOCH // 01',
    tagline: state.world?.aiTaglineFallback || 'A divergent reality stabilized under user directives.'
  });

  const morphSteps = [
    'WORLD INITIALIZING...',
    'ATMOSPHERE SYNCHRONIZING...',
    'AI SIGNATURE GENERATED...',
    'REALITY STABILIZED'
  ];

  useEffect(() => {
    // Generate AI World Identity / Title / Tagline if service available, else use fallback
    let isMounted = true;
    const synthesizeWorldTagline = async () => {
      try {
        const generated = await AIService.generateWorldIdentity(state);
        if (isMounted && generated) {
          setAiIdentity(generated);
        }
      } catch (err) {
        console.warn('AI world identity fallback used:', err);
      }
    };
    synthesizeWorldTagline();

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 22;
      });
    }, 450);

    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < morphSteps.length - 1 ? prev + 1 : prev));
    }, 550);

    return () => {
      isMounted = false;
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  const worldDNA = GameEngine.generateWorldDNA(state);

  const handleEnterWorld = () => {
    setStage(GAME_STAGES.ROLE_SELECT);
  };

  const isStabilized = progress >= 95;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/40 relative overflow-hidden space-y-6"
      >
        {/* Top Stepper Pill */}
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>M8 & M9 — AI MORPH TRANSITION</span>
        </div>

        {/* Morphing Stages Terminal Stream */}
        <div className="max-w-xl mx-auto space-y-2">
          <div className="h-12 flex items-center justify-center">
            <h2 className="text-xl sm:text-2xl font-cyber font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
              {morphSteps[stepIndex]}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
            <div
              className="bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>DNA: {worldDNA}</span>
            <span className="text-cyan-400 font-bold">{Math.min(progress, 100)}% COMPILED</span>
          </div>
        </div>

        {/* Live Synthesized World Reveal Canvas */}
        <div className="h-[280px] sm:h-[340px] w-full rounded-xl overflow-hidden border border-cyan-500/40 shadow-2xl relative">
          <WorldCanvasVisual
            world={state.world}
            mood={state.mood}
            intensity={state.intensity}
            chaos={state.chaos}
            atmosphere={state.atmosphere}
          />

          {isStabilized && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-lg bg-black/85 backdrop-blur-md border border-cyan-400/50 text-left"
            >
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI RECONFIGURATION COMPLETE: {aiIdentity.title}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans italic">
                "{aiIdentity.tagline}"
              </p>
            </motion.div>
          )}
        </div>

        {/* Action: Enter the World */}
        <div className="pt-2">
          <button
            onClick={handleEnterWorld}
            disabled={!isStabilized}
            className="group relative inline-flex items-center space-x-3 px-10 py-4 rounded-xl font-cyber font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
          >
            <span>ENTER THE GENERATED WORLD</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
