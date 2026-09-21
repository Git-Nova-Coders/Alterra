import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../context/GameStateContext';
import { WORLD_OBJECTS } from '../data/objectsAndEncounters';
import { GAME_STAGES } from '../data/gameState';
import WorldCanvasVisual from './WorldCanvasVisual';
import {
  Terminal,
  Box,
  Key,
  Cpu,
  Sparkles,
  Zap,
  Eye,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react';

const ICON_MAP = {
  Terminal,
  Box,
  Key,
  Cpu,
  Sparkles,
  Zap,
  Eye,
  Activity
};

export default function GameScene() {
  const { state, dispatch, setStage } = useGameState();
  const { world, role, trait, inventory, discoveredObjects, mood, intensity, chaos, atmosphere } = state;

  const worldId = world?.id || 'cyber';
  const sceneObjects = WORLD_OBJECTS[worldId] || WORLD_OBJECTS.cyber;

  const [activeObject, setActiveObject] = useState(null);
  const [notification, setNotification] = useState(null);

  // Trigger temporary notification
  const triggerNotify = (text, type = 'info') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Check if player has item in inventory
  const hasItem = (itemId) => {
    return inventory.some((it) => it.id === itemId || it === itemId);
  };

  // Handle interacting with an object
  const handleInteract = (obj) => {
    setActiveObject(obj);

    const isAlreadyDiscovered = discoveredObjects.includes(obj.id);

    // If already discovered, just view its state
    if (isAlreadyDiscovered) {
      triggerNotify(`${obj.name}: Already decrypted and secured.`, 'info');
      return;
    }

    // Check requirement: required item
    if (obj.requiresItem && !hasItem(obj.requiresItem)) {
      triggerNotify(`[ACCESS DENIED] ${obj.name} is locked. Requires ${obj.requiresItem.replace('_', ' ').toUpperCase()}.`, 'error');
      return;
    }

    // Role bonuses / permissions
    let bonusMessage = '';
    if (obj.bonusRole && role?.id === obj.bonusRole) {
      bonusMessage = ` (${role.name} capability granted expedited bypass!)`;
    }

    // Record discovery in state
    dispatch({ type: 'RECORD_DISCOVERED_OBJECT', payload: obj.id });

    // Grant reward item to inventory if available
    if (obj.rewardItem) {
      dispatch({ type: 'ADD_INVENTORY_ITEM', payload: obj.rewardItem });
      // If the object is the core world artifact, update state.artifact
      if (obj.type === 'artifact') {
        dispatch({ type: 'SET_ARTIFACT', payload: obj.rewardItem.name });
      }
      triggerNotify(`[ACQUIRED] ${obj.rewardItem.name} added to inventory!${bonusMessage}`, 'success');
    } else {
      triggerNotify(`Interacted with ${obj.name}${bonusMessage}`, 'success');
    }
  };

  // Check if all primary objects are inspected to proceed to encounter
  const discoveredCount = discoveredObjects.length;
  const canProceedToEncounter = discoveredCount >= 2; // At least terminal + chest or artifact

  const handleProceedToEncounter = () => {
    setStage(GAME_STAGES.ENCOUNTER);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Dynamic Scene Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-500/20">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>M12 & M13 — LIVE INTERACTIVE GAME SCENE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white tracking-wide">
            {world?.sceneTitle || 'SECTOR EXPLORATION'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl">
            {world?.sceneDescription}
          </p>
        </div>

        {/* Loadout HUD badge */}
        <div className="flex items-center space-x-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 text-xs font-mono">
          <div className="space-y-0.5">
            <div className="text-slate-400 text-[10px] uppercase">Operative & Trait</div>
            <div className="text-cyan-300 font-bold">{role?.name || 'Explorer'}</div>
            <div className="text-amber-400 text-[11px] font-semibold">{trait?.name || 'Curious'} Instinct</div>
          </div>
        </div>
      </div>

      {/* Real-time Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg font-mono text-xs mb-4 flex items-center space-x-2 border shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-red-950/90 border-red-500/60 text-red-200'
                : 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{notification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Gameplay Layout: Viewport + Interactive Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left 8 Cols: World Canvas with Clickable Dynamic Nodes */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative h-[380px] sm:h-[440px] w-full rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl">
            {/* The Visual SVG Canvas sculpted by user */}
            <WorldCanvasVisual
              world={world}
              mood={mood}
              intensity={intensity}
              chaos={chaos}
              atmosphere={atmosphere}
            />

            {/* Interactive World Hotspot Markers over Canvas */}
            <div className="absolute inset-0 z-20 pointer-events-none p-6">
              {sceneObjects.map((obj, idx) => {
                const isDiscovered = discoveredObjects.includes(obj.id);
                const isLocked = obj.requiresItem && !hasItem(obj.requiresItem) && !isDiscovered;
                const isHidden = obj.type === 'hidden' && role?.id !== 'explorer' && trait?.id !== 'curious' && !isDiscovered;

                // Coordinates for 4 objects spaced across the canvas
                const positions = [
                  { top: '35%', left: '18%' },
                  { top: '65%', left: '30%' },
                  { top: '25%', left: '72%' },
                  { top: '55%', left: '80%' }
                ];
                const pos = positions[idx % positions.length];

                return (
                  <div
                    key={obj.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2"
                  >
                    <button
                      type="button"
                      onClick={() => handleInteract(obj)}
                      className={`group relative flex items-center justify-center rounded-full p-2.5 transition-all duration-300 shadow-lg ${
                        isDiscovered
                          ? 'bg-emerald-600/90 border-2 border-emerald-400 text-white'
                          : isLocked
                          ? 'bg-slate-900/90 border-2 border-red-500/70 text-red-400 hover:scale-110'
                          : isHidden
                          ? 'bg-purple-900/60 border border-dashed border-purple-400 text-purple-300 hover:scale-110 opacity-70'
                          : 'bg-cyan-950/90 border-2 border-cyan-400 text-cyan-300 hover:scale-125 shadow-glow-cyan'
                      }`}
                      title={obj.name}
                    >
                      {isDiscovered ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      )}

                      {/* Tooltip Tag */}
                      <span className="absolute -bottom-8 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono border border-slate-700 text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {obj.name} {isDiscovered && '(Solved)'} {isLocked && '(Locked)'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Trait Perception Clue Box (Curious / Explorer passive) */}
            {(trait?.id === 'curious' || role?.id === 'explorer') && (
              <div className="absolute bottom-4 left-4 z-30 flex items-center space-x-2 bg-purple-950/90 px-3 py-1.5 rounded-lg border border-purple-400/60 font-mono text-[11px] text-purple-200">
                <Eye className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span>
                  {trait?.id === 'curious'
                    ? 'Curious Instinct: Hidden energy signatures highlighted on radar.'
                    : 'Explorer Archetype: Concealed cache positions actively pinging.'}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Object Cards below viewport */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sceneObjects.map((obj) => {
              const Icon = ICON_MAP[obj.icon] || Box;
              const isDiscovered = discoveredObjects.includes(obj.id);
              const isLocked = obj.requiresItem && !hasItem(obj.requiresItem) && !isDiscovered;

              return (
                <div
                  key={obj.id}
                  onClick={() => handleInteract(obj)}
                  className={`cyber-panel p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isDiscovered
                      ? 'border-emerald-500/50 bg-emerald-950/20'
                      : isLocked
                      ? 'border-red-500/30 bg-red-950/10 hover:border-red-500/60'
                      : 'border-cyan-500/30 hover:border-cyan-400 bg-slate-950/70 hover:shadow-glow-cyan'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-cyber font-bold text-xs text-white">
                          {obj.name}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {obj.type}
                        </span>
                      </div>
                    </div>

                    {isDiscovered ? (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : isLocked ? (
                      <span className="text-[10px] font-mono text-red-400 flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-cyan-400">
                        CLICK TO SCAN
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-sans text-slate-300 leading-tight mb-2">
                    {isDiscovered ? obj.unlockedDescription : obj.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-800">
                    <span className="text-slate-400">
                      {isLocked ? `Needs: ${obj.requiresItem.replace('_', ' ')}` : obj.actionText}
                    </span>
                    {obj.rewardItem && (
                      <span className="text-amber-400">
                        Yield: {obj.rewardItem.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Active Inventory & Mission Progress */}
        <div className="lg:col-span-4 space-y-4">
          {/* M14: Active Tactical Inventory */}
          <div className="cyber-panel p-5 rounded-xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-cyber font-bold text-cyan-300 text-xs tracking-wider uppercase flex items-center space-x-2">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>M14 — OPERATIVE INVENTORY</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {inventory.length} Item(s)
              </span>
            </div>

            {inventory.length === 0 ? (
              <div className="text-center py-6 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-lg">
                No items collected yet.
                <br />
                <span className="text-[10px] text-slate-600">Scan consoles or crates to discover keys.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {inventory.map((item, idx) => {
                  const ItemIcon = ICON_MAP[item.icon] || Key;
                  return (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-slate-900/90 border border-cyan-500/20 flex items-start space-x-3"
                    >
                      <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex-shrink-0">
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-cyber font-bold text-white truncate">
                          {item.name}
                        </div>
                        <p className="text-[10px] font-sans text-slate-300 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Environmental Mission Status */}
          <div className="cyber-panel p-5 rounded-xl border border-cyan-500/20 space-y-4">
            <h3 className="font-cyber font-bold text-cyan-300 text-xs tracking-wider uppercase">
              SECTOR STABILIZATION
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Anomalies Decrypted</span>
                <span className="text-cyan-300 font-bold">{discoveredCount} / {sceneObjects.length}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-400 h-full transition-all duration-300 shadow-glow-cyan"
                  style={{ width: `${(discoveredCount / sceneObjects.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-slate-400">Target Relic:</div>
              <div className="text-amber-300 font-bold">{world?.artifact || 'Core Relic'}</div>
              <div className="text-slate-400 text-[10px]">
                Status: {hasItem(sceneObjects.find(o => o.type === 'artifact')?.rewardItem?.id) ? 'Secured in Inventory' : 'Awaiting containment bypass'}
              </div>
            </div>

            {/* CTA to Encounter (M15) */}
            <div className="pt-2">
              <button
                onClick={handleProceedToEncounter}
                disabled={!canProceedToEncounter}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
              >
                <span>Trigger Critical Encounter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!canProceedToEncounter && (
                <p className="text-[10px] font-mono text-center text-slate-500 mt-1.5">
                  Decrypt at least 2 objects to advance story
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
