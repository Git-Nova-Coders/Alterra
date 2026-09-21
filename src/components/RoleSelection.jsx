import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { ROLES } from '../data/roles';
import { GAME_STAGES } from '../data/gameState';
import { Shield, Compass, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

const ICON_MAP = {
  Compass,
  Terminal,
  Shield
};

export default function RoleSelection() {
  const { state, selectRole, setStage } = useGameState();
  const { role: selectedRole, world } = state;

  const handleSelect = (roleObj) => {
    selectRole(roleObj);
  };

  const handleProceed = () => {
    if (selectedRole) {
      setStage(GAME_STAGES.TRAIT_SELECT);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>M10 — ROLE SELECTION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
          ALIGN CONSCIOUSNESS AVATAR
        </h2>
        <p className="text-sm font-sans text-slate-400 max-w-xl mx-auto">
          Choose your operative archetype. Your role directly unlocks unique interactions, reveals hidden relics, or bypasses digital security systems within <span className="text-cyan-300 font-bold">{world?.name || 'the world'}</span>.
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {ROLES.map((r) => {
          const Icon = ICON_MAP[r.icon] || Compass;
          const isSelected = selectedRole?.id === r.id;

          return (
            <motion.div
              key={r.id}
              whileHover={{ y: -5 }}
              onClick={() => handleSelect(r)}
              className={`cyber-panel cursor-pointer rounded-xl p-6 relative transition-all duration-300 border-2 ${
                isSelected
                  ? 'border-cyan-400 shadow-glow-cyan bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 text-cyan-400 font-mono text-xs bg-cyan-950/90 px-2.5 py-1 rounded border border-cyan-400/50">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ALIGNED</span>
                </div>
              )}

              <div className="w-12 h-12 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
                <Icon className="w-6 h-6" />
              </div>

              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  {r.category}
                </span>
                <h3 className="text-xl font-cyber font-bold text-white">
                  {r.name}
                </h3>
                <p className="text-xs font-mono text-cyan-400 font-semibold">
                  "{r.title}"
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4 min-h-[48px]">
                {r.description}
              </p>

              {/* Gameplay Ability Badge */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-xs font-mono space-y-1">
                <div className="text-slate-400 text-[10px] uppercase">Special Ability:</div>
                <div className="text-cyan-300 font-bold">{r.ability}</div>
                <div className="text-[10px] text-emerald-400 pt-0.5">{r.bonusStat}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-cyan-500/30 bg-slate-950/90 cyber-panel">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Selected Archetype:
          </span>
          <span className="text-sm font-cyber font-bold text-cyan-300">
            {selectedRole ? `${selectedRole.name} — ${selectedRole.ability}` : 'Awaiting Selection (Click a role above)'}
          </span>
        </div>

        <button
          onClick={handleProceed}
          disabled={!selectedRole}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
        >
          <span>Confirm Role & Select Trait</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
