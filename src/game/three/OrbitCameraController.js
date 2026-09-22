import * as THREE from 'three';

/**
 * OrbitCameraController
 * 
 * Provides smooth mouse and touch orbit controls with spherical coordinates:
 * - Left-click drag or touch drag to orbit around target in 360 degrees.
 * - Mouse wheel or pinch to zoom in/out.
 * - Damped interpolation (lerp) for fluid cinematic feel.
 * - Dynamic target follow with vertical offset.
 * - Min/Max clamping for polar angle (elevation) and distance.
 */
export class OrbitCameraController {
  constructor(camera, domElement, options = {}) {
    this.camera = camera;
    this.domElement = domElement;

    // Target point in world space
    this.target = options.target ? options.target.clone() : new THREE.Vector3(0, 1.2, 0);
    this.currentTarget = this.target.clone();

    // Spherical coordinates
    this.radius = options.radius !== undefined ? options.radius : 5.5;
    this.targetRadius = this.radius;
    this.minRadius = options.minRadius !== undefined ? options.minRadius : 2.0;
    this.maxRadius = options.maxRadius !== undefined ? options.maxRadius : 25.0;

    // Polar angle phi (0 is directly above, PI/2 is horizontal, PI is directly below)
    // 45 degrees below horizontal is ~ Math.PI * 0.65 to 0.75
    this.phi = options.phi !== undefined ? options.phi : Math.PI * 0.4;
    this.targetPhi = this.phi;
    this.minPhi = options.minPhi !== undefined ? options.minPhi : 0.05;
    this.maxPhi = options.maxPhi !== undefined ? options.maxPhi : Math.PI * 0.95;

    // Azimuth angle theta (horizontal rotation around Y axis)
    this.theta = options.theta !== undefined ? options.theta : 0;
    this.targetTheta = this.theta;

    // Sensitivities & Damping
    this.rotateSpeed = options.rotateSpeed || 0.005;
    this.zoomSpeed = options.zoomSpeed || 0.003;
    this.damping = options.damping !== undefined ? options.damping : 0.1;

    // State
    this.isDragging = false;
    this.previousPointerPosition = { x: 0, y: 0 };
    this.hasMovedSignificantly = false;
    this.totalDragDistance = 0;

    this.initEventListeners();
  }

  initEventListeners() {
    this.onPointerDown = (e) => {
      this.isDragging = true;
      this.hasMovedSignificantly = false;
      this.totalDragDistance = 0;
      this.previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    this.onPointerMove = (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousPointerPosition.x;
      const deltaY = e.clientY - this.previousPointerPosition.y;

      this.totalDragDistance += Math.hypot(deltaX, deltaY);
      if (this.totalDragDistance > 5) {
        this.hasMovedSignificantly = true;
      }

      this.targetTheta -= deltaX * this.rotateSpeed;
      this.targetPhi += deltaY * this.rotateSpeed;

      // Clamp polar angle
      this.targetPhi = Math.max(this.minPhi, Math.min(this.maxPhi, this.targetPhi));

      this.previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    this.onPointerUp = () => {
      this.isDragging = false;
    };

    this.onWheel = (e) => {
      e.preventDefault();
      this.targetRadius += e.deltaY * this.zoomSpeed;
      this.targetRadius = Math.max(this.minRadius, Math.min(this.maxRadius, this.targetRadius));
    };

    const el = this.domElement || window;
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
  }

  setSpherical(radius, phi, theta) {
    if (radius !== undefined) {
      this.radius = radius;
      this.targetRadius = radius;
    }
    if (phi !== undefined) {
      this.phi = phi;
      this.targetPhi = phi;
    }
    if (theta !== undefined) {
      this.theta = theta;
      this.targetTheta = theta;
    }
  }

  setTarget(x, y, z) {
    if (x instanceof THREE.Vector3) {
      this.target.copy(x);
    } else {
      this.target.set(x, y, z);
    }
  }

  update(delta = 0.016) {
    // Smoothly interpolate angles and radius
    this.theta = THREE.MathUtils.lerp(this.theta, this.targetTheta, this.damping);
    this.phi = THREE.MathUtils.lerp(this.phi, this.targetPhi, this.damping);
    this.radius = THREE.MathUtils.lerp(this.radius, this.targetRadius, this.damping);

    // Smoothly interpolate target position
    this.currentTarget.lerp(this.target, 0.12);

    // Calculate camera position in Cartesian coordinates from Spherical
    const sinPhiRadius = Math.sin(this.phi) * this.radius;
    const x = this.currentTarget.x + sinPhiRadius * Math.sin(this.theta);
    const y = this.currentTarget.y + Math.cos(this.phi) * this.radius;
    const z = this.currentTarget.z + sinPhiRadius * Math.cos(this.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.currentTarget);
  }

  dispose() {
    const el = this.domElement || window;
    el.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('wheel', this.onWheel);
  }
}
