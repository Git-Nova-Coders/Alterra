import * as THREE from 'three';

/**
 * Infinite 3D Procedural Voxel Chunk Manager
 * 
 * - Divides the boundless world into infinite grid chunks (e.g. 16x16 units per chunk).
 * - As the character walks across the world in any direction:
 *   - New chunks are generated dynamically in the direction of travel.
 *   - 3D Voxel blocks physically erupt and rise smoothly from the bottom with a spawn animation.
 *   - Old distant chunks beyond the view distance are recycled or unloaded to maintain 60 FPS.
 * - Supports distinct voxel materials and structures:
 *   - 'cyber': Glowing grid lines, neon cyan/magenta data spires and floating circuit blocks.
 *   - 'fantasy': Ancient mossy bedrock, emerald solarpunk foliage, bioluminescent mushroom voxels.
 *   - 'mystery': Deep obsidian basalt cubes, glowing purple singularity rift crystals.
 */

const CHUNK_SIZE = 14; // units across X and Z
const VIEW_RADIUS = 3; // number of chunks in each direction (radius 3 = 7x7 grid = 49 chunks)
const BLOCK_SIZE = 2.0;

export class InfiniteVoxelTerrainManager {
  constructor(scene, worldTheme = 'cyber') {
    this.scene = scene;
    this.worldTheme = worldTheme;
    this.chunks = new Map(); // key: "cx,cz" -> Chunk Object
    this.risingBlocks = []; // blocks currently animating their rise

    // Shared Geometries & Materials
    this.blockGeo = new THREE.BoxGeometry(BLOCK_SIZE * 0.95, BLOCK_SIZE, BLOCK_SIZE * 0.95);
    this.pillarGeo = new THREE.BoxGeometry(BLOCK_SIZE * 0.8, BLOCK_SIZE * 3.5, BLOCK_SIZE * 0.8);
    this.crystalGeo = new THREE.OctahedronGeometry(BLOCK_SIZE * 0.75, 0);

    this.initMaterials();
  }

  initMaterials() {
    if (this.worldTheme === 'fantasy') {
      this.groundMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b, // emerald deep foliage
        roughness: 0.8,
        metalness: 0.1
      });
      this.accentMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, // bright green moss
        roughness: 0.6,
        metalness: 0.2
      });
      this.glowMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x059669,
        emissiveIntensity: 0.6
      });
    } else if (this.worldTheme === 'mystery') {
      this.groundMat = new THREE.MeshStandardMaterial({
        color: 0x2e1065, // obsidian purple
        roughness: 0.7,
        metalness: 0.3
      });
      this.accentMat = new THREE.MeshStandardMaterial({
        color: 0x7e22ce,
        roughness: 0.5,
        metalness: 0.4
      });
      this.glowMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 0.8
      });
    } else {
      // Default 'cyber'
      this.groundMat = new THREE.MeshStandardMaterial({
        color: 0x082f49, // deep dark cyan/slate
        roughness: 0.4,
        metalness: 0.6
      });
      this.accentMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // electric blue
        roughness: 0.3,
        metalness: 0.7
      });
      this.glowMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.85
      });
    }
  }

  /**
   * Updates chunks around the player's current (x, z) coordinates.
   * Call this every frame or on movement.
   */
  updatePlayerPosition(playerX, playerZ, delta = 0.016) {
    const currentChunkX = Math.floor(playerX / CHUNK_SIZE);
    const currentChunkZ = Math.floor(playerZ / CHUNK_SIZE);

    const activeKeys = new Set();

    // 1. Generate new chunks within view radius
    for (let dx = -VIEW_RADIUS; dx <= VIEW_RADIUS; dx++) {
      for (let dz = -VIEW_RADIUS; dz <= VIEW_RADIUS; dz++) {
        const cx = currentChunkX + dx;
        const cz = currentChunkZ + dz;
        const key = `${cx},${cz}`;
        activeKeys.add(key);

        if (!this.chunks.has(key)) {
          this.generateChunk(cx, cz);
        }
      }
    }

    // 2. Animate rising blocks that are erupting into existence
    for (let i = this.risingBlocks.length - 1; i >= 0; i--) {
      const item = this.risingBlocks[i];
      item.currentY = THREE.MathUtils.lerp(item.currentY, item.targetY, 0.12);
      item.mesh.position.y = item.currentY;

      if (Math.abs(item.currentY - item.targetY) < 0.02) {
        item.mesh.position.y = item.targetY;
        this.risingBlocks.splice(i, 1);
      }
    }

    // 3. Remove chunks that are far away from player to conserve memory
    for (const [key, chunk] of this.chunks.entries()) {
      if (!activeKeys.has(key)) {
        this.scene.remove(chunk.group);
        chunk.group.traverse((child) => {
          if (child.isMesh) {
            // Note: shared geometries & materials don't need disposal per mesh
          }
        });
        this.chunks.delete(key);
      }
    }
  }

  generateChunk(cx, cz) {
    const group = new THREE.Group();
    const startX = cx * CHUNK_SIZE;
    const startZ = cz * CHUNK_SIZE;

    // Pseudo-random deterministic noise for height & landmark placement
    const seed = Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453;
    const isLandmarkChunk = Math.abs(seed - Math.floor(seed)) > 0.72;

    const blocksPerSide = Math.floor(CHUNK_SIZE / BLOCK_SIZE);

    for (let x = 0; x < blocksPerSide; x++) {
      for (let z = 0; z < blocksPerSide; z++) {
        const worldX = startX + x * BLOCK_SIZE;
        const worldZ = startZ + z * BLOCK_SIZE;

        // Procedural height formula using sine waves
        const rawHeight =
          Math.sin(worldX * 0.08) * Math.cos(worldZ * 0.08) * 1.5 +
          Math.sin(worldX * 0.15 + worldZ * 0.12) * 0.8;
        const targetY = Math.round(rawHeight);

        // Select material
        let mat = this.groundMat;
        const isAccent = (x + z) % 4 === 0;
        if (isAccent) mat = this.accentMat;

        const block = new THREE.Mesh(this.blockGeo, mat);
        block.castShadow = true;
        block.receiveShadow = true;
        block.position.set(worldX, -4.0, worldZ); // start below ground
        group.add(block);

        // Register for rising animation
        this.risingBlocks.push({
          mesh: block,
          currentY: -4.0,
          targetY: targetY
        });
      }
    }

    // Landmark decorative features on special chunks (Pillars / Crystals)
    if (isLandmarkChunk) {
      const landmarkX = startX + CHUNK_SIZE / 2;
      const landmarkZ = startZ + CHUNK_SIZE / 2;

      const isCrystal = this.worldTheme === 'mystery' || Math.random() > 0.5;
      const landmarkMesh = new THREE.Mesh(
        isCrystal ? this.crystalGeo : this.pillarGeo,
        this.glowMat
      );
      landmarkMesh.position.set(landmarkX, -6.0, landmarkZ);
      landmarkMesh.castShadow = true;
      group.add(landmarkMesh);

      this.risingBlocks.push({
        mesh: landmarkMesh,
        currentY: -6.0,
        targetY: isCrystal ? 3.0 : 2.5
      });
    }

    this.scene.add(group);
    this.chunks.set(`${cx},${cz}`, { cx, cz, group });
  }

  dispose() {
    for (const chunk of this.chunks.values()) {
      this.scene.remove(chunk.group);
    }
    this.chunks.clear();
    this.risingBlocks = [];
    this.blockGeo.dispose();
    this.pillarGeo.dispose();
    this.crystalGeo.dispose();
    this.groundMat.dispose();
    this.accentMat.dispose();
    this.glowMat.dispose();
  }
}
