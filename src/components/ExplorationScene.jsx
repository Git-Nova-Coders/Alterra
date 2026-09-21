import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { Compass, Terminal, Shield, Sparkles, Key, Radio, AlertCircle, ArrowRight, Eye } from 'lucide-react';

export default function ExplorationScene() {
  const { state, dispatch, setStage } = useGameState();
  const [activeLog, setActiveLog] = useState(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const worldTheme = state.world?.theme || 'digital';
  const worldName = state.world?.name || 'Simulation';

  // Interactive world objects tailored by world theme
  const getObjectsForWorld = () => {
    if (worldTheme === 'magical') {
      return [
        {
          id: 'ancient_runestone',
          title: 'Petrified Runestone',
          emoji: '🗿',
          desc: 'Mossy carvings pulsating with dormant bio-arcana.',
          clue: 'Glyphs deciphered: "The forest breathes only when unchained."',
          icon: Sparkles,
          color: 'text-emerald-400',
          item: { id: 'sylvan_dew', name: 'Sylvan Dew Flask', emoji: '🧪' }
        },
        {
          id: 'root_terminal',
          title: 'Arboreal Spore Node',
          emoji: '🍄',
          desc: 'A cluster of luminescent fungi vibrating in low frequencies.',
          clue: 'Vibrations align with the Sanctum of the Sylvan Root.',
          icon: Terminal,
          color: 'text-teal-400',
          item: { id: 'spore_crystal', name: 'Resonating Spore', emoji: '🔮' }
        },
        {
          id: 'sealed_canopy_door',
          title: 'Elder Vine Barrier',
          emoji: '🌿',
          desc: 'Dense briars blocking entry to the deepest grove.',
          clue: 'Requires pure elemental harmonic attunement to part.',
          icon: Shield,
          color: 'text-amber-400',
          item: null
        }
      ];
    } else if (worldTheme === 'cosmic') {
      return [
        {
          id: 'flight_recorder',
          title: 'Derelict Log Terminal',
          emoji: '📟',
          desc: 'Flickering CRT readout from the abandoned flight bridge.',
          clue: 'Audio log 88-Delta: "The Signal Key altered our navigation trajectory."',
          icon: Terminal,
          color: 'text-purple-400',
          item: { id: 'data_chip', name: 'Flight Deck Data Chip', emoji: '💾' }
        },
        {
          id: 'cryo_pod',
          title: 'Decompressed Cryo-Chamber',
          emoji: '🧊',
          desc: 'A pressurized vault with frosted hull plating.',
          clue: 'Gravimetric readings fluctuate around the emergency hatch.',
          icon: Shield,
          color: 'text-blue-400',
          item: { id: 'plasma_torch', name: 'Compact Plasma Torch', emoji: '🔦' }
        },
        {
          id: 'airlock_relay',
          title: 'Sector 4 Blast Gateway',
          emoji: '🚪',
          desc: 'Heavy tungsten security door sealed during vacuum breach.',
          clue: 'Security overrides await manual relic harmonization.',
          icon: Key,
          color: 'text-cyan-400',
          item: null
        }
      ];
    }
    // Cyber default
    return [
      {
        id: 'data_terminal',
        title: 'Overclocked Holo-Terminal',
        emoji: '💻',
        desc: 'Streaming encrypted data streams from Kowloon central hub.',
        clue: 'Decryption: "The Quantum Core draws power directly from the grid."',
        icon: Terminal,
        color: 'text-cyan-400',
        item: { id: 'data_chip', name: 'Encrypted Data Chip', emoji: '💾' }
      },
      {
        id: 'security_cache',
        title: 'Corpo Security Stash',
        emoji: '🧰',
        desc: 'A reinforced lockbox abandoned by cybernetic enforcers.',
        clue: 'Contains security credentials for sub-level zero.',
        icon: Key,
        color: 'text-amber-400',
        item: { id: 'passcode_drive', name: 'Bypass Keycard', emoji: '💳' }
      },
      {
        id: 'subgrid_door',
        title: 'Sub-Level Firewall Gate',
        emoji: '🚪',
        desc: 'A massive biometric gate sealing the quantum reactor core.',
        clue: 'Requires core authorization or brute computational force.',
        icon: Shield,
        color: 'text-purple-400',
        item: null
      }
    ];
  };

  const interactiveObjects = getObjectsForWorld();

  const handleInspect = (obj) => {
    AudioService.playDiscovery();
    dispatch({ type: GAME_ACTIONS.RECORD_DISCOVERED_OBJECT, payload: obj.id });
    if (obj.item) {
      dispatch({ type: GAME_ACTIONS.ADD_INVENTORY_ITEM, payload: obj.item });
    }
    setActiveLog({
      title: obj.title,
      text: obj.clue,
      item: obj.item ? `Acquired: ${obj.item.name}` : null
    });
  };

  // M27: Hidden Easter Egg
  const handleEasterEggClick = () => {
    AudioService.playSecret();
    dispatch({ type: GAME_ACTIONS.RECORD_DISCOVERED_OBJECT, payload: 'unknown_signal' });
    setShowEasterEgg(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>EXPLORATION // SECTOR-1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white tracking-wide">
            {worldName.toUpperCase()}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Current Atmosphere: <span className="text-cyan-300 capitalize">{state.atmosphere}</span> // Chaos Index: <span className="text-purple-300">{state.chaos}%</span>
          </p>
        </div>

        {/* Inventory pill */}
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-700">
          <Key className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono text-slate-300">
            Inventory: <span className="text-amber-300 font-bold">{state.inventory.length} item(s)</span>
          </span>
        </div>
      </div>

      {/* Main Playable Board / Interactive Canvas */}
      <div className="relative cyber-panel p-6 rounded-2xl border border-cyan-500/30 overflow-hidden min-h-[380px] flex flex-col justify-between">
        {/* Environmental backdrop representation */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-1000"
          style={{ background: state.world?.previewVisual }}
        />

        {/* Dynamic Interactive Object Nodes */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {interactiveObjects.map((obj) => {
            const isDiscovered = state.discoveredObjects.includes(obj.id);
            const Icon = obj.icon;

            return (
              <motion.div
                key={obj.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleInspect(obj)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isDiscovered
                    ? 'border-cyan-400/70 bg-cyan-950/40 shadow-glow-cyan'
                    : 'border-slate-700/80 bg-slate-900/80 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{obj.emoji}</span>
                  <Icon className={`w-4 h-4 ${obj.color}`} />
                  <span className="font-cyber font-bold text-sm text-white">{obj.title}</span>
                </div>
                <p className="text-xs text-slate-300 mb-3">{obj.desc}</p>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={isDiscovered ? 'text-cyan-300' : 'text-slate-500'}>
                    {isDiscovered ? '✓ Scanned & Logged' : 'Click to Inspect'}
                  </span>
                  {obj.item && (
                    <span className="text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      Item
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* M27: Optional Hidden Easter Egg Object */}
        <div className="relative z-10 py-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleEasterEggClick}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-dashed border-slate-700/70 bg-black/40 hover:border-purple-400 text-[11px] font-mono text-slate-400 hover:text-purple-300 transition-all"
            title="A subtle distortion flickers in the peripheral sensor array..."
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            <span>[ ? ] Faint Subspace Distortion</span>
          </motion.button>
        </div>

        {/* Active Inspection Log Console */}
        <div className="relative z-10 bg-black/70 p-3 rounded-lg border border-slate-800 text-xs font-mono">
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-bold">SENSOR DOSSIER:</span>
          </div>
          {activeLog ? (
            <p className="text-slate-200">
              <span className="text-cyan-300 font-bold">{activeLog.title}:</span> {activeLog.text}{' '}
              {activeLog.item && <span className="text-amber-300 block mt-1 font-bold">[{activeLog.item}]</span>}
            </p>
          ) : (
            <p className="text-slate-500 italic">
              Inspect anomalous environmental signatures above to uncover navigational vectors and items.
            </p>
          )}
        </div>
      </div>

      {/* M27: Hidden WOW Element Modal */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="cyber-panel p-5 rounded-xl border-2 border-purple-500 bg-purple-950/80 shadow-glow-purple text-center space-y-3"
          >
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-purple-300 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-400/50">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>SECRET DISCOVERED // EASTER EGG</span>
            </div>
            <p className="text-lg sm:text-xl font-cyber font-bold text-white tracking-wide">
              "This reality remembers choices you haven't made yet."
            </p>
            <p className="text-xs font-mono text-purple-300">
              An anomalous temporal resonance has been permanently etched into your World DNA signature.
            </p>
            <button
              onClick={() => setShowEasterEgg(false)}
              className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs"
            >
              Acknowledge Anomaly
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advance to Encounter */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs font-mono text-slate-500">
          Exploration objects discovered: {state.discoveredObjects.length} / 4
        </span>
        <button
          onClick={() => {
            AudioService.playClick();
            setStage(GAME_STAGES.ENCOUNTER);
          }}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
        >
          <span>Breach Sanctum Perimeter</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
