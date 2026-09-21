import React from 'react';
import { useGameState } from '../context/GameStateContext';
import { Compass, Shield, Zap, RefreshCw, Cpu, Activity, Box } from 'lucide-react';

export default function HUD() {
  const { state, resetGame } = useGameState();
  const { world, mood, intensity, chaos, role, currentStage, inventory, trait } = state;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2.5 border-b border-cyan-500/20 bg-[#070b14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded border border-cyan-400/40 bg-cyan-950/40">
            <span className="font-cyber font-black text-cyan-400 text-sm tracking-wider">A</span>
            <div className="absolute -inset-0.5 rounded bg-cyan-400/20 blur-[2px] -z-10 animate-pulse-glow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-cyber tracking-[0.25em] text-sm md:text-base font-extrabold text-cyan-300">
                ALTERRA
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-bold">
                ENGINE ACTIVE
              </span>
            </div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 hidden sm:block">
              Stage: <span className="text-cyan-400 font-bold">{currentStage.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Telemetry / Status Pill */}
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono">
          {world ? (
            <div className="flex items-center space-x-2 px-3 py-1 rounded bg-slate-900/90 border border-slate-700/60">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">World:</span>
              <span className="text-cyan-300 font-bold">{world.name}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1 rounded bg-slate-900/60 border border-dashed border-slate-800 text-slate-500">
              <span>Awaiting Genesis</span>
            </div>
          )}

          {world && (
            <div className="flex items-center space-x-3 px-3 py-1 rounded bg-slate-900/90 border border-slate-700/60">
              <div className="flex items-center space-x-1.5">
                <Activity className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 capitalize">{state.atmosphere}</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-700" />
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-purple-400" />
                <span className="text-purple-300">Entropy {chaos}%</span>
              </div>
            </div>
          )}

          {role && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded bg-slate-900/90 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">{role.name}</span>
              {trait && <span className="text-[10px] text-amber-300">({trait.name})</span>}
            </div>
          )}

          {inventory.length > 0 && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
              <Box className="w-3 h-3 text-cyan-400" />
              <span>{inventory.length} item(s)</span>
            </div>
          )}
        </div>

        {/* Global Reboot Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={resetGame}
            title="Reset Simulation"
            className="flex items-center space-x-1.5 px-3 py-1 rounded border border-slate-700/80 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-xs font-mono text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset World</span>
          </button>
        </div>
      </div>
    </header>
  );
}
