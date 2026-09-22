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
  Radio,
  Boxes,
  Compass
} from 'lucide-react';

/**
 * Void Manifestation Scene (Phase 3)
 * 
 * The player lands in an empty, desolate void space where nothing exists as far as the eye can see.
 * As the player walks through the void and interacts with dimensional resonance anomalies:
 * 1. 3D Voxel Terrain blocks (cyber neon grids, emerald woodland moss, or cosmic obsidian monoliths)
 *    physically erupt and rise from below the grid in real-time.
 * 2. Walking leaves procedural trail blocks that solidify reality behind the player's footsteps.
 * 3. Activating anomalies triggers thematic terrain explosions (trees, cyber towers, crystalline spires).
 * 4. Manifestation gauge scales from 0% to 100%.
 * 5. At 100%, a swirling Genesis Vortex portal ruptures at the center.
 * 6. The character physically runs towards and leaps through the portal into their created living world!
 */
export default function VoidManifestationScene({ world, onWorldManifested }) {
  const worldId = world?.id || 'cyber';
  const accentColor = world?.accentColor || '#00f0ff';

  // Player position in the boundless void grid
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 50 });
  const [direction, setDirection] = useState('down');
  const [isWalking, setIsWalking] = useState(false);

  // Manifested 3D terrain blocks created by player's movement & anomaly interactions
  const [manifestedBlocks, setManifestedBlocks] = useState([]);
  const [manifestScore, setManifestScore] = useState(0); // 0 to 100%
  const [activeAnomaly, setActiveAnomaly] = useState(null);
  const [leaping, setLeaping] = useState(false);

  const keysPressed = useRef({});
  const lastStep = useRef(0);

  // Dimensional Resonance Anomalies in the void
  const [anomalies, setAnomalies] = useState([
    {
      id: 'anom-1',
      x: -180,
      y: -80,
      title: 'Lithic Foundation Shard',
      type: 'terrain',
      icon: '💎',
      desc: 'Extrudes 3D structural voxel bedrock across the sector.',
      collected: false,
      blockColor: worldId === 'cyber' ? '#00f0ff' : worldId === 'fantasy' ? '#10b981' : '#a855f7'
    },
    {
      id: 'anom-2',
      x: 190,
      y: -90,
      title: 'Atmospheric Pulse Matrix',
      type: 'atmosphere',
      icon: '⚡',
      desc: 'Ignites weather particle systems and dynamic skybox radiance.',
      collected: false,
      blockColor: worldId === 'cyber' ? '#38bdf8' : worldId === 'fantasy' ? '#34d399' : '#c084fc'
    },
    {
      id: 'anom-3',
      x: -210,
      y: 90,
      title: 'Biorhythm Seed',
      type: 'life',
      icon: '🌱',
      desc: 'Grows procedural biome foliage, cyber circuits, or cosmic crystals.',
      collected: false,
      blockColor: worldId === 'cyber' ? '#06b6d4' : worldId === 'fantasy' ? '#059669' : '#9333ea'
    },
    {
      id: 'anom-4',
      x: 180,
      y: 110,
      title: 'Gravimetric Horizon Anchor',
      type: 'physics',
      icon: '🔮',
      desc: 'Locks elevation boundaries and gravitational mass constants.',
      collected: false,
      blockColor: worldId === 'cyber' ? '#2563eb' : worldId === 'fantasy' ? '#047857' : '#7e22ce'
    }
  ]);

  // Genesis Portal (spawns at center when score >= 100)
  const portalReady = manifestScore >= 100;

  // Proximity detection loop
  useEffect(() => {
    if (portalReady) {
      const distToCenter = Math.hypot(playerPos.x, playerPos.y);
      if (distToCenter < 70) {
        setActiveAnomaly({ id: 'genesis-portal', title: 'Genesis Vortex Portal' });
        return;
      }
    }

    let nearby = null;
    for (const anom of anomalies) {
      if (anom.collected) continue;
      const dist = Math.hypot(playerPos.x - anom.x, playerPos.y - anom.y);
      if (dist < 75) {
        nearby = anom;
        break;
      }
    }
    setActiveAnomaly(nearby);
  }, [playerPos, anomalies, portalReady]);

  // Movement & procedural ground extrusion while walking
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
          const nextX = Math.max(-330, Math.min(330, prev.x + dx));
          const nextY = Math.max(-175, Math.min(175, prev.y + dy));

          // Procedurally leave 3D manifested voxel tiles along footsteps
          if (Math.random() < 0.22) {
            setManifestedBlocks((blocks) => {
              if (blocks.length > 50) return blocks.slice(1); // keep optimal performance
              return [
                ...blocks,
                {
                  id: Math.random(),
                  x: Math.round(nextX / 28) * 28,
                  y: Math.round(nextY / 28) * 28,
                  height: 12 + Math.floor(Math.random() * 14),
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

  // Interacting with an anomaly creates a 3D terrain cluster eruption
  const interactWithAnomaly = (anom) => {
    AudioService.playTone(520, 'sine', 0.5, 0.2, 780);
    setAnomalies((prev) =>
      prev.map((a) => (a.id === anom.id ? { ...a, collected: true } : a))
    );

    // Erupt a 3D block cluster around the anomaly
    const newTiles = [];
    for (let ox = -50; ox <= 50; ox += 28) {
      for (let oy = -50; oy <= 50; oy += 28) {
        newTiles.push({
          id: Math.random(),
          x: anom.x + ox,
          y: anom.y + oy,
          height: 16 + Math.floor(Math.random() * 20),
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
    }, 1300);
  };

  const handleJoystickMove = ({ x, y, isMoving: moving, direction: dir }) => {
    if (leaping) return;
    setIsWalking(moving);
    if (dir) setDirection(dir);
    if (moving) {
      setPlayerPos((prev) => ({
        x: Math.max(-330, Math.min(330, prev.x + x * 4.5)),
        y: Math.max(-175, Math.min(175, prev.y + y * 4.5))
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
            background: `radial-gradient(circle at 50% 50%, ${accentColor}22 0%, transparent 70%)`,
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
              Genesis Engine: 3D Void Manifestation
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
              ? 'Walk through the desolate void to extrude 3D terrain and gather anomaly shards.'
              : '🌟 Manifestation complete! The Genesis Vortex is open at center. Run and leap in!'}
          </p>
        </div>
      </div>

      {/* Playable Stage Area */}
      <div className="relative z-20 w-full max-w-5xl h-[500px] flex items-center justify-center">
        {/* Manifested 3D Voxel Ground Blocks */}
        {manifestedBlocks.map((b) => (
          <motion.div
            key={b.id}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.9 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute rounded-xs pointer-events-none shadow-md"
            style={{
              left: `calc(50% + ${b.x}px - 14px)`,
              top: `calc(50% + ${b.y}px - 14px)`,
              width: '28px',
              height: `${b.height}px`,
              transformOrigin: 'bottom center',
              backgroundColor:
                b.type === 'cyber'
                  ? '#0e3a5a'
                  : b.type === 'fantasy'
                  ? '#064e3b'
                  : '#3b0764',
              borderTop: `2px solid ${accentColor}`,
              borderLeft: `1px solid ${accentColor}40`,
              borderRight: `1px solid ${accentColor}40`,
              boxShadow: `0 4px 10px rgba(0,0,0,0.5), inset 0 2px 5px ${accentColor}44`
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
                left: `calc(50% + ${anom.x}px - 45px)`,
                top: `calc(50% + ${anom.y}px - 45px)`,
                width: '90px'
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  scale: isNearby ? 1.15 : 1
                }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl bg-slate-900/90 border-2 flex items-center justify-center text-2xl shadow-xl backdrop-blur-sm"
                style={{
                  borderColor: isNearby ? '#ffffff' : `${accentColor}80`,
                  boxShadow: isNearby ? `0 0 30px ${accentColor}` : `0 0 12px ${accentColor}40`
                }}
              >
                <span>{anom.icon}</span>
              </motion.div>
              <span className="text-[10px] font-bold text-slate-200 mt-1.5 text-center leading-tight">
                {anom.title}
              </span>
              {isNearby && (
                <span className="text-[9px] font-black text-cyan-300 bg-black/90 px-2 py-0.5 rounded mt-1 animate-pulse border border-cyan-500/50">
                  EXTRUDE [SPACE]
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
              left: 'calc(50% - 65px)',
              top: 'calc(50% - 65px)',
              width: '130px'
            }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden"
              style={{
                borderColor: '#ffffff',
                boxShadow: `0 0 60px ${accentColor}, inset 0 0 35px ${accentColor}`,
                background: `radial-gradient(circle, ${accentColor} 0%, rgba(15,23,42,0.85) 75%)`
              }}
            >
              <span className="text-5xl filter drop-shadow-lg animate-pulse">🌀</span>
            </motion.div>
            <div className="mt-2 px-3 py-1 bg-white text-slate-950 font-black text-xs rounded-full shadow-2xl animate-bounce">
              LEAP IN [SPACE]
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
              className="text-slate-950 text-2xl font-black tracking-widest uppercase text-center drop-shadow"
            >
              ENTERING YOUR CREATED REALITY...
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
