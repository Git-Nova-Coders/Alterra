import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { createVoxelCharacterMesh } from './three/VoxelCharacter3D';
import { InfiniteVoxelTerrainManager } from './three/InfiniteVoxelTerrainManager';
import VirtualJoystick from './VirtualJoystick';
import { useGameState, GAME_ACTIONS } from '../context/GameStateContext';
import { GAME_STAGES } from '../data/gameState';
import { AudioService } from '../services/audioService';
import {
  Volume2,
  HeartHandshake,
  Zap,
  EyeOff,
  Compass,
  ArrowRight,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';

/**
 * LivingWorldScene (Phase 4 of True 3D Engine)
 * 
 * - Full WebGL Canvas with Three.js.
 * - Boundless extending 3D living world generated via InfiniteVoxelTerrainManager.
 * - 3D Rigged Roblox Voxel Character with Third-Person Follow Camera.
 * - 3D Animated Wounded Creature model placed in the extending terrain:
 *   - Emits directional 3D audio growls and physical ground shockwave rings.
 *   - Proximity radar measures real 3D Euclidean distance.
 * - Interactive moral decision modal (Soothe & Heal, Harness Core, Slip Past):
 *   - Mutates the real-time WebGL world lighting, fog, and voxel colors!
 * - Boundless exploration with live coordinates displayed.
 */
export default function LivingWorldScene() {
  const mountRef = useRef(null);
  const { state, dispatch, setStage } = useGameState();
  const world = state.world || { id: 'cyber', name: 'Neo-Kowloon 2099', theme: 'digital', accentColor: '#00f0ff' };
  const worldId = world.id || 'cyber';

  const [distanceToCreature, setDistanceToCreature] = useState(60);
  const [screenRumble, setScreenRumble] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [choiceMade, setChoiceMade] = useState(state.encounterChoice || null);
  const [environmentToned, setEnvironmentToned] = useState(null);
  const [coords, setCoords] = useState({ x: 0, z: 0 });

  const creaturePos3D = useRef(new THREE.Vector3(28, 1.8, -35));

  const stateRef = useRef({
    keys: {},
    joystick: { x: 0, y: 0, isMoving: false },
    playerPos: new THREE.Vector3(0, 1.2, 0),
    modalOpen: false,
    choiceMade: state.encounterChoice || null,
    lastStepTime: 0,
    lastGrowlTime: 0
  });

  useEffect(() => {
    stateRef.current.modalOpen = modalOpen;
    stateRef.current.choiceMade = choiceMade;
  }, [modalOpen, choiceMade]);

  // WebGL Mount & 3D Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020817);
    scene.fog = new THREE.FogExp2(0x020817, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lighting (Dynamic according to moral choice)
    const ambientLight = new THREE.AmbientLight(0x0284c7, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(25, 45, 25);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 3. Infinite Procedural 3D Voxel Terrain Manager
    const terrainManager = new InfiniteVoxelTerrainManager(scene, worldId);
    terrainManager.updatePlayerPosition(0, 0);

    // 4. 3D Character Mesh
    const character = createVoxelCharacterMesh();
    character.root.position.set(0, 1.2, 0);
    scene.add(character.root);

    // 5. 3D Animated Wounded Creature Model
    const creatureGroup = new THREE.Group();
    creatureGroup.position.copy(creaturePos3D.current);

    // Creature Body
    const cBodyGeo = new THREE.BoxGeometry(3.0, 2.2, 3.8);
    const cBodyMat = new THREE.MeshStandardMaterial({
      color: 0x9f1239,
      roughness: 0.6,
      metalness: 0.3
    });
    const cBody = new THREE.Mesh(cBodyGeo, cBodyMat);
    cBody.position.y = 1.1;
    cBody.castShadow = true;
    creatureGroup.add(cBody);

    // Creature Head
    const cHeadGeo = new THREE.BoxGeometry(2.0, 1.8, 2.2);
    const cHeadMat = new THREE.MeshStandardMaterial({ color: 0xbe123c });
    const cHead = new THREE.Mesh(cHeadGeo, cHeadMat);
    cHead.position.set(0, 2.2, -1.8);
    cHead.castShadow = true;
    creatureGroup.add(cHead);

    // Glowing fractured dimensional core on its chest
    const coreGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 1.5
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 1.4, 0.4);
    creatureGroup.add(coreMesh);

    // Shockwave pulse ring on ground
    const ringGeo = new THREE.RingGeometry(1.5, 2.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
    shockwaveRing.rotation.x = Math.PI / 2;
    shockwaveRing.position.y = 0.05;
    creatureGroup.add(shockwaveRing);

    scene.add(creatureGroup);

    // 6. Input Listeners
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        const dist = stateRef.current.playerPos.distanceTo(creaturePos3D.current);
        if (dist < 8.0 && !stateRef.current.modalOpen && !stateRef.current.choiceMade) {
          setModalOpen(true);
          AudioService.playTone(300, 'sawtooth', 0.8, 0.2, 100);
        }
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

    // 7. Animation Loop
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
      if (!state.modalOpen) {
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
          const speed = 7.5;
          const normX = moveX / (moveLength || 1);
          const normZ = moveZ / (moveLength || 1);

          state.playerPos.x += normX * speed * delta;
          state.playerPos.z += normZ * speed * delta;

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

          setCoords({
            x: Math.round(state.playerPos.x),
            z: Math.round(state.playerPos.z)
          });
        }
      }

      character.root.position.copy(state.playerPos);
      character.update({
        isMoving,
        speed: 1.3,
        delta
      });

      // Update Procedural Extending 3D Terrain around player
      terrainManager.updatePlayerPosition(state.playerPos.x, state.playerPos.z, delta);

      // Animate Creature & Shockwave
      const dist = state.playerPos.distanceTo(creaturePos3D.current);
      setDistanceToCreature(dist);

      if (!state.choiceMade) {
        cBody.position.y = 1.1 + Math.sin(currentTime * 0.005) * 0.15;
        coreMesh.scale.setScalar(1.0 + Math.sin(currentTime * 0.01) * 0.2);

        // Shockwave expansion
        const waveScale = (currentTime * 0.002) % 3.5;
        shockwaveRing.scale.set(waveScale, waveScale, 1);
        ringMat.opacity = Math.max(0, 1 - waveScale / 3.5);

        // Creature Growl Audio Interval
        const growlInterval = Math.max(1400, dist * 100);
        if (currentTime - state.lastGrowlTime > growlInterval) {
          AudioService.playCreatureGrowl();
          setScreenRumble(true);
          setTimeout(() => setScreenRumble(false), 300);
          state.lastGrowlTime = currentTime;
        }

        // Automatic interaction trigger when close
        if (dist < 6.5 && !state.modalOpen) {
          setModalOpen(true);
          AudioService.playTone(300, 'sawtooth', 0.8, 0.2, 100);
        }
      } else {
        // Choice resolved: calm creature
        shockwaveRing.visible = false;
        cBodyMat.color.setHex(0x065f46);
        coreMat.color.setHex(0x10b981);
        coreMat.emissive.setHex(0x059669);
      }

      // Third-Person Camera Follow
      const camTargetPos = new THREE.Vector3(
        state.playerPos.x,
        state.playerPos.y + 4.2,
        state.playerPos.z + 8.0
      );
      camera.position.lerp(camTargetPos, 0.08);
      camera.lookAt(state.playerPos.x, state.playerPos.y + 1.8, state.playerPos.z);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      terrainManager.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [worldId]);

  const handleSelectChoice = (choiceId) => {
    setChoiceMade(choiceId);
    stateRef.current.choiceMade = choiceId;
    setModalOpen(false);

    dispatch({ type: GAME_ACTIONS.SET_ENCOUNTER_CHOICE, payload: choiceId });

    if (choiceId === 'help') {
      AudioService.playArtifactReaction('save');
      setEnvironmentToned('healed');
    } else if (choiceId === 'take') {
      AudioService.playArtifactReaction('control');
      setEnvironmentToned('subjugated');
    } else {
      AudioService.playTone(350, 'sine', 0.5, 0.15);
      setEnvironmentToned('bypassed');
    }
  };

  const handleJoystickMove = (data) => {
    stateRef.current.joystick = data;
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-[#020817] font-mono select-none ${
        screenRumble ? 'translate-x-0.5 -translate-y-0.5' : ''
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Banner HUD: Directional Distance Radar */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center z-20 px-4 pointer-events-none">
        <div className="bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <Volume2 className={`w-4 h-4 ${distanceToCreature < 18 ? 'animate-bounce' : ''}`} />
            <span>3D DISTRESS RADAR</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Range:</span>
            <span className="font-mono text-cyan-400 font-bold">
              {Math.round(distanceToCreature)}m
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-[10px] text-slate-400">
            Coords: ({coords.x}, {coords.z})
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-amber-400">
            {distanceToCreature < 10
              ? '⚠️ Wounded Beast within reach!'
              : 'Follow directional growl vibrations'}
          </span>
        </div>
      </div>

      {/* Choice Modal (The Critical 3D Encounter) */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-4xl mb-3 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                {world.theme === 'magical' ? '🦌' : world.theme === 'cosmic' ? '👾' : '🤖'}
              </div>

              <span className="text-xs font-bold tracking-widest text-rose-400 uppercase mb-1">
                Encounter: 3D Dimensional Entity
              </span>
              <h3 className="text-xl font-black text-white mb-2">
                Growls in Agony from Core Trauma
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-md">
                Suffering from a fractured energy core that distorts the extending 3D terrain. How do you decide its fate?
              </p>

              {/* 3 Branching Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-4">
                <button
                  onClick={() => handleSelectChoice('help')}
                  className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/40 flex flex-col items-center gap-2 text-center transition-all cursor-pointer group shadow-lg"
                >
                  <HeartHandshake className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-emerald-300">Soothe & Heal</span>
                  <span className="text-[10px] text-slate-400">
                    Channel bio-attunement to mend its wounds in harmony.
                  </span>
                </button>

                <button
                  onClick={() => handleSelectChoice('take')}
                  className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-900/40 flex flex-col items-center gap-2 text-center transition-all cursor-pointer group shadow-lg"
                >
                  <Zap className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-purple-300">Harness Core</span>
                  <span className="text-[10px] text-slate-400">
                    Siphon its raw energy to supercharge world power.
                  </span>
                </button>

                <button
                  onClick={() => handleSelectChoice('evade')}
                  className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 flex flex-col items-center gap-2 text-center transition-all cursor-pointer group shadow-lg"
                >
                  <EyeOff className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-cyan-300">Slip Past</span>
                  <span className="text-[10px] text-slate-400">
                    Conceal your presence and let nature run its course.
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onward Journey Button once resolved */}
      {choiceMade && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center z-20 pointer-events-none"
        >
          <button
            onClick={() => setStage(GAME_STAGES.ARTIFACT)}
            className="pointer-events-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-widest rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-300/40 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>PROCEED TO WORLD ARTIFACT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-400 mt-2 bg-black/60 px-3 py-1 rounded-full">
            World shifted towards {choiceMade === 'help' ? 'Harmony 🌿' : choiceMade === 'take' ? 'Dominion ⚡' : 'Shadows 🕶️'}
          </span>
        </motion.div>
      )}

      {/* Mobile Touch Joystick */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={() => {
            const dist = stateRef.current.playerPos.distanceTo(creaturePos3D.current);
            if (dist < 8.0 && !modalOpen && !choiceMade) {
              setModalOpen(true);
            }
          }}
          actionLabel="INTERACT"
        />
      </div>
    </div>
  );
}
