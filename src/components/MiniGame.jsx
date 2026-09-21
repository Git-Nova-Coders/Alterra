import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import { Cpu, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw, Timer } from 'lucide-react';

const SYMBOLS = [
  { id: 'tri', label: '▲', name: 'Delta' },
  { id: 'cir', label: '●', name: 'Orb' },
  { id: 'dia', label: '◆', name: 'Prism' },
  { id: 'str', label: '★', name: 'Nova' },
  { id: 'hex', label: '⬡', name: 'Hex' }
];

export default function MiniGame() {
  const { state, dispatch, setStage } = useGameState();
  const [phase, setPhase] = useState('MEMORIZE'); // 'MEMORIZE' | 'INPUT' | 'RESULT'
  const [targetSequence, setTargetSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [outcome, setOutcome] = useState(null); // 'success' | 'failure'

  const hasReflexTrait = state.trait?.id === 'daring'; // Overclocked Reflexes bonus

  // Generate sequence on mount
  useEffect(() => {
    // 4 symbol sequence as recommended in PRD (▲ ● ◆ ★)
    const seq = [];
    for (let i = 0; i < 4; i++) {
      const rand = Math.floor(Math.random() * SYMBOLS.length);
      seq.push(SYMBOLS[rand]);
    }
    setTargetSequence(seq);

    // Show sequence for 3.5 seconds, then hide and start timer
    const memorizeTimer = setTimeout(() => {
      setPhase('INPUT');
    }, 3200);

    return () => clearTimeout(memorizeTimer);
  }, []);

  // Countdown timer during INPUT phase
  useEffect(() => {
    if (phase !== 'INPUT') return;

    if (timeLeft <= 0) {
      handleValidate([]);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const handleSymbolClick = (sym) => {
    AudioService.playClick();
    if (phase !== 'INPUT') return;

    const nextInput = [...playerInput, sym];
    setPlayerInput(nextInput);

    // When player clicks 4 symbols, validate immediately
    if (nextInput.length === targetSequence.length) {
      handleValidate(nextInput);
    }
  };

  const handleValidate = (finalInput) => {
    let matches = 0;
    for (let i = 0; i < targetSequence.length; i++) {
      if (finalInput[i]?.id === targetSequence[i]?.id) {
        matches++;
      }
    }

    const isSuccess = matches === targetSequence.length;
    const baseScore = matches * 25;
    const finalScore = hasReflexTrait ? baseScore + 20 : baseScore;

    if (isSuccess) {
      AudioService.playSuccess();
      setOutcome('success');
      dispatch({
        type: GAME_ACTIONS.SET_CHALLENGE_SCORE,
        payload: { score: finalScore, result: 'success' }
      });
    } else {
      AudioService.playFailure();
      setOutcome('failure');
      dispatch({
        type: GAME_ACTIONS.SET_CHALLENGE_SCORE,
        payload: { score: finalScore, result: 'failure' }
      });
    }

    setPhase('RESULT');
  };

  const handleProceed = () => {
    AudioService.playClick();
    setStage(GAME_STAGES.FINAL_DECISION);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>MINI-CHALLENGE // HARMONIC PATTERN LOCK</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-cyber font-bold text-white tracking-wide">
          NEURAL FREQUENCY OVERCLOCK
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Synchronize with the gateway frequencies to stabilize the dimensional conduit before convergence.
        </p>
      </div>

      {hasReflexTrait && (
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-purple-950/60 border border-purple-500/40 text-xs font-mono text-purple-300">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>TRAIT ACTIVE: Overclocked Reflexes (+20 Score Bonus)</span>
        </div>
      )}

      {/* Main Challenge Box */}
      <div className="cyber-panel p-6 sm:p-8 rounded-2xl border-2 border-cyan-500/30 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
        {/* Phase 1: MEMORIZE */}
        {phase === 'MEMORIZE' && (
          <div className="space-y-6 py-6">
            <div className="text-xs font-mono text-amber-400 tracking-widest uppercase animate-pulse">
              MEMORIZE THE SYMBOL SEQUENCE:
            </div>
            <div className="flex justify-center items-center space-x-4">
              {targetSequence.map((sym, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.15 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-cyan-400 bg-cyan-950/70 shadow-glow-cyan flex items-center justify-center text-2xl sm:text-3xl text-cyan-200 font-bold"
                >
                  {sym.label}
                </motion.div>
              ))}
            </div>
            <p className="text-xs font-mono text-slate-400">
              Pattern will conceal in moments...
            </p>
          </div>
        )}

        {/* Phase 2: INPUT */}
        {phase === 'INPUT' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-cyan-400 border-b border-slate-800 pb-2">
              <span className="font-bold uppercase tracking-wider">REPEAT THE SEQUENCE:</span>
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Input Slots */}
            <div className="flex justify-center items-center space-x-3 min-h-[64px]">
              {Array.from({ length: 4 }).map((_, idx) => {
                const sym = playerInput[idx];
                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-bold transition-all ${
                      sym
                        ? 'border-cyan-400 bg-cyan-950 text-cyan-200 shadow-glow-cyan'
                        : 'border-slate-700 bg-slate-900/60 text-slate-600'
                    }`}
                  >
                    {sym ? sym.label : '?'}
                  </div>
                );
              })}
            </div>

            {/* Interactive Symbol Keypad */}
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto pt-2">
              {SYMBOLS.map((sym) => (
                <motion.button
                  key={sym.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSymbolClick(sym)}
                  className="py-3 sm:py-4 rounded-xl border border-slate-700 hover:border-cyan-400 bg-slate-900/80 hover:bg-cyan-950/40 text-xl sm:text-2xl font-bold text-white transition-all shadow-sm"
                >
                  {sym.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Phase 3: RESULT */}
        {phase === 'RESULT' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4 py-4"
          >
            {outcome === 'success' ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-cyber font-bold text-emerald-400 uppercase">
                  FREQUENCY HARMONIZED!
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  Target sequence successfully repeated. Gateway resonance stabilized at 100%.
                </p>
                <div className="p-2 rounded bg-emerald-950/50 border border-emerald-500/30 text-xs font-mono text-emerald-300 inline-block">
                  Consequence: Positive narrative modifier applied to final outcome.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                  <XCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-cyber font-bold text-rose-400 uppercase">
                  NEURAL DESYNCHRONIZATION
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  Conduit misaligned. Reality turbulence escalated under harmonic stress.
                </p>
                <div className="p-2 rounded bg-rose-950/50 border border-rose-500/30 text-xs font-mono text-rose-300 inline-block">
                  Consequence: Volatility modifier injected into final reality synthesis.
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {phase === 'RESULT' && (
        <div className="pt-2">
          <button
            onClick={handleProceed}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-glow-cyan"
          >
            <span>Approach The Final Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
