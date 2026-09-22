import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { createVoxelCharacterMesh } from './three/VoxelCharacter3D';
import { InfiniteVoxelTerrainManager } from './three/InfiniteVoxelTerrainManager';
import { OrbitCameraController } from './three/OrbitCameraController';
import DialogueBox from '../components/DialogueBox';
import { DIALOGUE_SCRIPTS } from '../data/dialogueScripts';
import VirtualJoystick from './VirtualJoystick';
import { AudioService } from '../services/audioService';
import { Sparkles, Globe, Compass, ArrowRight, Zap, CheckCircle } from 'lucide-react';

/**
 * VoidManifestationScene (Phase 2 of True 3D Engine)
 * 
 * - Full WebGL Canvas with Three.js.
 * - 360° Free Mouse Orbit Camera.
 * - Boundless extending 3D voxel terrain powered by InfiniteVoxelTerrainManager.
 * - As the character walks in any direction:
 *   - New 3D voxel chunks erupt and physically rise from below the grid.
 *   - The world dynamically extends into infinity with no boundaries or invisible walls.
 * - Resonance Shards appear across the landscape; collecting them raises the Genesis Gauge.
 * - At 100%, a 3D Genesis Vortex Portal ruptures into the world, allowing the player to leap in!
 */
export default function VoidManifestationScene({ world, onWorldManifested }) {
  const mountRef = useRef(null);
  const worldId = world?.id || 'cyber';
  const accentColor = world?.accentColor || '#00f0ff';

  const [manifestScore, setManifestScore] = useState(0);
  const [nearbyShard, setNearbyShard] = useState(null);
  const [portalReady, setPortalReady] = useState(false);
  const [isLeaping, setIsLeaping] = useState(false);
  const [showDialogue, setShowDialogue] = useState(true);

  // Live coordinates displayed in HUD
  const [coords, setCoords] = useState({ x: 0, z: 0 });

  // Scene state refs for Three.js render loop
  const stateRef = useRef({
    keys: {},
    joystick: { x: 0, y: 0, isMoving: false },
    playerPos: new THREE.Vector3(0, 1.2, 0),
    playerHeading: 0,
    manifestScore: 0,
    isLeaping: false,
    shards: [
      { id: 1, pos: new THREE.Vector3(-25, 2.5, -20), collected: false, name: 'Lithic Foundation Shard' },
      { id: 2, pos: new THREE.Vector3(30, 2.5, -35), collected: false, name: 'Atmospheric Pulse Matrix' },
      { id: 3, pos: new THREE.Vector3(-35, 2.5, 30), collected: false, name: 'Biorhythm Seed' },
      { id: 4, pos: new THREE.Vector3(25, 2.5, 40), collected: false, name: 'Gravimetric Horizon Anchor' }
    ],
    lastStepTime: 0
  });

  useEffect(() => {
    stateRef.current.manifestScore = manifestScore;
    stateRef.current.isLeaping = isLeaping;
    if (manifestScore >= 100) setPortalReady(true);
  }, [manifestScore, isLeaping]);

  // Three.js Mount & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Free Orbit Camera Controller
    const orbitControls = new OrbitCameraController(camera, renderer.domElement, {
      radius: 6.8,
      phi: Math.PI * 0.38,
      theta: 0,
      target: new THREE.Vector3(0, 1.4, 0),
      minRadius: 3.0,
      maxRadius: 20.0,
      rotateSpeed: 0.0055,
      damping: 0.12
    });

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(
      worldId === 'fantasy' ? 0x064e3b : worldId === 'mystery' ? 0x3b0764 : 0x0c4a6e,
      1.2
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 3. Infinite Procedural 3D Voxel Terrain Manager
    const terrainManager = new InfiniteVoxelTerrainManager(scene, worldId);
    terrainManager.updatePlayerPosition(0, 0);

    // 4. 3D Character Mesh
    const character = createVoxelCharacterMesh();
    character.root.position.set(0, 1.2, 0);
    scene.add(character.root);

    // 5. 3D Shard Meshes
    const shardGroup = new THREE.Group();
    const shardGeo = new THREE.OctahedronGeometry(1.2, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });

    const shardMeshes = stateRef.current.shards.map((s) => {
      const mesh = new THREE.Mesh(shardGeo, shardMat);
      mesh.position.copy(s.pos);
      mesh.castShadow = true;
      shardGroup.add(mesh);
      return mesh;
    });
    scene.add(shardGroup);

    // 6. 3D Genesis Vortex Portal (At center, activates at 100%)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 2.5, 0);
    portalGroup.visible = false;

    const ringGeo = new THREE.TorusGeometry(3.5, 0.4, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: worldId === 'fantasy' ? 0x10b981 : worldId === 'mystery' ? 0xa855f7 : 0x00f0ff,
      emissiveIntensity: 1.5
    });
    const portalRing = new THREE.Mesh(ringGeo, ringMat);
    portalGroup.add(portalRing);

    const vortexGeo = new THREE.CircleGeometry(3.2, 32);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: worldId === 'fantasy' ? 0x047857 : worldId === 'mystery' ? 0x6b21a8 : 0x0369a1,
      side: THREE.DoubleSide
    });
    const vortexDisc = new THREE.Mesh(vortexGeo, vortexMat);
    portalGroup.add(vortexDisc);

    scene.add(portalGroup);

    // 7. Input Listeners
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        checkInteraction();
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

    // 8. Interaction trigger
    const checkInteraction = () => {
      const state = stateRef.current;
      if (state.manifestScore >= 100) {
        const distToCenter = Math.hypot(state.playerPos.x, state.playerPos.z);
        if (distToCenter < 5.0) {
          triggerLeap();
          return;
        }
      }

      // Check nearby shards
      state.shards.forEach((s, idx) => {
        if (!s.collected) {
          const dist = state.playerPos.distanceTo(s.pos);
          if (dist < 4.5) {
            s.collected = true;
            shardMeshes[idx].visible = false;
            AudioService.playTone(520, 'sine', 0.5, 0.2, 780);
            setManifestScore((prev) => Math.min(100, prev + 25));
          }
        }
      });
    };

    const triggerLeap = () => {
      setIsLeaping(true);
      AudioService.playTone(300, 'sine', 1.5, 0.3, 900);
      setTimeout(() => {
        if (onWorldManifested) onWorldManifested();
      }, 1400);
    };

    // 9. Main Render Loop
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
      if (!state.isLeaping) {
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

          // Face movement direction
          const targetAngle = Math.atan2(normX, normZ);
          character.root.rotation.y = THREE.MathUtils.lerp(
            character.root.rotation.y,
            targetAngle,
            0.15
          );

          // Audio footsteps
          if (currentTime - state.lastStepTime > 320) {
            AudioService.playStep();
            state.lastStepTime = currentTime;
          }

          // Update HUD coordinates
          setCoords({
            x: Math.round(state.playerPos.x),
            z: Math.round(state.playerPos.z)
          });
        }
      }

      // Update Character Mesh position
      character.root.position.copy(state.playerPos);

      // Leap dive animation
      if (state.isLeaping) {
        character.root.position.y += delta * 4;
        character.root.rotation.x += delta * 6;
        character.root.scale.multiplyScalar(0.97);
      }

      character.update({
        isMoving,
        speed: 1.3,
        delta
      });

      // Update Procedural Extending 3D Terrain around player
      terrainManager.updatePlayerPosition(state.playerPos.x, state.playerPos.z, delta);

      // Animate Shards floating & rotating
      shardMeshes.forEach((mesh, idx) => {
        if (mesh.visible) {
          mesh.rotation.y += 0.02;
          mesh.rotation.x += 0.01;
          mesh.position.y = state.shards[idx].pos.y + Math.sin(currentTime * 0.003 + idx) * 0.3;
        }
      });

      // Check proximity to shards or portal
      let closeShard = null;
      state.shards.forEach((s) => {
        if (!s.collected && state.playerPos.distanceTo(s.pos) < 4.5) {
          closeShard = s;
        }
      });
      setNearbyShard(closeShard);

      // Portal activation at 100%
      if (state.manifestScore >= 100) {
        portalGroup.visible = true;
        portalRing.rotation.z += 0.015;
        vortexDisc.rotation.z -= 0.02;
      }

      // Update Camera Target to follow player & update Orbit Camera
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
      terrainManager.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [worldId]);

  const handleJoystickMove = (data) => {
    stateRef.current.joystick = data;
  };

  const handleActionClick = () => {
    // Collect shard or enter portal
    const state = stateRef.current;
    if (state.manifestScore >= 100) {
      const distToCenter = Math.hypot(state.playerPos.x, state.playerPos.z);
      if (distToCenter < 5.0) {
        setIsLeaping(true);
        AudioService.playTone(300, 'sine', 1.5, 0.3, 900);
        setTimeout(() => {
          if (onWorldManifested) onWorldManifested();
        }, 1400);
        return;
      }
    }

    state.shards.forEach((s) => {
      if (!s.collected && state.playerPos.distanceTo(s.pos) < 4.5) {
        s.collected = true;
        AudioService.playTone(520, 'sine', 0.5, 0.2, 780);
        setManifestScore((prev) => Math.min(100, prev + 25));
      }
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020617] font-mono select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Banner: Genesis Progress Gauge & Boundless Coordinates */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center z-20 px-4 pointer-events-none">
        <div className="bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold tracking-widest text-cyan-400 flex items-center gap-1.5 uppercase">
              <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
              Infinite 3D Voxel Engine
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                X: {coords.x} | Z: {coords.z}
              </span>
              <span className="font-black text-white bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
                {manifestScore}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400"
              style={{ width: `${manifestScore}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>

          <p className="text-[11px] text-slate-300 text-center">
            {manifestScore < 100
              ? 'Walk in any direction to physically extrude new 3D voxel chunks and collect resonance shards.'
              : '🌟 World manifest complete! The Genesis Portal has ruptured at the center (0, 0). Run and leap in!'}
          </p>
        </div>
      </div>

      {/* Interaction Prompts (Shard or Portal) */}
      <div className="absolute bottom-10 inset-x-0 flex flex-col items-center z-20 pointer-events-none">
        {nearbyShard && !portalReady && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleActionClick}
            className="pointer-events-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-widest uppercase rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.5)] border border-cyan-300 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>EXTRUDE {nearbyShard.name.toUpperCase()} [SPACE]</span>
          </motion.button>
        )}

        {portalReady && Math.hypot(coords.x, coords.z) < 6.0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleActionClick}
            className="pointer-events-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm tracking-widest uppercase rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.6)] border border-white flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce"
          >
            <span>LEAP INTO MANIFEST REALITY [SPACE]</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Screen flash on portal leap */}
      <AnimatePresence>
        {isLeaping && (
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
              WARPING INTO YOUR EXTENDED 3D WORLD...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RPG Dialogue Guidance Box */}
      {showDialogue && (
        <DialogueBox
          dialogues={DIALOGUE_SCRIPTS.VOID_MANIFESTATION}
          onComplete={() => {}}
        />
      )}

      {/* Mobile Touch Joystick */}
      <div className="md:hidden">
        <VirtualJoystick
          onMove={handleJoystickMove}
          onAction={handleActionClick}
          actionLabel={portalReady ? 'LEAP' : nearbyShard ? 'HARNESS' : 'WALK'}
        />
      </div>
    </div>
  );
}
