import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioService } from '../services/audioService';
import { Terminal, Volume2, Sparkles, ChevronRight, MessageSquare, Compass, Eye, User, Cpu } from 'lucide-react';

/**
 * DialogueBox
 * 
 * RPG-style dialogue & inner speech component:
 * - Typewriter text effect with animated character-by-character reveal.
 * - Subtle audio sound blips per typed character.
 * - Speaker avatar, title, and role badge.
 * - [SPACE] / Click to fast-forward text or advance to next dialogue line.
 * - Contextual hint / quest objective guidance.
 */
export default function DialogueBox({
  dialogues = [],
  onComplete,
  className = '',
  autoAdvance = false
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentDialogue = dialogues[currentIndex] || null;
  const timerRef = useRef(null);

  // Typewriter animation effect
  useEffect(() => {
    if (!currentDialogue) return;

    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;
    const fullText = currentDialogue.text;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        
        // Audio chirp every 2 characters for pleasing retro feel
        if (charIndex % 3 === 0) {
          AudioService.playTone(580 + (charIndex % 5) * 40, 'sine', 0.04, 0.05);
        }
        
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(timerRef.current);

        if (autoAdvance) {
          setTimeout(() => {
            handleAdvance();
          }, 2500);
        }
      }
    }, 28);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, currentDialogue]);

  const handleAdvance = () => {
    if (!currentDialogue) return;

    if (isTyping) {
      // Fast forward to full text
      clearInterval(timerRef.current);
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      return;
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      AudioService.playTone(720, 'sine', 0.15, 0.12);
    } else {
      if (onComplete) onComplete();
    }
  };

  // Keyboard shortcut [Space] or [Enter]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, currentIndex, currentDialogue]);

  if (!currentDialogue) return null;

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl font-mono select-none ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={handleAdvance}
        className="cyber-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] bg-slate-950/90 backdrop-blur-xl cursor-pointer hover:border-cyan-400 transition-all flex flex-col gap-3 group"
      >
        {/* Header: Speaker identity & Hint badge */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
          <div className="flex items-center gap-2.5">
            {/* Speaker Avatar Icon */}
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {currentDialogue.avatar === 'ai' ? (
                <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
              ) : (
                <User className="w-4 h-4 text-cyan-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-widest uppercase">
                  {currentDialogue.speaker}
                </span>
                <span className="text-[10px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {currentDialogue.title || 'Speech Matrix'}
                </span>
              </div>
            </div>
          </div>

          {/* Page index / Advance prompt */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>
              [{currentIndex + 1}/{dialogues.length}]
            </span>
            <span className="hidden sm:inline bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-cyan-300">
              {isTyping ? 'Click to Skip' : 'Press [SPACE] to Next'}
            </span>
          </div>
        </div>

        {/* Dialogue Body: Typewritten text */}
        <div className="min-h-[44px] sm:min-h-[48px] flex items-center">
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed tracking-wide font-sans">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-3.5 bg-cyan-400 ml-1 animate-pulse align-middle" />
            )}
          </p>
        </div>

        {/* Footer Hint / Objective Guidance */}
        {currentDialogue.hint && (
          <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-500/30 rounded-lg px-3 py-1.5 mt-0.5">
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{currentDialogue.hint}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
