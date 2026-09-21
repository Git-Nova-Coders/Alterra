import React from 'react';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

export default function GenericStageViewer({ stageName, title, description, nextStageName, icon: Icon = Sparkles }) {
  const { setStage } = useGameState();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="cyber-panel p-8 rounded-2xl border border-cyan-500/20 space-y-6">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
          <Icon className="w-3.5 h-3.5" />
          <span>STAGE: {stageName}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white tracking-wide">
          {title}
        </h2>

        <p className="text-sm font-sans text-slate-300 max-w-lg mx-auto leading-relaxed">
          {description}
        </p>

        <div className="pt-4">
          <button
            onClick={() => setStage(nextStageName)}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
          >
            <span>Proceed to {nextStageName.replace('_', ' ')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
