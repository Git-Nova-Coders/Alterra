import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { WORLD_ENCOUNTERS } from '../data/objectsAndEncounters';
import { GAME_STAGES } from '../data/gameState';
import WorldCanvasVisual from './WorldCanvasVisual';
import { Activity, ArrowRight, CheckCircle2, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

export default function Consequence() {
  const { state, setStage } = useGameState();
  const { world, role, trait, encounterChoice, mood, intensity, chaos, atmosphere, inventory } = state;

  const worldId = world?.id || 'cyber';
  const encounterData = WORLD_ENCOUNTERS[worldId] || WORLD_ENCOUNTERS.cyber;
  const chosenOption = encounterData.options.find(o => o.id === encounterChoice) || encounterData.options[0];

  const handleProceedToArtifact = () => {
    setStage(GAME_STAGES.ARTIFACT);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/40 space-y-6"
      >
        {/* Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
            <Activity className="w-3.5 h-3.5" />
            <span>M16 — BRANCHING CONSEQUENCE MANIFESTATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white tracking-wide">
            THE WORLD REACTS TO YOUR CHOICE
          </h2>
          <p className="text-xs sm:text-sm font-sans text-slate-300">
            Your decision to <span className="text-cyan-300 font-bold uppercase">[{chosenOption.actionLabel}]</span> reverberated across the regional reality matrix.
          </p>
        </div>

        {/* Live Visual Canvas Reflecting New Reactive Chaos & Lighting */}
        <div className="h-[240px] sm:h-[300px] w-full rounded-xl overflow-hidden border border-cyan-500/40 shadow-2xl relative">
          <WorldCanvasVisual
            world={world}
            mood={mood}
            intensity={intensity}
            chaos={chaos}
            atmosphere={atmosphere}
          />
        </div>

        {/* Consequence Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400">Moral Vector:</div>
            <div className="text-sm font-cyber font-bold text-cyan-300">
              {chosenOption.title}
            </div>
            <p className="text-xs text-slate-300 font-sans">
              {chosenOption.consequence.statBonus}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400">Quantum Chaos Gauge:</div>
            <div className={`text-sm font-cyber font-bold ${chaos > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
              {chaos}% Entropy
            </div>
            <p className="text-xs text-slate-300 font-sans">
              {chosenOption.consequence.chaosChange <= 0 ? 'Simulation stabilized' : 'Environmental volatility spiked'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400">New Item Secured:</div>
            <div className="text-sm font-cyber font-bold text-amber-300">
              {chosenOption.consequence.rewardItem?.name || 'Tactical Insight'}
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Active in inventory for subsequent stages.
            </p>
          </div>
        </div>

        {/* Environmental Shift Description */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs font-mono text-cyan-200">
          <span className="text-slate-400 block mb-1">Atmospheric Observation:</span>
          "{chosenOption.consequence.worldReaction}"
        </div>

        {/* Next Stage Navigation */}
        <div className="text-center pt-2">
          <button
            onClick={handleProceedToArtifact}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
          >
            <span>Proceed to Artifact Sanctum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
