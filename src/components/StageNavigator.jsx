import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import { GAME_STAGES, STAGE_FLOW_ORDER } from '../data/gameState';
import { ChevronLeft, ChevronRight, Layers, Sliders } from 'lucide-react';

export default function StageNavigator() {
  const { state, setStage, nextStage, prevStage } = useGameState();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentIndex = STAGE_FLOW_ORDER.indexOf(state.currentStage);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
      <div className="cyber-panel rounded-xl px-4 py-2.5 shadow-2xl border border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded hover:bg-cyan-950/40 text-cyan-400 flex items-center space-x-1 text-xs font-mono"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Stage Flow Matrix</span>
            </button>
            <div className="text-xs font-mono text-slate-400">
              [<span className="text-cyan-300 font-bold">{currentIndex + 1}</span>/{STAGE_FLOW_ORDER.length}]
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevStage}
              disabled={currentIndex === 0}
              className="p-1.5 rounded border border-slate-700 hover:border-cyan-500/50 bg-slate-900/50 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-300 transition-colors"
              title="Previous Phase"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 tracking-wider">
              {state.currentStage}
            </span>

            <button
              onClick={nextStage}
              disabled={currentIndex === STAGE_FLOW_ORDER.length - 1}
              className="p-1.5 rounded border border-slate-700 hover:border-cyan-500/50 bg-slate-900/50 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-300 transition-colors"
              title="Next Phase"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Quick Nav Matrix */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <p className="text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-widest">
              Direct Stage Teleportation (Architect Debug Console):
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[10px] font-mono">
              {STAGE_FLOW_ORDER.map((stage, idx) => {
                const isActive = stage === state.currentStage;
                return (
                  <button
                    key={stage}
                    onClick={() => {
                      setStage(stage);
                      setIsExpanded(false);
                    }}
                    className={`py-1 px-1.5 rounded text-center truncate border transition-all ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold shadow-glow-cyan'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                    title={stage}
                  >
                    {idx + 1}. {stage.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
