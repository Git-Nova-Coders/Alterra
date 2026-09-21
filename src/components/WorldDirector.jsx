import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { MOODS, ATMOSPHERES } from '../data/worlds';
import { GAME_STAGES } from '../data/gameState';
import WorldCanvasVisual from './WorldCanvasVisual';
import { Sliders, Sun, Eye, Flame, AlertTriangle, ArrowRight, Wand2, Sparkles, Activity } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-purple-400 bg-purple-950/40 px-3 py-1 rounded-full border border-purple-500/30">
          <Sliders className="w-3.5 h-3.5" />
          <span>M6 & M7 — YOU ARE THE DIRECTOR</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
          CALIBRATE REALITY PHYSICS
        </h2>
        <p className="text-sm font-sans text-slate-400 max-w-2xl mx-auto">
          Every control alters the visual shaders, lighting density, and simulation physics in real-time. Watch the live viewport adapt below as you sculpt your reality.
        </p>
      </div>

      {/* Main Grid: Live Canvas Preview + Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left 7 cols: Live Reactive Viewport */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              <span>LIVE SHADER FEED // {world?.name || 'GENERIC MATRIX'}</span>
            </span>
            <span className="text-[11px] text-slate-500">
              PHYSICS SENSORS: ONLINE
            </span>
          </div>

          <div className="h-[380px] sm:h-[420px] w-full">
            <WorldCanvasVisual
              world={world}
              mood={mood}
              intensity={intensity}
              chaos={chaos}
              atmosphere={atmosphere}
            />
          </div>

          {/* Feedback Indicators */}
          <div className="grid grid-cols-3 gap-3 text-[11px] font-mono">
            <div className="cyber-panel p-2 rounded border border-slate-800 text-center">
              <span className="text-slate-400 block">Luminance</span>
              <span className="text-cyan-300 font-bold">
                {intensity > 70 ? 'High Glare' : intensity < 40 ? 'Dim / Shaded' : 'Balanced'}
              </span>
            </div>
            <div className="cyber-panel p-2 rounded border border-slate-800 text-center">
              <span className="text-slate-400 block">Entropy Vector</span>
              <span className="text-purple-300 font-bold">
                {chaos > 65 ? 'Quantum Glitch' : chaos < 35 ? 'Deterministic' : 'Fluctuating'}
              </span>
            </div>
            <div className="cyber-panel p-2 rounded border border-slate-800 text-center">
              <span className="text-slate-400 block">Light Envelope</span>
              <span className="text-amber-300 font-bold capitalize">{atmosphere}</span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Physics Sliders & Envelopes */}
        <div className="lg:col-span-5 space-y-5">
          {/* Sliders: Intensity & Chaos */}
          <div className="cyber-panel p-5 rounded-xl border border-cyan-500/20 space-y-4">
            <h3 className="font-cyber font-bold text-cyan-300 text-xs tracking-wider uppercase flex items-center justify-between">
              <span>Entropy & Intensity</span>
              <span className="text-[10px] font-mono text-cyan-400">REACTIVE</span>
            </h3>

            {/* Environmental Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Environmental Intensity</span>
                <span className="text-cyan-400 font-bold">{intensity}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                value={intensity}
                onChange={(e) => updateWorldDirector({ intensity: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Subtle Shading</span>
                <span>Radiant Overdrive</span>
              </div>
            </div>

            {/* Quantum Chaos */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Quantum Chaos</span>
                <span className="text-purple-400 font-bold">{chaos}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={chaos}
                onChange={(e) => updateWorldDirector({ chaos: Number(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Stable Matrix</span>
                <span>Singularity Glitch</span>
              </div>
            </div>
          </div>

          {/* Emotional Resonance / Mood */}
          <div className="cyber-panel p-5 rounded-xl border border-cyan-500/20 space-y-3">
            <h3 className="font-cyber font-bold text-cyan-300 text-xs tracking-wider uppercase">
              Emotional Resonance (Mood)
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {MOODS.map((m) => {
                const Icon = ICON_MAP[m.icon] || Sun;
                const isSelected = mood === m.id;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleMoodSelect(m.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-cyber font-semibold text-white">{m.label}</span>
                    </div>
                    <span className="text-[10px] font-sans text-slate-400 leading-tight">
                      {m.description.split(',')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Atmosphere / Time of Day */}
          <div className="cyber-panel p-5 rounded-xl border border-cyan-500/20 space-y-3">
            <h3 className="font-cyber font-bold text-cyan-300 text-xs tracking-wider uppercase">
              Atmospheric Envelope
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {ATMOSPHERES.map((atm) => {
                const isSelected = atmosphere === atm.id;

                return (
                  <button
                    key={atm.id}
                    type="button"
                    onClick={() => handleAtmosphereSelect(atm.id)}
                    className={`p-2 rounded border text-center transition-all duration-200 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-glow-cyan font-bold'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-mono leading-tight">
                      {atm.label.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA: Morph My World */}
      <div className="text-center pt-2">
        <button
          onClick={handleProceed}
          className="group relative inline-flex items-center space-x-3 px-10 py-4 rounded-xl font-cyber font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-600 text-slate-950 hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-glow-purple"
        >
          <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span>✦ MORPH MY WORLD</span>
          <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
