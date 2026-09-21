import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { MOODS, ATMOSPHERES } from '../data/worlds';
import { GAME_STAGES } from '../data/gameState';
import { Sliders, Sun, Eye, Flame, AlertTriangle, ArrowRight, Wand2 } from 'lucide-react';

const ICON_MAP = {
  Sun,
  Eye,
  Flame,
  AlertTriangle
};

export default function WorldDirector() {
  const { state, updateWorldDirector, setStage } = useGameState();
  const { world, mood, intensity, chaos, atmosphere } = state;

  const handleMoodSelect = (moodId) => {
    updateWorldDirector({ mood: moodId });
  };

  const handleAtmosphereSelect = (atmId) => {
    updateWorldDirector({ atmosphere: atmId });
  };

  const handleProceed = () => {
    setStage(GAME_STAGES.MORPHING);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-purple-400 bg-purple-950/40 px-3 py-1 rounded-full border border-purple-500/30">
          <Sliders className="w-3.5 h-3.5" />
          <span>PHASE: WORLD DIRECTOR</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
          CALIBRATE REALITY PHYSICS
        </h2>
        <p className="text-sm font-sans text-slate-400 max-w-xl mx-auto">
          Manipulate atmospheric density, emotional resonance, and entropy constants before initiating the AI reality synthesis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sliders: Intensity & Chaos */}
        <div className="cyber-panel p-6 rounded-xl border border-cyan-500/20 space-y-6">
          <h3 className="font-cyber font-bold text-cyan-300 text-sm tracking-wider uppercase flex items-center space-x-2">
            <span>Entropy & Pressure</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Environmental Intensity</span>
              <span className="text-cyan-400 font-bold">{intensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => updateWorldDirector({ intensity: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Lethargic</span>
              <span>Hyper-Volatile</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Quantum Chaos</span>
              <span className="text-purple-400 font-bold">{chaos}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={chaos}
              onChange={(e) => updateWorldDirector({ chaos: Number(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Deterministic</span>
              <span>Singularity Flux</span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            Current Target World: <span className="text-cyan-300 font-bold">{world?.name || 'Standard Matrix'}</span>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="cyber-panel p-6 rounded-xl border border-cyan-500/20 space-y-4">
          <h3 className="font-cyber font-bold text-cyan-300 text-sm tracking-wider uppercase">
            Emotional Resonance
          </h3>

          <div className="space-y-2.5">
            {MOODS.map((m) => {
              const Icon = ICON_MAP[m.icon] || Sun;
              const isSelected = mood === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center space-x-3 ${
                    isSelected
                      ? 'border-purple-400 bg-purple-950/40 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-cyber font-semibold tracking-wide text-white">
                      {m.label}
                    </div>
                    <div className="text-[10px] font-sans text-slate-400 leading-tight">
                      {m.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atmosphere / Time of Day */}
        <div className="cyber-panel p-6 rounded-xl border border-cyan-500/20 space-y-4">
          <h3 className="font-cyber font-bold text-cyan-300 text-sm tracking-wider uppercase">
            Atmospheric Envelope
          </h3>

          <div className="space-y-2">
            {ATMOSPHERES.map((atm) => {
              const isSelected = atmosphere === atm.id;

              return (
                <div
                  key={atm.id}
                  onClick={() => handleAtmosphereSelect(atm.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-glow-cyan'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-cyber font-semibold text-white">
                    {atm.label}
                  </div>
                  <div className="text-[10px] font-sans text-slate-400">
                    {atm.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-2">
        <button
          onClick={handleProceed}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 hover:from-purple-400 hover:to-cyan-400 transition-all duration-300 shadow-glow-purple"
        >
          <Wand2 className="w-4 h-4" />
          <span>Commence AI World Morphosis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
