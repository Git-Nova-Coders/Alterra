import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { createVoxelCharacterMesh } from './three/VoxelCharacter3D';
import { OrbitCameraController } from './three/OrbitCameraController';
import DialogueBox from '../components/DialogueBox';
import { DIALOGUE_SCRIPTS } from '../data/dialogueScripts';
import VirtualJoystick from './VirtualJoystick';
import { WORLDS } from '../data/worlds';
import { AudioService } from '../services/audioService';
import {
  Compass,
  ArrowRight,
  Wind,
  Flame,
  Atom,
  Sparkles,
  Sliders,
  CheckCircle2
} from 'lucide-react';

/**
 * NexusGatesScene (Phase 3 of True 3D Engine)
 * 
 * - Full WebGL Canvas with Three.js.
 * - 360° Free Mouse Orbit Camera.
 * - Boundless celestial platform floating in deep 3D cosmos.
 * - 3 Massive 3D Volumetric Gateways:
 *   1. Cybernetic Gate (Neo-Kowloon 2099 - glowing cyan archway & energetic portal disc)
 *   2. Verdant Monolith Gate (Aethelgard Canopy - emerald stone monolith & living rune vortex)
 *   3. Singularity Rift Gate (Station Tartarus - deep purple event horizon ring)
 * - 3 Interactive 3D Genesis Tuning Monoliths (Atmosphere, Valence, Gravity)
 * - Character walks in full 3D with Third-Person Follow Camera.
 * - Approaching a gate causes it to resonate, hum, and prompts entry.
 */
export default function NexusGatesScene({ onSelectWorld }) {
  const mountRef = useRef(null);

  // Active world customizations tuned via Nexus Monoliths
  const [selectedAtmosphere, setSelectedAtmosphere] = useState('night');
  const [selectedMood, setSelectedMood] = useState('mysterious');
  const [selectedGravity, setSelectedGravity] = useState('balanced');
  const [activeModal, setActiveModal] = useState(null); // 'atmosphere' | 'mood' | 'gravity'

  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [enteringGate, setEnteringGate] = useState(null);
  const [showDialogue, setShowDialogue] = useState(true);

  const stateRef = useRef({
    keys: {},
    joystick: { x: 0, y: 0, isMoving: false },
    playerPos: new THREE.Vector3(0, 1.2, 12),
    isEntering: false,
    hoveredEntity: null,
    lastStepTime: 0
  });

  // Gates Definitions in 3D Space
  const gatesConfig = [
    {
      id: 'cyber',
      name: 'Cybernetic Gate',
      sub: 'Neo-Kowloon 2099',
      world: WORLDS.cyber,
      pos: new THREE.Vector3(-14, 0, -6),
      color: 0x00f0ff,
      emoji: '🏙️'
    },
    {
      id: 'fantasy',
      name: 'Verdant Monolith Gate',
      sub: 'Aethelgard Canopy',
      world: WORLDS.fantasy,
      pos: new THREE.Vector3(0, 0, -12),
      color: 0x10b981,
      emoji: '🌲'
    },
    {
      id: 'mystery',
      name: 'Singularity Rift Gate',
      sub: 'Station Tartarus',
      world: WORLDS.mystery,
      pos: new THREE.Vector3(14, 0, -6),
      color: 0xa855f7,
      emoji: '🛰️'
    }
  ];

  // 3 Genesis Tuning Monoliths in 3D Space
  const monolithsConfig = [
    {
      id: 'mono-atmo',
      title: 'Atmospheric Lens',
      type: 'atmosphere',
      icon: Wind,
      pos: new THREE.Vector3(-8, 0, 5),
      color: 0x38bdf8,
      desc: 'Tunes light refraction & particle fog'
    },
    {
      id: 'mono-mood',
      title: 'Valence Resonator',
      type: 'mood',
      icon: Flame,
      pos: new THREE.Vector3(0, 0, 5),
      color: 0xf59e0b,
      desc: 'Tunes world intensity & threat balance'
    },
    {
      id: 'mono-grav',
      title: 'Graviton Obelisk',
      type: 'gravity',
      icon: Atom,
      pos: new THREE.Vector3(8, 0, 5),
      color: 0xec4899,
      desc: 'Tunes kinematic leap & inertia laws'
    }
  ];

  // WebGL Mount & 3D Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02050e);
    scene.fog = new THREE.FogExp2(0x02050e, 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 6, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Free Orbit Camera Controller
    const orbitControls = new OrbitCameraController(camera, renderer.domElement, {
      radius: 7.5,
      phi: Math.PI * 0.38,
      theta: 0,
      target: new THREE.Vector3(0, 1.4, 12),
      minRadius: 3.5,
      maxRadius: 22.0,
      rotateSpeed: 0.0055,
      damping: 0.12
    });

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x0e7490, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 35, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 3. Floating Celestial Platform Mesh
    const platformGeo = new THREE.CylinderGeometry(24, 26, 2.5, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x091e3a,
      roughness: 0.5,
      metalness: 0.4
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.25;
    platform.receiveShadow = true;
    scene.add(platform);

    // Glowing rim around platform
    const rimGeo = new THREE.TorusGeometry(24.2, 0.3, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.05;
    scene.add(rim);

    // 4. Boundless 3D Starfield
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500 * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 300;
      starPos[i + 1] = (Math.random() - 0.5) * 300;
      starPos[i + 2] = (Math.random() - 0.5) * 300;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starField = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.4, transparent: true, opacity: 0.85 })
    );
    scene.add(starField);

    // 5. Build 3D Gate Meshes
    const gateMeshes = gatesConfig.map((gate) => {
      const group = new THREE.Group();
      group.position.copy(gate.pos);

      // Archway Pillars
      const pillarGeo = new THREE.BoxGeometry(1.2, 8, 1.2);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: gate.color,
        roughness: 0.3,
        metalness: 0.8
      });
      const leftP = new THREE.Mesh(pillarGeo, pillarMat);
      leftP.position.set(-2.6, 4, 0);
      group.add(leftP);

      const rightP = new THREE.Mesh(pillarGeo, pillarMat);
      rightP.position.set(2.6, 4, 0);
      group.add(rightP);

      // Top Arch
      const topGeo = new THREE.BoxGeometry(6.4, 1.2, 1.2);
      const topP = new THREE.Mesh(topGeo, pillarMat);
      topP.position.set(0, 8.2, 0);
      group.add(topP);

      // Swirling Portal Disc
      const discGeo = new THREE.CircleGeometry(2.4, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: gate.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.set(0, 4.2, 0);
      group.add(disc);

      scene.add(group);
      return { ...gate, group, disc };
    });

    // 6. Build 3D Monolith Meshes
    const monolithMeshes = monolithsConfig.map((mono) => {
      const group = new THREE.Group();
      group.position.copy(mono.pos);

      const geo = new THREE.BoxGeometry(1.4, 3.2, 1.4);
      const mat = new THREE.MeshStandardMaterial({
        color: mono.color,
        emissive: mono.color,
        emissiveIntensity: 0.5,
        roughness: 0.4
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 1.6;
      mesh.castShadow = true;
      group.add(mesh);

      scene.add(group);
      return { ...mono, group, mesh };
    });

    // 7. 3D Rigged Roblox Voxel Character
    const character = createVoxelCharacterMesh();
    character.root.position.copy(stateRef.current.playerPos);
    scene.add(character.root);

    // 8. Event Listeners
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        triggerAction();
      }
    };
    const handleKeyUp = (e) => {
      stateRef.current.keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const triggerAction = () => {
      const ent = stateRef.current.hoveredEntity;
      if (!ent) return;

      if (ent.isGate) {
        handleEnterGate(ent);
      } else {
        setActiveModal(ent.type);
        AudioService.playTone(550, 'sine', 0.25, 0.15);
      }
    };

    // 9. Render Loop
    let lastTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const state = stateRef.current;

      // Handle Character Movement
      let isMoving = false;
      if (!state.isEntering && !activeModal) {
        let moveX = 0;
        let moveZ = 0;
        const keys = state.keys;

        if (keys['w'] || keys['arrowup']) moveZ -= 1;
        if (keys['s'] || keys['arrowdown']) moveZ += 1;
        if (keys['a'] || keys['arrowleft']) moveX -= 1;
        if (keys['d'] || keys['arrowright']) moveX += 1;

        if (state.joystick.isMoving) {
          moveX = state.joystick.x;
          moveZ = state.joystick.y;
        }

        const moveLength = Math.hypot(moveX, moveZ);
        if (moveLength > 0.05) {
          isMoving = true;
          const speed = 7.0;
          const normX = moveX / (moveLength || 1);
          const normZ = moveZ / (moveLength || 1);

          state.playerPos.x += normX * speed * delta;
          state.playerPos.z += normZ * speed * delta;

          // Stay within platform boundary
          const distFromCenter = Math.hypot(state.playerPos.x, state.playerPos.z);
          if (distFromCenter > 22.0) {
            const angle = Math.atan2(state.playerPos.z, state.playerPos.x);
            state.playerPos.x = Math.cos(angle) * 22.0;
            state.playerPos.z = Math.sin(angle) * 22.0;
          }

          const targetAngle = Math.atan2(normX, normZ);
          character.root.rotation.y = THREE.MathUtils.lerp(
            character.root.rotation.y,
            targetAngle,
            0.15
          );

          if (currentTime - state.lastStepTime > 320) {
            AudioService.playStep();
            state.lastStepTime = currentTime;
          }
        }
      }

      character.root.position.copy(state.playerPos);

      // Portal entry leap dive
      if (state.isEntering) {
        character.root.position.y += delta * 3;
        character.root.rotation.x += delta * 8;
        character.root.scale.multiplyScalar(0.96);
      }

      character.update({
        isMoving,
        speed: 1.2,
        delta
      });

      // Animate Portals & Monoliths
      gateMeshes.forEach((g) => {
        g.disc.rotation.z += 0.02;
      });
      monolithMeshes.forEach((m, idx) => {
        m.mesh.position.y = 1.6 + Math.sin(currentTime * 0.003 + idx) * 0.25;
        m.mesh.rotation.y += 0.01;
      });

      // Proximity Detection
      let closest = null;
      let minGateDist = 5.0;
      gateMeshes.forEach((g) => {
        const d = state.playerPos.distanceTo(g.pos);
        if (d < minGateDist) {
          closest = { ...g, isGate: true };
        }
      });

      if (!closest) {
        monolithMeshes.forEach((m) => {
          const d = state.playerPos.distanceTo(m.pos);
          if (d < 4.0) {
            closest = { ...m, isGate: false };
          }
        });
      }

      state.hoveredEntity = closest;
      setHoveredEntity(closest);

      // Update Orbit Camera Target & Position
      orbitControls.setTarget(state.playerPos.x, state.playerPos.y + 1.4, state.playerPos.z);
      orbitControls.update(delta);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      orbitControls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleEnterGate = (gate) => {
    stateRef.current.isEntering = true;
    setEnteringGate(gate);
    AudioService.playTone(440, 'sine', 0.8, 0.25, 880);

    const tunedWorld = {
      ...gate.world,
      initialAtmosphere: selectedAtmosphere,
      mood: selectedMood,
      gravity: selectedGravity
    };

    setTimeout(() => {
      if (onSelectWorld) onSelectWorld(tunedWorld);
    }, 1300);
  };

  const handleJoystickMove = (data) => {
    stateRef.current.joystick = data;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#02050e] font-mono select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Banner Navigation & Status */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center pointer-events-none z-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md px-6 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center gap-3"
        >
          <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="text-xs sm:text-sm text-slate-100 font-bold tracking-wider">
            STEP INTO A 3D REALITY GATE OR TUNE GENESIS MONOLITHS
          </span>
        </motion.div>

        {/* Active Customization Badges */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            ATMOSPHERE: {selectedAtmosphere.toUpperCase()}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300">
            VALENCE: {selectedMood.toUpperCase()}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300">
            GRAVITY: {selectedGravity.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Interaction Callouts */}
      <div className="absolute bottom-10 inset-x-0 flex flex-col items-center z-20 pointer-events-none">
        {hoveredEntity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto"
          >
            {hoveredEntity.isGate ? (
              <button
                onClick={() => handleEnterGate(hoveredEntity)}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-sm tracking-widest uppercase rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.6)] border border-white flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce"
              >
                <span>LEAP INTO {hoveredEntity.name.toUpperCase()} [SPACE]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveModal(hoveredEntity.type);
                  AudioService.playTone(550, 'sine', 0.25, 0.15);
                }}
                className="px-6 py-3 bg-slate-900/90 text-white font-bold text-xs tracking-widest uppercase rounded-xl shadow-lg border border-cyan-400/50 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sliders className="w-4 h-4 text-cyan-300" />
                <span>TUNE {hoveredEntity.title.toUpperCase()} [SPACE]</span>
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Genesis Monolith Tuning Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              {activeModal === 'atmosphere' && (
                <div>
                  <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2 mb-1">
                    <Wind className="w-5 h-5" /> ATMOSPHERIC RESONANCE
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Calibrate the atmospheric density and lighting parameters for the reality ahead:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'dawn', label: 'Ion Dawn', desc: 'Crisp golden refraction' },
                      { id: 'twilight', label: 'Biolum Twilight', desc: 'Subtle neon purple mist' },
                      { id: 'night', label: 'Zero Midnight', desc: 'Stark high-contrast shadows' },
                      { id: 'storm', label: 'EM Storm', desc: 'Violent energetic arcs' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedAtmosphere(item.id);
                          AudioService.playTone(480, 'sine', 0.2, 0.1);
                          setActiveModal(null);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedAtmosphere === item.id
                            ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-cyan-500/50'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'mood' && (
                <div>
                  <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5" /> VALENCE RESONATOR
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Shape the emotional tension and creature behavior profiles:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'serene', label: 'Serene Harmonics', desc: 'Peaceful resonance' },
                      { id: 'mysterious', label: 'Veiled Enigma', desc: 'Uncharted signals' },
                      { id: 'dramatic', label: 'High Stakes', desc: 'Aggressive encounters' },
                      { id: 'apocalyptic', label: 'Cataclysmic', desc: 'Reality near collapse' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedMood(item.id);
                          AudioService.playTone(520, 'sine', 0.2, 0.1);
                          setActiveModal(null);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedMood === item.id
                            ? 'bg-amber-950 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-amber-500/50'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'gravity' && (
                <div>
                  <h3 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-1">
                    <Atom className="w-5 h-5" /> GRAVITON OBELISK
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Dictate the fundamental kinetic and inertia constants:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: 'Low-G', desc: 'Floaty leaps' },
                      { id: 'balanced', label: 'Earth Standard', desc: 'Balanced inertia' },
                      { id: 'dense', label: 'Super-Dense', desc: 'Heavy grounding' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedGravity(item.id);
                          AudioService.playTone(580, 'sine', 0.2, 0.1);
                          setActiveModal(null);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedGravity === item.id
                            ? 'bg-pink-950 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-pink-500/50'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen flash on entering portal */}
      <AnimatePresence>
        {enteringGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              className="text-slate-950 text-3xl font-black tracking-widest uppercase text-center drop-shadow"
            >
              LEAPING THROUGH {enteringGate.name}...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RPG Dialogue Guidance Box */}
      {showDialogue && (
        <DialogueBox
          dialogues={DIALOGUE_SCRIPTS.NEXUS_GATES}
          onComplete={() => {}}
        />
      )}

      {/* Mobile Touch Joystick */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            if (hoveredEntity) {
              if (hoveredEntity.isGate) handleEnterGate(hoveredEntity);
              else setActiveModal(hoveredEntity.type);
            }
          }}
          actionLabel={hoveredEntity?.isGate ? 'LEAP' : 'TUNE'}
        />
      </div>
    </div>
  );
}
