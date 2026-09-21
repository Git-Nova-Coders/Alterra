import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { DecisionEngine } from '../utils/decisionEngine';
import { AudioService } from '../services/audioService';
import { Compass, RefreshCw, Sparkles, CheckCircle2, Shield, Radio, Layers, Share2 } from 'lucide-react';

export default function RealitySummary() {
  const { state, setStage, resetGame } = useGameState();

  const dna = DecisionEngine.generateWorldDNA(state);
  const ending = state.aiEnding || {
    title: 'The Unwritten Reality',
    verdict: 'Quantum Divergence',
    epilogue: 'The simulation resolved into an uncharted timeline.'
  };

  const handleReplay = () => {
    AudioService.playClick();
    resetGame();
    setStage(GAME_STAGES.WORLD_SELECT);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-4 py-1 rounded-full border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REALITY PROFILE COMPLETE // ARCHIVE 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-cyber font-black tracking-wide text-white uppercase drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          YOUR REALITY
        </h1>
        <p className="text-xs sm:text-sm font-mono text-cyan-300">
          GENOME SIGNATURE: <span className="text-white font-bold">{dna.dnaHash}</span>
        </p>
      </div>

      {/* Main Grid: World DNA Metrics + Ending Chronicle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chronicle & Choices Ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ending Dossier Card */}
          <div className="cyber-panel p-6 sm:p-8 rounded-2xl border border-cyan-400/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  Ending Archetype
                </span>
                <h3 className="text-xl sm:text-2xl font-cyber font-bold text-white uppercase">
                  {ending.title}
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                {ending.verdict}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans mb-4">
              "{ending.epilogue}"
            </p>

            {/* Secret Easter Egg discovery badge */}
            {dna.easterEggDiscovered && (
              <div className="p-3 rounded-lg border border-purple-500/50 bg-purple-950/40 text-xs font-mono text-purple-300 flex items-center space-x-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>
                  <strong>Secret Discovered:</strong> "This reality remembers choices you haven't made yet."
                </span>
              </div>
            )}
          </div>

          {/* Key Decisions Audit Trail */}
          <div className="cyber-panel p-6 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Causal Decisions Audit Trail:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              {dna.keyChoices.map((choice, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block mb-1 uppercase">
                    {choice.title}
                  </span>
                  <span className="text-cyan-300 font-bold block truncate">
                    {choice.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: M26 World DNA Visual Bar Matrix */}
        <div className="cyber-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 mb-4">
              <Shield className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">World DNA Indices</span>
            </div>

            <div className="space-y-4">
              {dna.metrics.map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{m.label}</span>
                    <span className="text-white font-bold">{m.value}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        m.color === 'purple'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                          : m.color === 'amber'
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : m.color === 'emerald'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${m.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] font-mono text-slate-400">
            Every variation in artifact harmonizing and gateway convergence shifts these DNA values deterministically.
          </div>
        </div>
      </div>

      {/* Replay & Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handleReplay}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-glow-cyan"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Forge Another Reality (Replay)</span>
        </button>

        <button
          onClick={() => {
            AudioService.playClick();
            setStage(GAME_STAGES.WORLD_SELECT);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase border border-cyan-500/40 bg-slate-900 hover:bg-cyan-950/40 text-cyan-300 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Test Different Decision Path</span>
        </button>
      </div>
    </div>
  );
}
