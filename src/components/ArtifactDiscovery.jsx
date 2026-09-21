import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { Cpu, Sparkles, Key, Radio, ArrowRight } from 'lucide-react';

export default function ArtifactDiscovery() {
  const { state, setStage } = useGameState();
  const worldId = state.world?.id || 'cyber';

  useEffect(() => {
    AudioService.playArtifactAwaken();
  }, []);

  // Visual model for the artifact based on M17:
  // Cyber -> Quantum Core
  // Fantasy -> Heart of the Forest
  // Mystery -> Signal Key
  const getArtifactVisual = () => {
    if (worldId === 'fantasy') {
      return {
        name: 'Heart of the Forest',
        themeColor: '#10b981',
        icon: Sparkles,
        lore: 'A petrified emerald nucleus holding the dormant memories of an elder sylvan ecosystem. Its pulsating bioluminescent veins resonate with ancient primeval breath.',
        particlesClass: 'bg-emerald-400',
        coreRender: (
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
            <div className="w-28 h-28 rounded-full border-2 border-emerald-400/80 bg-gradient-to-tr from-emerald-950 via-teal-900 to-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.6)] flex items-center justify-center animate-spin" style={{ animationDuration: '16s' }}>
              <div className="w-16 h-16 rounded-full border border-emerald-300/60 bg-emerald-400/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-200 animate-pulse" />
              </div>
            </div>
          </div>
        )
      };
    } else if (worldId === 'mystery') {
      return {
        name: 'Signal Key',
        themeColor: '#a855f7',
        icon: Key,
        lore: 'A gravimetric shard that vibrates inversely to real-world spacetime. Subspace frequencies decode through its crystalline fracture lines.',
        particlesClass: 'bg-purple-400',
        coreRender: (
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse" />
            <div className="w-24 h-32 rounded-lg border-2 border-purple-400/80 bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-700 shadow-glow-purple flex items-center justify-center transform rotate-12 animate-pulse">
              <Key className="w-10 h-10 text-purple-200 transform -rotate-12" />
            </div>
          </div>
        )
      };
    }
    // Cyber default
    return {
      name: 'Quantum Core',
      themeColor: '#00f0ff',
      icon: Cpu,
      lore: 'A self-contained zero-point energy cube humming with computational sentience. It cycles infinite timeline calculations every millisecond.',
      particlesClass: 'bg-cyan-400',
      coreRender: (
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-3xl animate-pulse" />
          <div className="w-28 h-28 rounded-2xl border-2 border-cyan-400 bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-900 shadow-glow-cyan flex items-center justify-center transform rotate-45 animate-spin" style={{ animationDuration: '24s' }}>
            <div className="w-14 h-14 rounded-lg border border-cyan-300 bg-cyan-400/30 flex items-center justify-center transform -rotate-45">
              <Cpu className="w-8 h-8 text-cyan-200 animate-pulse" />
            </div>
          </div>
        </div>
      )
    };
  };

  const artifact = getArtifactVisual();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="cyber-panel p-8 sm:p-12 rounded-3xl border-2 border-cyan-400/40 relative overflow-hidden"
      >
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-4 py-1.5 rounded-full border border-cyan-500/40 mb-6">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
          <span>SANCTUM THRESHOLD BREACHED</span>
        </div>

        {/* Central visual relic */}
        <div className="flex justify-center my-6">
          {artifact.coreRender}
        </div>

        <h2 className="text-3xl sm:text-5xl font-cyber font-black tracking-wider text-white mb-2 uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          {artifact.name}
        </h2>

        <p className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400 uppercase mb-4">
          World Keystone // Quantum Resonance Synchronized
        </p>

        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-sans mb-8">
          {artifact.lore}
        </p>

        {/* Action Button to Artifact Decision */}
        <div>
          <button
            onClick={() => {
              AudioService.playClick();
              setStage(GAME_STAGES.ARTIFACT_DECISION);
            }}
            className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-glow-cyan"
          >
            <span>Commune With Relic Energy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
