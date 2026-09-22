import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { createVoxelCharacterMesh } from './three/VoxelCharacter3D';
import { InfiniteVoxelTerrainManager } from './three/InfiniteVoxelTerrainManager';
import { OrbitCameraController } from './three/OrbitCameraController';
import VirtualJoystick from './VirtualJoystick';
import { AudioService } from '../services/audioService';
import { Eye, Hand, Sparkles, Move, Compass, ArrowUpRight, MousePointer } from 'lucide-react';

/**
 * DarkAwakeningScene3D
 * 
 * - Full WebGL Canvas with Three.js.
 * - Initial view: 45° from below looking up at 3D sleeping character floating in pitch darkness.
 * - 360° Free Mouse Orbit Camera to inspect the character from any angle.
 * - Raycast click/tap on character front triggers eye-nudging animation & awakening.
 * - Procedural terrain seamlessly rises as character awakens into third-person free roam.
 */
export default function DarkAwakeningScene({ onAwakened }) {
  const mountRef = useRef(null);

  // Awakening stage:
  // 0: Deep Sleep (pitch darkness, 45° below view, free orbit inspection)
  // 1: First Nudge (rubbing eyes, slit vision)
  // 2: Fully Awake (standing upright in 3D world with third-person orbit & WASD movement)
  const [awakenStage, setAwakenStage] = useState(0);
  const [nudgeProgress, setNudgeProgress] = useState(0); // 0 to 100%
  const [isNudgingArm, setIsNudgingArm] = useState(false);
  const [canTapPrompt, setCanTapPrompt] = useState(false);

  // Controls & 3D state refs for animation loop
  const stateRef = useRef({
    awakenStage: 0,
    isNudgingArm: false,
    keys: {},
    joystick: { x: 0, y: 0, isMoving: false },
    playerPos: new THREE.Vector3(0, 1.2, 0),
    playerVelocity: new THREE.Vector3(0, 0, 0),
    playerRotationY: 0,
    lastStepTime: 0
  });

  // Keep stateRef synced with React state
  useEffect(() => {
    stateRef.current.awakenStage = awakenStage;
    stateRef.current.isNudgingArm = isNudgingArm;
  }, [awakenStage, isNudgingArm]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020308); // Pitch dark space

    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Free Orbit Camera Controller (Starts 45° from below looking up)
    const orbitControls = new OrbitCameraController(camera, renderer.domElement, {
      radius: 5.2,
      phi: Math.PI * 0.72, // ~130° (45° from below horizontal)
      theta: 0,
      target: new THREE.Vector3(0, 1.8, 0),
      minPhi: 0.1,
      maxPhi: Math.PI * 0.95,
      minRadius: 2.2,
      maxRadius: 18.0,
      rotateSpeed: 0.0055,
      damping: 0.12
    });

    // 3. Dynamic Lighting (Subtle in deep sleep, radiant upon awakening)
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 30, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 40);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    // 4. Boundless 3D Starfield
    const starsCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 200;
      starPos[i + 1] = (Math.random() - 0.5) * 200;
      starPos[i + 2] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. Infinite Procedural 3D Voxel Terrain Manager (initialized & visible when awake)
    const terrainManager = new InfiniteVoxelTerrainManager(scene, 'cyber');
    terrainManager.updatePlayerPosition(0, 0);

    // 6. 3D Rigged Roblox Voxel Character
    const character = createVoxelCharacterMesh();
    character.root.position.set(0, 1.8, 0);
    scene.add(character.root);

    // Raycaster for tapping directly on character
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleCanvasClick = (event) => {
      if (orbitControls.hasMovedSignificantly) return; // ignore if dragging camera

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(character.root.children, true);

      if (intersects.length > 0) {
        performNudgeAction();
      }
    };
    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 7. Window Resize Listener
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 8. Keyboard Movement Handlers
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        performNudgeAction();
      }
    };
    const handleKeyUp = (e) => {
      stateRef.current.keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 9. Animation & Game Loop
    let lastTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const state = stateRef.current;
      const isSleeping = state.awakenStage === 0;
      const isNudging = state.isNudgingArm;

      // Handle Character Movement when Awake
      let isMoving = false;
      if (state.awakenStage === 2 && !isNudging) {
        let moveX = 0;
        let moveZ = 0;
        const keys = state.keys;

        if (keys['w'] || keys['arrowup']) moveZ -= 1;
        if (keys['s'] || keys['arrowdown']) moveZ += 1;
        if (keys['a'] || keys['arrowleft']) moveX -= 1;
        if (keys['d'] || keys['arrowright']) moveX += 1;

        // Joystick inputs
        if (state.joystick.isMoving) {
          moveX = state.joystick.x;
          moveZ = state.joystick.y;
        }

        const moveLength = Math.hypot(moveX, moveZ);
        if (moveLength > 0.05) {
          isMoving = true;
          const speed = 7.0;

          // Align movement relative to camera azimuth angle (orbitControls.theta)
          const camAngle = orbitControls.theta;
          const worldMoveX = moveX * Math.cos(camAngle) - moveZ * Math.sin(camAngle);
          const worldMoveZ = moveX * Math.sin(camAngle) + moveZ * Math.cos(camAngle);

          state.playerPos.x += (worldMoveX / moveLength) * speed * delta;
          state.playerPos.z += (worldMoveZ / moveLength) * speed * delta;

          // Face movement heading
          const targetAngle = Math.atan2(worldMoveX, worldMoveZ);
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
        }
      }

      // Update Character Position in World
      character.root.position.x = state.playerPos.x;
      character.root.position.z = state.playerPos.z;
      if (state.awakenStage === 2) {
        character.root.position.y = 1.0;
      }

      // Update Rigged Animation (Legs, arms, sleeping horizontal pose, eye rubbing)
      character.update({
        isMoving,
        speed: 1.2,
        isSleeping,
        isNudgingEyes: isNudging,
        delta
      });

      // Update Camera Target to follow player
      orbitControls.setTarget(
        state.playerPos.x,
        state.awakenStage === 0 ? 1.8 : 1.4,
        state.playerPos.z
      );

      // In sleep mode, check if camera is looking at front of character
      if (isSleeping) {
        // Dot product between camera position and front of sleeping character
        const camToChar = camera.position.clone().sub(character.root.position).normalize();
        const isFacingFront = camToChar.z > 0.2;
        setCanTapPrompt(isFacingFront);
      }

      // Smoothly update orbit camera
      orbitControls.update(delta);

      // Update Infinite Procedural Voxel Chunks
      if (state.awakenStage > 0) {
        terrainManager.updatePlayerPosition(state.playerPos.x, state.playerPos.z, delta);
        scene.background.lerp(new THREE.Color(0x06152b), 0.03);
        ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, 1.8, 0.03);
      }

      // Starfield slow drift
      starField.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      orbitControls.dispose();
      terrainManager.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Trigger Eye-Nudging Wipe
  const performNudgeAction = () => {
    if (awakenStage === 2) return;

    setIsNudgingArm(true);
    AudioService.playTone(420, 'sine', 0.25, 0.15, 680);

    const nextProgress = Math.min(100, nudgeProgress + 50);
    setNudgeProgress(nextProgress);

    setTimeout(() => {
      setIsNudgingArm(false);
      if (nextProgress >= 100) {
        setAwakenStage(2);
        AudioService.playAwakening();
      } else if (nextProgress >= 50) {
        setAwakenStage(1);
        AudioService.playTone(330, 'triangle', 0.3, 0.1);
      }
    }, 900);
  };

  // Drag / Swipe listener for mouse/touch
  const dragStart = useRef(null);
  const handlePointerDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const handlePointerUp = (e) => {
    if (!dragStart.current) return;
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    if (dx > 25 || dy > 25) {
      performNudgeAction();
    }
    dragStart.current = null;
  };

  const handleJoystickMove = (data) => {
    stateRef.current.joystick = data;
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-transparent font-mono select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Three.js WebGL Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Awakening UI Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
        {/* Top Header Status */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/85 border border-cyan-500/30 backdrop-blur-md px-6 py-2.5 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.2)] flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs sm:text-sm text-slate-100 font-bold tracking-widest uppercase">
              {awakenStage === 0
                ? 'Deep Slumber in the Infinite Zero-G Void'
                : awakenStage === 1
                ? 'Vision Blurry... Rub Eyes Clean'
                : 'Reality Awoken: Third-Person Free Roam'}
            </span>
          </motion.div>
        </div>

        {/* Center Prompt when asleep / waking */}
        {awakenStage < 2 && (
          <div className="flex flex-col items-center justify-center my-auto pointer-events-auto">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="bg-slate-950/90 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 max-w-md text-center shadow-2xl backdrop-blur-lg flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                {awakenStage === 0 ? <MousePointer className="w-8 h-8 animate-pulse text-cyan-400" /> : <Hand className="w-8 h-8 animate-bounce" />}
              </div>

              <div>
                <h2 className="text-lg font-black text-white tracking-wider uppercase">
                  {awakenStage === 0 ? 'Zero-G Slumber' : 'Vision Clearing'}
                </h2>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {awakenStage === 0
                    ? 'Drag with your mouse to orbit around the sleeping avatar in darkness. Click directly on his face or tap below to awaken him.'
                    : 'Gently nudge the eyes to clear the dimensional fog.'}
                </p>
              </div>

              {/* Eye-Wipe / Tap Button */}
              <button
                onClick={performNudgeAction}
                disabled={isNudgingArm}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-black text-xs tracking-widest uppercase shadow-lg shadow-cyan-900/40 border border-cyan-300/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Hand className="w-4 h-4 text-slate-950" />
                <span>{isNudgingArm ? 'RUBBING EYES...' : 'TAP TO WAKE UP [SPACE]'}</span>
              </button>

              {/* Progress gauge */}
              <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                <motion.div
                  className="bg-cyan-400 h-full"
                  style={{ width: `${nudgeProgress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom Nav / Onward Journey Once Awake */}
        {awakenStage === 2 && (
          <div className="flex flex-col items-center gap-3 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={onAwakened}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-widest uppercase rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.4)] border border-white/40 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span>APPROACH REALITY GATES</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
            <span className="text-[11px] text-cyan-300/80 bg-slate-950/80 px-4 py-1 rounded-full border border-cyan-500/20">
              Use WASD / Arrow Keys or Virtual Joystick to walk your 3D character in Third-Person
            </span>
          </div>
        )}
      </div>

      {/* Mobile Touch Joystick */}
      {awakenStage === 2 && (
        <div className="md:hidden pointer-events-auto">
          <VirtualJoystick
            onMove={handleJoystickMove}
            onAction={onAwakened}
            actionLabel="GATES"
          />
        </div>
      )}
    </div>
  );
}
