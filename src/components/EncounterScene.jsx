import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { Flame, ShieldAlert, HeartHandshake, EyeOff, Grab, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EncounterScene() {
  const { state, dispatch, setStage } = useGameState();
  const [selectedChoice, setSelectedChoice] = useState(state.encounterChoice || null);

  const worldTheme = state.world?.theme || 'digital';

  // Contextualized encounter based on world
  const getEncounterData = () => {
    if (worldTheme === 'magical') {
      return {
        title: 'Trapped Sylvan Beast',
        description: 'A wounded bioluminescent stag is entangled in metallic void thorns.',
        prompt: 'How do you intervene before the thorns claim its life essence?',
        options: [
          {
            id: 'help',
            label: 'Commune & Heal',
            emoji: '🤝',
            desc: 'Use resonant attunement to soothe the beast gently.',
            consequence: '🌿 Sanctum hidden threshold revealed!',
            icon: HeartHandshake,
            color: 'emerald'
          },
          {
            id: 'evade',
            label: 'Veil & Bypass',
            emoji: '👤',
            desc: 'Conceal presence and slip through root tunnels.',
            consequence: '🕶️ Zero detection; alternate route opened.',
            icon: EyeOff,
            color: 'cyan'
          },
          {
            id: 'take',
            label: 'Extract Primal Sap',
            emoji: '💎',
            desc: 'Harvest radiating essence crystals from thorns.',
            consequence: '⚡ Raw mana gained; entropy surges +15%.',
            icon: Grab,
            color: 'amber'
          }
        ]
      };
    } else if (worldTheme === 'cosmic') {
      return {
        title: 'Stranded Derelict Survivor',
        description: 'An android engineer is pinned beneath collapsed bulkheads in a depressurizing airlock.',
        prompt: 'Life-support battery displays 02:40 minutes remaining.',
        options: [
          {
            id: 'help',
            label: 'Override Hydraulic Locks',
            emoji: '🤝',
            desc: 'Divert suit power to lift the heavy bulkhead.',
            consequence: '🗝️ Vault decryption cipher acquired!',
            icon: HeartHandshake,
            color: 'emerald'
          },
          {
            id: 'evade',
            label: 'Seal Outer Hatch',
            emoji: '👤',
            desc: 'Seal decompression hazard and take conduits.',
            consequence: '🛡️ Structural hull stabilized; bypasses alarms.',
            icon: EyeOff,
            color: 'cyan'
          },
          {
            id: 'take',
            label: 'Salvage Memory Core',
            emoji: '💎',
            desc: 'Extract navigational drive before shutdown.',
            consequence: '💾 Nav drive salvaged; station alerts escalate.',
            icon: Grab,
            color: 'amber'
          }
        ]
      };
    }
    // Cyber default
    return {
      title: 'Cornered Cybernetic Rebel',
      description: 'A rogue data runner is pinned in the alleyway by hunter-drones charging lethal ion pulses.',
      prompt: 'Hunter-drones will fire in 3 seconds.',
      options: [
        {
          id: 'help',
          label: 'Deploy EMP Disruption',
          emoji: '🤝',
          desc: 'Disable hunter-drone arrays and shield runner.',
          consequence: '🔓 Core decryption key unlocked!',
          icon: HeartHandshake,
          color: 'emerald'
        },
        {
          id: 'evade',
          label: 'Slip into Shadows',
          emoji: '👤',
          desc: 'Use optical cloak to bypass skirmish unseen.',
          consequence: '🕶️ Zero trace left; access conduit found.',
          icon: EyeOff,
          color: 'cyan'
        },
        {
          id: 'take',
          label: 'Hack Dropped Tech',
          emoji: '💎',
          desc: 'Overclock deck to seize military munitions.',
          consequence: '⚡ Combat Cyberdeck acquired; grid lock alert!',
          icon: Grab,
          color: 'amber'
        }
      ]
    };
  };

  const encounter = getEncounterData();

  const handleChoice = (choiceId) => {
    AudioService.playClick();
    setSelectedChoice(choiceId);
    dispatch({ type: GAME_ACTIONS.SET_ENCOUNTER_CHOICE, payload: choiceId });
  };

  const handleProceed = () => {
    AudioService.playClick();
    setStage(GAME_STAGES.ARTIFACT);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
          <Flame className="w-3.5 h-3.5" />
          <span>CRITICAL ENCOUNTER EVENT</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
          {encounter.title.toUpperCase()}
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          {encounter.description}
        </p>
      </div>

      <div className="cyber-panel p-4 rounded-xl border border-slate-800 text-center font-mono text-xs text-amber-300">
        TACTICAL QUERY: {encounter.prompt}
      </div>

      {/* 3 Meaningful Choices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {encounter.options.map((opt) => {
          const isSelected = selectedChoice === opt.id;
          const Icon = opt.icon;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ y: -4 }}
              onClick={() => handleChoice(opt.id)}
              className={`cyber-panel p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/50 shadow-glow-cyan'
                  : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{opt.emoji}</span>
                    <div className="p-1.5 rounded bg-slate-900 text-cyan-400 border border-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-400/40">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>SELECTED</span>
                    </span>
                  )}
                </div>
                <h4 className="text-base font-cyber font-bold text-white mb-2">{opt.label}</h4>
                <p className="text-xs text-slate-300 mb-4">{opt.desc}</p>
              </div>

              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-300">
                <span className="text-slate-400 block mb-0.5 font-bold">Consequence:</span>
                {opt.consequence}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={handleProceed}
          disabled={!selectedChoice}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-lg font-cyber font-bold text-xs tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
        >
          <span>Breach Relic Sanctum</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
