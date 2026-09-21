import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { WORLD_ENCOUNTERS } from '../data/objectsAndEncounters';
import { GAME_STAGES } from '../data/gameState';
import WorldCanvasVisual from './WorldCanvasVisual';
import {
  HeartHandshake,
  EyeOff,
  ZapOff,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Shield,
  Activity,
  CheckCircle2
} from 'lucide-react';

const ICON_MAP = {
  HeartHandshake,
  EyeOff,
  ZapOff
};

export default function Encounter() {
  const { state, dispatch, setStage } = useGameState();
  const { world, role, trait, encounterChoice, mood, intensity, chaos, atmosphere } = state;

  const worldId = world?.id || 'cyber';
  const encounterData = WORLD_ENCOUNTERS[worldId] || WORLD_ENCOUNTERS.cyber;

  const [selectedOption, setSelectedOption] = useState(
    encounterChoice ? encounterData.options.find(o => o.id === encounterChoice) : null
  );

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);

    // Update state encounterChoice
    dispatch({ type: 'SET_ENCOUNTER_CHOICE', payload: opt.id });

    // Apply chaos modification to world
    const newChaos = Math.min(100, Math.max(0, (chaos || 50) + opt.consequence.chaosChange));
    dispatch({
      type: 'UPDATE_WORLD_DIRECTOR',
      payload: { chaos: newChaos }
    });

    // If consequence grants an item, add it to inventory
    if (opt.consequence.rewardItem) {
      dispatch({
        type: 'ADD_INVENTORY_ITEM',
        payload: opt.consequence.rewardItem
      });
    }
  };

  const handleProceedToConsequence = () => {
    setStage(GAME_STAGES.CONSEQUENCE);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-red-400 bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-500/30">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>M15 & M16 — FIRST CRITICAL ENCOUNTER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white tracking-wide">
          {encounterData.entityName}
        </h2>
        <p className="text-xs sm:text-sm font-mono text-cyan-400">
          {encounterData.entitySubtitle}
        </p>
      </div>

      {/* Main Grid: Visual Scene + Dilemma Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left 5 cols: Atmospheric Viewport */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="h-[260px] sm:h-[320px] w-full rounded-xl overflow-hidden border border-red-500/40 shadow-xl">
            <WorldCanvasVisual
              world={world}
              mood={mood}
              intensity={intensity}
              chaos={chaos}
              atmosphere={atmosphere}
            />
          </div>

          <div className="cyber-panel p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Entropy Shift Vector:</span>
              <span className={selectedOption ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                {selectedOption ? `${selectedOption.consequence.chaosChange > 0 ? '+' : ''}${selectedOption.consequence.chaosChange}% Chaos` : 'Awaiting Choice'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Trait Instinct:</span>
              <span className="text-amber-400 font-semibold">{trait?.name || 'Brave'}</span>
            </div>
          </div>
        </div>

        {/* Right 7 cols: Narrative & Branching Decisions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="cyber-panel p-5 rounded-xl border border-cyan-500/30 space-y-3">
            <h3 className="font-cyber font-bold text-xs uppercase tracking-wider text-cyan-300">
              SITUATION REPORT
            </h3>
            <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
              {encounterData.description}
            </p>
            <p className="text-xs font-mono text-amber-300/90 italic pt-1 border-t border-slate-800">
              "{encounterData.dilemma}"
            </p>
          </div>

          {/* Meaningful Choices: HELP / HIDE / TAKE */}
          <div className="space-y-3">
            {encounterData.options.map((opt) => {
              const Icon = ICON_MAP[opt.icon] || Sparkles;
              const isSelected = selectedOption?.id === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`cyber-panel p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? opt.id === 'help'
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : opt.id === 'hide'
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'border-red-400 bg-red-950/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : 'border-slate-800 hover:border-slate-600 bg-slate-950/70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded-lg ${
                        opt.id === 'help'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : opt.id === 'hide'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-red-950 text-red-400 border border-red-500/30'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-cyber font-bold text-sm text-white">
                          [{opt.actionLabel}] — {opt.title}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          Branching Consequence Vector
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center space-x-1 text-xs font-mono font-bold text-cyan-300 bg-black/60 px-2 py-0.5 rounded border border-cyan-400/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>CHOSEN</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-sans text-slate-300 leading-relaxed mb-2.5">
                    {opt.description}
                  </p>

                  {/* Immediate Consequence Preview */}
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="text-slate-400">
                      Consequence: <span className="text-white font-sans">{opt.consequence.summary}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[10px]">
                      <span className={opt.consequence.chaosChange <= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        Entropy: {opt.consequence.chaosChange > 0 ? `+${opt.consequence.chaosChange}%` : `${opt.consequence.chaosChange}%`}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="text-amber-300">
                        Gain: {opt.consequence.rewardItem?.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation & Consequence Engine CTA */}
      <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-950/90 cyber-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Locked Decision:
          </span>
          <span className="text-sm font-cyber font-bold text-cyan-300">
            {selectedOption ? `${selectedOption.actionLabel}: ${selectedOption.title}` : 'Select HELP, HIDE, or TAKE above'}
          </span>
        </div>

        <button
          onClick={handleProceedToConsequence}
          disabled={!selectedOption}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-red-500 to-amber-600 text-slate-950 hover:from-red-400 hover:to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-amber"
        >
          <span>Lock In Choice & Trigger Consequence</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
