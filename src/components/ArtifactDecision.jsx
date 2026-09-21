import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { ShieldCheck, Cpu, Flame, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ArtifactDecision() {
  const { state, dispatch, setStage } = useGameState();
  const [selectedDecision, setSelectedDecision] = useState(state.artifactDecision || null);

  const artifactName = state.world?.artifact || 'The Keystone';

  // Decisions adhering strictly to M18:
  // THE ARTIFACT HAS AWAKENED.
  // [SAVE] [CONTROL] [DESTROY]
  const decisions = [
    {
      id: 'save',
      label: 'SAVE',
      tagline: 'Preserve & Harmonize',
      icon: ShieldCheck,
      color: 'emerald',
      borderColor: 'border-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
      effects: [
        'Stabilizes regional environmental matrix',
        'Amplifies ambient lighting & clarity',
        'Calms chaotic particles to serene float',
        'Protects the simulation against catastrophic collapse'
      ]
    },
    {
      id: 'control',
      label: 'CONTROL',
      tagline: 'Subjugate & Overclock',
      icon: Cpu,
      color: 'purple',
      borderColor: 'border-purple-400',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.35)]',
      effects: [
        'Injects synthetic overclock protocols',
        'Triggers visual glitch shaders & chromatic distortion',
        'Forces kinetic objects into erratic oscillations',
        'Flashes emergency alert telemetry warnings'
      ]
    },
    {
      id: 'destroy',
      label: 'DESTROY',
      tagline: 'Shatter & Unshackle',
      icon: Flame,
      color: 'crimson',
      borderColor: 'border-rose-500',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.4)]',
      effects: [
        'Fractures reality grid with visceral seismic tremors',
        'Violent screen shake & falling fire embers',
        'Initiates structural matrix collapse',
        'Blows open an emergency breach exit'
      ]
    }
  ];

  const handleSelect = (decisionId) => {
    AudioService.playClick();
    setSelectedDecision(decisionId);
    dispatch({ type: GAME_ACTIONS.SET_ARTIFACT_DECISION, payload: decisionId });
  };

  const handleConfirm = () => {
    if (!selectedDecision) return;
    // Play world reaction audio
    AudioService.playWorldReaction(selectedDecision);
    setStage(GAME_STAGES.WORLD_REACTION);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Dramatic Prompt */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>REALITY CONVERGENCE POINT</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-cyber font-black tracking-wider text-white uppercase drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
          THE ARTIFACT HAS AWAKENED.
        </h1>

        <p className="text-sm font-sans text-slate-300 max-w-xl mx-auto">
          The <span className="text-cyan-300 font-bold">{artifactName}</span> pulses with sovereign energy. What will you do with the heart of this world?
        </p>
      </div>

      {/* 3 Decision Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {decisions.map((d) => {
          const isSelected = selectedDecision === d.id;
          const Icon = d.icon;

          return (
            <motion.div
              key={d.id}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => handleSelect(d.id)}
              className={`cyber-panel p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? `${d.borderColor} ${d.glow} bg-slate-900/90`
                  : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-${d.color === 'crimson' ? 'rose-400' : d.color + '-400'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-400/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>COMMITTED</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-cyber font-black text-white tracking-wide mb-1">
                  [{d.label}]
                </h2>
                <p className="text-xs font-mono text-cyan-400 mb-4">{d.tagline}</p>

                <div className="space-y-2 border-t border-slate-800/80 pt-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    Visible Consequences:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {d.effects.map((effect, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-cyan-400 text-xs leading-none">•</span>
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div
                  className={`w-full py-2.5 text-center rounded-lg font-cyber font-bold text-xs uppercase tracking-wider transition-colors ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 shadow-glow-cyan'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {isSelected ? `Selected: ${d.label}` : `Choose ${d.label}`}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleConfirm}
          disabled={!selectedDecision}
          className="inline-flex items-center space-x-3 px-10 py-4 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
        >
          <span>Unleash World Transformation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
