import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { DoorOpen, Anchor, ArrowRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';

export default function FinalDecision() {
  const { state, dispatch, setStage } = useGameState();
  const [selectedChoice, setSelectedChoice] = useState(state.finalDecision || null);

  const handleSelect = (decision) => {
    AudioService.playClick();
    setSelectedChoice(decision);
    dispatch({
      type: GAME_ACTIONS.SET_FINAL_DECISION,
      payload: { decision, endingType: `${state.world?.id}_${state.artifactDecision}_${decision}` }
    });
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    AudioService.playClick();
    setStage(GAME_STAGES.AI_ENDING);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-center">
      {/* Stage Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FINAL CONVERGENCE NEXUS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-cyber font-black tracking-wider text-white uppercase drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
          THE GATEWAY IS OPEN.
        </h1>

        <p className="text-sm font-sans text-slate-300 max-w-xl mx-auto leading-relaxed">
          The dimensional threshold hums before you. All prior actions—your world creation, your chosen role, the artifact's fate, and your neural synchronization—now converge into a single definitive choice.
        </p>
      </div>

      {/* Decision Cards: ESCAPE vs STAY strictly per M21 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
        {/* ESCAPE */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          onClick={() => handleSelect('escape')}
          className={`cyber-panel p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
            selectedChoice === 'escape'
              ? 'border-cyan-400 shadow-glow-cyan bg-slate-900/90'
              : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🚀</span>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400">
                  <DoorOpen className="w-5 h-5" />
                </div>
              </div>
              {selectedChoice === 'escape' && (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-400/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>TARGETED</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl font-cyber font-black text-white tracking-wide mb-1 flex items-center space-x-2">
              <span>🚀</span>
              <span>[ESCAPE]</span>
            </h2>
            <p className="text-xs font-mono text-cyan-400 mb-4">Ascend Beyond Boundaries</p>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              Step through the dimensional portal, leaving this simulated ecosystem behind into higher planes. 🌌
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-cyan-300 block">
              Vector: 🌌 Multiverse Traveler
            </span>
          </div>
        </motion.div>

        {/* STAY */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          onClick={() => handleSelect('stay')}
          className={`cyber-panel p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
            selectedChoice === 'stay'
              ? 'border-purple-400 shadow-glow-purple bg-slate-900/90'
              : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🏰</span>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-purple-400">
                  <Anchor className="w-5 h-5" />
                </div>
              </div>
              {selectedChoice === 'stay' && (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-purple-400 bg-purple-950 px-2.5 py-1 rounded border border-purple-400/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>TARGETED</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl font-cyber font-black text-white tracking-wide mb-1 flex items-center space-x-2">
              <span>🏰</span>
              <span>[STAY]</span>
            </h2>
            <p className="text-xs font-mono text-purple-400 mb-4">Anchor Your Sovereignty</p>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              Bond your consciousness with this transformed atmosphere, becoming its eternal guardian or sovereign. 🛡️
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-purple-300 block">
              Vector: 🛡️ Eternal Sovereign
            </span>
          </div>
        </motion.div>
      </div>

      {/* Confirmation */}
      <div className="pt-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedChoice}
          className="inline-flex items-center space-x-3 px-10 py-4 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
        >
          <span>Synthesize Final Reality Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
