import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AIService } from '../services/aiService';
import { AudioService } from '../services/audioService';
import { Terminal, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AIEndingScene() {
  const { state, dispatch, setStage } = useGameState();
  const [loading, setLoading] = useState(true);
  const [endingData, setEndingData] = useState(null);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function synthesize() {
      setLoading(true);
      dispatch({ type: GAME_ACTIONS.SET_GENERATING_AI, payload: true });

      try {
        const result = await AIService.generateEnding(state);
        if (isMounted) {
          setEndingData(result);
          dispatch({ type: GAME_ACTIONS.SET_AI_ENDING, payload: result });
          setLoading(false);
          AudioService.playSuccess();
        }
      } catch (err) {
        console.warn('[AIEndingScene] Exception in ending generation:', err);
        const fallback = AIService.synthesizeLocalEnding(state);
        if (isMounted) {
          setEndingData(fallback);
          dispatch({ type: GAME_ACTIONS.SET_AI_ENDING, payload: fallback });
          setLoading(false);
        }
      }
    }

    synthesize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Typewriter effect for epilogue
  useEffect(() => {
    if (!endingData?.epilogue) return;

    let index = 0;
    const text = endingData.epilogue;
    setDisplayedText('');

    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.substring(0, index));
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [endingData]);

  const handleProceed = () => {
    AudioService.playClick();
    setStage(GAME_STAGES.RESULT);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
      <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
        <Terminal className="w-3.5 h-3.5" />
        <span>NEURAL CHRONICLE COMPILATION // AI SERVICE</span>
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cyber-panel p-10 rounded-2xl border border-cyan-500/30 space-y-6"
        >
          <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <h2 className="text-2xl font-cyber font-bold text-white">
            COMPILING REALITY CHRONICLE...
          </h2>
          <p className="text-xs font-mono text-cyan-300 animate-pulse">
            Digesting {state.world?.name || 'World'} parameters, [{state.artifactDecision?.toUpperCase()}] consequence vectors, and gateway choice...
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="cyber-panel p-8 sm:p-12 rounded-3xl border-2 border-cyan-400/50 shadow-glow-cyan text-left space-y-6 relative overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">
                Synthesized Reality Epoch
              </span>
              <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white uppercase">
                {endingData?.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">Hash</span>
              <span className="text-xs font-mono text-cyan-300 font-bold">{endingData?.chronicleHash}</span>
            </div>
          </div>

          {/* Epilogue Text with Typewriter effect */}
          <div className="bg-black/60 p-6 rounded-xl border border-slate-800 min-h-[120px] flex items-center">
            <p className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed">
              "{displayedText}"
              <span className="animate-pulse text-cyan-400 font-bold ml-1">▌</span>
            </p>
          </div>

          {/* Verdict and Model Telemetry */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
            <div>
              <span className="text-slate-500">Verdict: </span>
              <span className="text-cyan-300 font-bold">{endingData?.verdict}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{endingData?.generatedVia}</span>
            </div>
          </div>

          {/* Button to Cinematic Journey Recap & World DNA */}
          <div className="pt-4 text-center">
            <button
              onClick={handleProceed}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-cyber font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-glow-cyan"
            >
              <span>Begin Cinematic Reality Recap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
