import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoxelCharacter from './VoxelCharacter';
import VirtualJoystick from './VirtualJoystick';
import { AudioService } from '../services/audioService';
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle,
  Zap,
  Globe,
  PlusCircle,
  HelpCircle,
  Trees,
  Layers,
  Flame,
  Radio
} from 'lucide-react';

/**
 * Void Manifestation Scene (Phase 3)
 * The player lands in an empty, desolate void grid with zero landmarks.
 * Mysterious floating anomalies pulse in the distance.
 * As the player walks to each anomaly and interacts or bypasses it:
 * - Real-time world tiles (cyber neon blocks, emerald fantasy foliage, or cosmic monoliths) erupt from the ground.
 * - Manifestation gauge rises from 0% -> 100%.
 * - When 100% is reached, a glowing Genesis Vortex portal erupts.
 * - Player runs and leaps through the portal into the living world they created.
 */
export default function VoidManifestationScene({ world, onWorldManifested }) {
  const worldId = world?.id || 'cyber';
  const accentColor = world?.accentColor || '#00f0ff';

  // Player position in the boundless void grid
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 40 });
  const [direction, setDirection] = useState('down');
  const [isWalking, setIsWalking] = useState(false);

  // Manifested terrain blocks created by the player's movement & interactions
  const [manifestedBlocks, setManifestedBlocks] = useState([]);
  const [manifestScore, setManifestScore] = useState(0); // 0 to 100
  const [activeAnomaly, setActiveAnomaly] = useState(null);
  const [leaping, setLeaping] = useState(false);

  const keysPressed = useRef({});
  const lastStep = useRef(0);

  // Anomaly nodes in the empty void
  const [anomalies, setAnomalies] = useState([
    {
      id: 'anom-1',
      x: -160,
      y: -90,
      title: 'Dormant Memory Core',
      type: 'terrain',
      icon: '💎',
      desc: 'Injects topological structures into the void grid.',
      collected: false
    },
    {
      id: 'anom-2',
      x: 180,
      y: -80,
      title: 'Atmospheric Spark',
      type: 'atmosphere',
      icon: '⚡',
      desc: 'Synthesizes weather particle systems and ambient lighting.',
      collected: false
    },
    {
      id: 'anom-3',
      x: -190,
      y: 90,
      title: 'Biorhythm Matrix',
      type: 'life',
      icon: '🌱',
      desc: 'Spawns vegetation, energy pylons, and primordial biomes.',
      collected: false
    },
    {
      id: 'anom-4',
      x: 170,
      y: 100,
      title: 'Gravitational Anchor',
      type: 'physics',
      icon: '🔮',
      desc: 'Solidifies physical ground and horizon boundary laws.',
      collected: false
    }
  ]);

  // Genesis Portal (spawns at center when score >= 100)
  const portalReady = manifestScore >= 100;

  // Proximity to anomalies or portal
  useEffect(() => {
    if (portalReady) {
      const distToCenter = Math.hypot(playerPos.x, playerPos.y);
      if (distToCenter < 65) {
        setActiveAnomaly({ id: 'genesis-portal', title: 'Genesis Vortex' });
        return;
      }
    }

    let nearby = null;
    for (const anom of anomalies) {
      if (anom.collected) continue;
      const dist = Math.hypot(playerPos.x - anom.x, playerPos.y - anom.y);
      if (dist < 70) {
        nearby = anom;
        break;
      }
    }
    setActiveAnomaly(nearby);
  }, [playerPos, anomalies, portalReady]);

  // Movement & procedural ground generation while walking
  useEffect(() => {
    if (leaping) return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        if (activeAnomaly) {
          if (activeAnomaly.id === 'genesis-portal') {
            triggerGenesisLeap();
          } else {
            interactWithAnomaly(activeAnomaly);
          }
        }
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const interval = setInterval(() => {
      let dx = 0;
      let dy = 0;
      const keys = keysPressed.current;

      if (keys['w'] || keys['arrowup']) { dy -= 4.5; setDirection('up'); }
      if (keys['s'] || keys['arrowdown']) { dy += 4.5; setDirection('down'); }
      if (keys['a'] || keys['arrowleft']) { dx -= 4.5; setDirection('left'); }
      if (keys['d'] || keys['arrowright']) { dx += 4.5; setDirection('right'); }

      if (dx !== 0 || dy !== 0) {
        setIsWalking(true);
        setPlayerPos((prev) => {
          const nextX = Math.max(-320, Math.min(320, prev.x + dx));
          const nextY = Math.max(-170, Math.min(170, prev.y + dy));

          // Every few steps, leave a manifested ground tile
          if (Math.random() < 0.18) {
            setManifestedBlocks((blocks) => {
              if (blocks.length > 35) return blocks.slice(1); // keep bounded
              return [
                ...blocks,
                {
                  id: Math.random(),
                  x: Math.round(nextX / 25) * 25,
                  y: Math.round(nextY / 25) * 25,
                  type: worldId,
                  time: Date.now()
                }
              ];
            });
          }

          return { x: nextX, y: nextY };
        });

        const now = Date.now();
        if (now - lastStep.current > 300) {
          AudioService.playStep();
          lastStep.current = now;
        }
      } else {
        setIsWalking(false);
      }
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, [activeAnomaly, leaping, worldId]);

  // Interacting with an anomaly manifests a large segment of the world
  const interactWithAnomaly = (anom) => {
    AudioService.playTone(520, 'sine', 0.5, 0.2, 780);
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anom.id ? { ...a, collected: true } : a))
    );

    // Add cluster of manifested terrain around the anomaly
    const newTiles = [];
    for (let ox = -40; ox <= 40; ox += 25) {
      for (let oy = -40; oy <= 40; oy += 25) {
        newTiles.push({
          id: Math.random(),
          x: anom.x + ox,
          y: anom.y + oy,
          type: worldId,
          time: Date.now()
        });
      }
    }
    setManifestedBlocks((prev) => [...prev, ...newTiles]);
    setManifestScore((prev) => Math.min(100, prev + 25));
  };

  const triggerGenesisLeap = () => {
    setLeaping(true);
    AudioService.playTone(300, 'sine', 1.5, 0.3, 900);
    setTimeout(() => {
      if (onWorldManifested) onWorldManifested();
    }, 1200);
  };

  const handleJoystickMove = ({ x, y, isMoving: moving, direction: dir }) => {
    if (leaping) return;
    setIsWalking(moving);
    if (dir) setDirection(dir);
    if (moving) {
      setPlayerPos((prev) => ({
        x: Math.max(-320, Math.min(320, prev.x + x * 4.5)),
        y: Math.max(-170, Math.min(170, prev.y + y * 4.5))
      }));
      const now = Date.now();
      if (now - lastStep.current > 300) {
        AudioService.playStep();
        lastStep.current = now;
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#01040a] overflow-hidden flex flex-col items-center justify-center font-mono select-none">
      {/* Infinite Void Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 hud-grid-overlay transition-opacity duration-500"
          style={{
            opacity: 0.15 + (manifestScore / 100) * 0.35,
            borderColor: accentColor
          }}
        />
        {/* Glow ambient tint reflecting progress */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}18 0%, transparent 70%)`,
            opacity: manifestScore / 100
          }}
        />
      </div>

      {/* Top Banner & World Manifestation Gauge */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center z-30 px-4 pointer-events-none">
        <div className="bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl max-w-lg w-full flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold tracking-widest text-cyan-400 flex items-center gap-1.5 uppercase">
              <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
              Genesis Engine: Manifesting Reality
            </span>
            <span className="font-black text-white bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
              {manifestScore}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400"
              style={{ width: `${manifestScore}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            {manifestScore < 100
              ? 'Walk through the empty void and interact with resonance anomalies to materialize your world.'
              : '🌟 World manifestation complete! A Genesis Vortex has ruptured at the center. Jump in!'}
          </p>
        </div>
      </div>

      {/* Playable Stage Area */}
      <div className="relative z-20 w-full max-w-4xl h-[460px] flex items-center justify-center">
        {/* Manifested Ground Tiles (Erupting blocks) */}
        {manifestedBlocks.map((b) => (
          <motion.div
            key={b.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 0.3 }}
            className="absolute rounded-xs pointer-events-none shadow-sm"
            style={{
              left: `calc(50% + ${b.x}px - 12px)`,
              top: `calc(50% + ${b.y}px - 12px)`,
              width: '24px',
              height: '24px',
              backgroundColor:
                b.type === 'cyber'
                  ? '#0e3a5a'
                  : b.type === 'fantasy'
                  ? '#064e3b'
                  : '#3b0764',
              border: `1px solid ${accentColor}50`
            }}
          />
        ))}

        {/* Floating Anomalies in the Void */}
        {anomalies.map((anom) => {
          if (anom.collected) return null;
          const isNearby = activeAnomaly?.id === anom.id;
          return (
            <div
              key={anom.id}
              onClick={() => interactWithAnomaly(anom)}
              className="absolute flex flex-col items-center cursor-pointer group"
              style={{
                left: `calc(50% + ${anom.x}px - 40px)`,
                top: `calc(50% + ${anom.y}px - 40px)`,
                width: '80px'
              }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  scale: isNearby ? 1.15 : 1
                }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl bg-slate-900/80 border-2 flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm"
                style={{
                  borderColor: isNearby ? '#ffffff' : `${accentColor}80`,
                  boxShadow: isNearby ? `0 0 25px ${accentColor}` : `0 0 10px ${accentColor}40`
                }}
              >
                <span>{anom.icon}</span>
              </motion.div>
              <span className="text-[10px] font-bold text-slate-300 mt-1.5 text-center leading-tight">
                {anom.title}
              </span>
              {isNearby && (
                <span className="text-[9px] font-black text-cyan-300 bg-black/80 px-2 py-0.5 rounded mt-0.5 animate-pulse border border-cyan-500/40">
                  ACTIVATE [SPACE]
                </span>
              )}
            </div>
          );
        })}

        {/* Genesis Vortex (Portal when 100% manifested) */}
        {portalReady && (
          <div
            onClick={triggerGenesisLeap}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{
              left: 'calc(50% - 60px)',
              top: 'calc(50% - 60px)',
              width: '120px'
            }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="w-28 h-28 rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{
                borderColor: '#ffffff',
                boxShadow: `0 0 50px ${accentColor}, inset 0 0 30px ${accentColor}`,
                background: `radial-gradient(circle, ${accentColor} 0%, rgba(15,23,42,0.8) 70%)`
              }}
            >
              <span className="text-4xl filter drop-shadow-md">🌀</span>
            </motion.div>
            <div className="mt-2 px-3 py-1 bg-white text-slate-950 font-black text-xs rounded-full shadow-2xl animate-bounce">
              JUMP IN [SPACE]
            </div>
          </div>
        )}

        {/* Playable Voxel Character */}
        <div
          className={`absolute z-30 transition-transform duration-75 ${
            leaping ? 'scale-0 transition-transform duration-1000 rotate-180' : ''
          }`}
          style={{
            transform: `translate(${playerPos.x}px, ${playerPos.y}px)`,
            left: 'calc(50% - 32px)',
            top: 'calc(50% - 48px)'
          }}
        >
          <VoxelCharacter
            isWalking={isWalking}
            direction={direction}
            isFloating={false}
            scale={1.2}
          />
        </div>
      </div>

      {/* Screen flash on portal jump */}
      <AnimatePresence>
        {leaping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="text-slate-950 text-2xl font-black tracking-widest uppercase text-center"
            >
              DIVING INTO YOUR MANIFEST REALITY...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Touch Joystick */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            if (activeAnomaly) {
              if (activeAnomaly.id === 'genesis-portal') triggerGenesisLeap();
              else interactWithAnomaly(activeAnomaly);
            }
          }}
          actionLabel={activeAnomaly?.id === 'genesis-portal' ? 'JUMP' : 'FORGE'}
        />
      </div>
    </div>
  );
}
