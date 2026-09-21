import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { ROLES, TRAITS } from '../data/roles';
import { AudioService } from '../services/audioService';
import { Shield, Sparkles, Terminal, Compass, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  Terminal,
  Compass,
  Cpu
};

export default function RoleTraitSelection() {
  const { state, selectRole, selectTrait, setStage } = useGameState();

  const handleRole = (role) => {
    AudioService.playClick();
    selectRole(role);
  };

  const handleTrait = (trait) => {
    AudioService.playClick();
    selectTrait(trait);
  };

  const handleProceed = () => {
    AudioService.playClick();
    setStage(GAME_STAGES.EXPLORATION);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>AVATAR ATTUNEMENT MATRIX</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
          ALIGN CONSCIOUSNESS ARCHETYPE
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Calibrate your operational identity and instinctive trait. Your configuration actively alters detection parameters and challenge mechanics.
        </p>
      </div>

      {/* Role Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-cyber font-bold tracking-wider text-cyan-300 uppercase flex items-center space-x-2">
          <span>1. Operational Role</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map((r) => {
            const isSelected = state.role?.id === r.id;
            const Icon = ICON_MAP[r.icon] || Shield;
            return (
              <motion.div
                key={r.id}
                whileHover={{ y: -4 }}
                onClick={() => handleRole(r)}
                className={`cyber-panel p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-glow-cyan'
                    : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{r.emoji}</span>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-400/40">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ALIGNED</span>
                    </span>
                  )}
                </div>
                <h4 className="text-base font-cyber font-bold text-white mb-1">{r.name}</h4>
                <p className="text-xs text-cyan-400 font-mono mb-2">{r.category}</p>
                <p className="text-xs text-slate-300 mb-3">{r.description}</p>
                <div className="text-[11px] font-mono p-2 rounded bg-slate-900/80 border border-slate-800 text-amber-300">
                  {r.bonusStat}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trait Selection */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-cyber font-bold tracking-wider text-cyan-300 uppercase flex items-center space-x-2">
          <span>2. Instinctive Trait</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRAITS.map((t) => {
            const isSelected = state.trait?.id === t.id;
            return (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                onClick={() => handleTrait(t)}
                className={`cyber-panel p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/40 shadow-glow-purple'
                    : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-purple-300">
                      {t.badge}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-400/40">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ATTUNED</span>
                    </span>
                  )}
                </div>
                <h4 className="text-base font-cyber font-bold text-white mb-1">{t.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{t.effect}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={handleProceed}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
        >
          <span>Step Into Simulation Sector</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
