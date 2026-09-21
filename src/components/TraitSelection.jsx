import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { TRAITS } from '../data/roles';
import { GAME_STAGES } from '../data/gameState';
import { Sparkles, ArrowRight, CheckCircle2, Flame, Eye, ShieldAlert } from 'lucide-react';

const ICON_MAP = {
  brave: Flame,
  curious: Eye,
  cautious: ShieldAlert
};

export default function TraitSelection() {
  const { state, selectTrait, setStage } = useGameState();
  const { trait: selectedTrait, role, world } = state;

  const handleSelect = (traitObj) => {
    selectTrait(traitObj);
  };

  const handleProceed = () => {
    if (selectedTrait) {
      setStage(GAME_STAGES.EXPLORATION);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/40 px-3.5 py-1.5 rounded-full border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>M11 — TRAIT SELECTION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
          ATTUNE OPERATIONAL TRAIT
        </h2>
        <p className="text-sm font-sans text-slate-400 max-w-xl mx-auto">
          Operational traits dictate behavioral instincts and risk thresholds during moral encounters and environmental hazards.
        </p>
      </div>

      {/* Traits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {TRAITS.map((t) => {
          const Icon = ICON_MAP[t.id] || Sparkles;
          const isSelected = selectedTrait?.id === t.id;

          return (
            <motion.div
              key={t.id}
              whileHover={{ y: -5 }}
              onClick={() => handleSelect(t)}
              className={`cyber-panel cursor-pointer rounded-xl p-6 relative transition-all duration-300 border-2 ${
                isSelected
                  ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 text-amber-400 font-mono text-xs bg-amber-950/90 px-2.5 py-1 rounded border border-amber-400/50">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ATTUNED</span>
                </div>
              )}

              <div
                className="w-12 h-12 rounded-lg bg-slate-900 border flex items-center justify-center mb-4"
                style={{ borderColor: `${t.accentColor}50`, color: t.accentColor }}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="space-y-1 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  Vector: {t.badge}
                </span>
                <h3 className="text-xl font-cyber font-bold text-white">
                  {t.name}
                </h3>
                <p className="text-xs font-mono text-amber-400">
                  {t.tagline}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4 min-h-[48px]">
                {t.description}
              </p>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block text-[10px] uppercase mb-0.5">Gameplay Modifier:</span>
                <span className="text-amber-300 font-medium">
                  {t.id === 'brave' && 'Grants bold high-risk encounter vectors.'}
                  {t.id === 'curious' && 'Reveals extra sensory clues in the scene.'}
                  {t.id === 'cautious' && 'Reduces negative fallout from danger.'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-amber-500/30 bg-slate-950/90 cyber-panel">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Loadout Synthesis:
          </span>
          <span className="text-sm font-cyber font-bold text-amber-300">
            {role?.name || 'Operative'} // {selectedTrait ? selectedTrait.name : 'Awaiting Trait'}
          </span>
        </div>

        <button
          onClick={handleProceed}
          disabled={!selectedTrait}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:from-amber-400 hover:to-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-amber"
        >
          <span>Enter World & Begin Exploration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
