import * as THREE from 'three';

/**
 * Creates an authentic 3D Roblox-style voxel character with separate limb pivot groups
 * Returns an object containing the root group, parts, and an update method for animations.
 */
export function createVoxelCharacterMesh() {
  const root = new THREE.Group();

  // Color palette for classic stylish voxel avatar
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xffd180,
    roughness: 0.7,
    metalness: 0.1
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // cyan/blue jacket
    roughness: 0.5,
    metalness: 0.2
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // dark slate trousers
    roughness: 0.8,
    metalness: 0.1
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x18181b, // jet black block hair
    roughness: 0.9,
    metalness: 0.05
  });
  const eyesMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff }); // glowing cyan cyber eyes
  const eyesClosedMat = new THREE.MeshStandardMaterial({ color: 0xc49b63 }); // closed eyelid strip

  // 1. Torso (Pivot at center)
  // Dimensions: 1.0 wide, 1.2 high, 0.5 deep
  const torsoGeo = new THREE.BoxGeometry(1.0, 1.2, 0.5);
  const torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
  torsoMesh.position.y = 1.6;
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  root.add(torsoMesh);

  // 2. Head & Hair (Pivot on top of torso at y = 2.2)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.2, 0);

  const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.position.y = 0.4;
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Block Hair cap
  const hairGeo = new THREE.BoxGeometry(0.86, 0.35, 0.86);
  const hairMesh = new THREE.Mesh(hairGeo, hairMat);
  hairMesh.position.y = 0.7;
  hairGroup.add(hairMesh);

  // Eyes (front face at z = 0.41)
  const eyeGeo = new THREE.BoxGeometry(0.16, 0.1, 0.02);
  const leftEyeOpen = new THREE.Mesh(eyeGeo, eyesMat);
  leftEyeOpen.position.set(-0.2, 0.42, 0.41);
  headGroup.add(leftEyeOpen);

  const rightEyeOpen = new THREE.Mesh(eyeGeo, eyesMat);
  rightEyeOpen.position.set(0.2, 0.42, 0.41);
  headGroup.add(rightEyeOpen);

  // Closed Eyelids (used when sleeping)
  const leftEyeClosed = new THREE.Mesh(eyeGeo, eyesClosedMat);
  leftEyeClosed.position.set(-0.2, 0.42, 0.41);
  leftEyeClosed.visible = false;
  headGroup.add(leftEyeClosed);

  const rightEyeClosed = new THREE.Mesh(eyeGeo, eyesClosedMat);
  rightEyeClosed.position.set(0.2, 0.42, 0.41);
  rightEyeClosed.visible = false;
  headGroup.add(rightEyeClosed);

  root.add(headGroup);

  // 3. Left Arm (Pivot at shoulder: x = -0.75, y = 2.1)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.75, 2.1, 0);

  const armGeo = new THREE.BoxGeometry(0.4, 1.1, 0.4);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
  leftArmMesh.position.y = -0.55;
  leftArmMesh.castShadow = true;
  leftArmGroup.add(leftArmMesh);

  // Sleeve on upper half of arm
  const sleeveGeo = new THREE.BoxGeometry(0.44, 0.6, 0.44);
  const leftSleeve = new THREE.Mesh(sleeveGeo, shirtMat);
  leftSleeve.position.y = -0.3;
  leftArmGroup.add(leftSleeve);

  root.add(leftArmGroup);

  // 4. Right Arm (Pivot at shoulder: x = 0.75, y = 2.1)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.75, 2.1, 0);

  const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
  rightArmMesh.position.y = -0.55;
  rightArmMesh.castShadow = true;
  rightArmGroup.add(rightArmMesh);

  const rightSleeve = new THREE.Mesh(sleeveGeo, shirtMat);
  rightSleeve.position.y = -0.3;
  rightArmGroup.add(rightSleeve);

  root.add(rightArmGroup);

  // 5. Left Leg (Pivot at hip: x = -0.26, y = 1.0)
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.26, 1.0, 0);

  const legGeo = new THREE.BoxGeometry(0.44, 1.0, 0.44);
  const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
  leftLegMesh.position.y = -0.5;
  leftLegMesh.castShadow = true;
  leftLegGroup.add(leftLegMesh);

  root.add(leftLegGroup);

  // 6. Right Leg (Pivot at hip: x = 0.26, y = 1.0)
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.26, 1.0, 0);

  const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
  rightLegMesh.position.y = -0.5;
  rightLegMesh.castShadow = true;
  rightLegGroup.add(rightLegMesh);

  root.add(rightLegGroup);

  // Character State & Animation Rigging Loop
  let walkCycle = 0;
  let rubCycle = 0;

  function update({
    isMoving = false,
    speed = 1.0,
    isSleeping = false,
    isNudgingEyes = false,
    delta = 0.016
  }) {
    // Eyelid display
    if (isSleeping) {
      leftEyeOpen.visible = false;
      rightEyeOpen.visible = false;
      leftEyeClosed.visible = true;
      rightEyeClosed.visible = true;
    } else {
      leftEyeOpen.visible = true;
      rightEyeOpen.visible = true;
      leftEyeClosed.visible = false;
      rightEyeClosed.visible = false;
    }

    if (isSleeping) {
      // 3D Horizontal floating posture with breathing
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, Math.PI * 0.44, 0.1);
      root.rotation.z = THREE.MathUtils.lerp(root.rotation.z, 0.1, 0.1);
      root.position.y = Math.sin(Date.now() * 0.002) * 0.15 + 1.2;

      // Limbs slightly relaxed
      leftArmGroup.rotation.set(0.2, 0, -0.3);
      rightArmGroup.rotation.set(0.2, 0, 0.3);
      leftLegGroup.rotation.set(-0.1, 0, 0);
      rightLegGroup.rotation.set(-0.1, 0, 0);
      return;
    }

    if (isNudgingEyes) {
      // Arms raised to head, scrubbing eyes clean
      rubCycle += delta * 12;
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, 0, 0.1);
      root.rotation.z = THREE.MathUtils.lerp(root.rotation.z, 0, 0.1);

      const rubL = Math.sin(rubCycle) * 0.25;
      const rubR = -Math.sin(rubCycle) * 0.25;

      leftArmGroup.rotation.set(-2.4 + rubL, 0.5, 0.7);
      rightArmGroup.rotation.set(-2.4 + rubR, -0.5, -0.7);
      headGroup.rotation.set(0.2, Math.sin(rubCycle * 0.5) * 0.15, 0);
      return;
    }

    // Standing / Walking upright
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, 0, 0.15);
    root.rotation.z = THREE.MathUtils.lerp(root.rotation.z, 0, 0.15);

    if (isMoving) {
      walkCycle += delta * 8 * speed;
      const legAngle = Math.sin(walkCycle) * 0.65;
      const armAngle = -Math.sin(walkCycle) * 0.65;

      leftLegGroup.rotation.x = legAngle;
      rightLegGroup.rotation.x = -legAngle;

      leftArmGroup.rotation.x = armAngle;
      rightArmGroup.rotation.x = -armAngle;
      leftArmGroup.rotation.z = -0.1;
      rightArmGroup.rotation.z = 0.1;

      // Slight head bob and torso sway
      headGroup.rotation.y = Math.sin(walkCycle * 0.5) * 0.05;
      torsoMesh.rotation.y = Math.sin(walkCycle * 0.5) * 0.04;
    } else {
      // Idle breathing
      walkCycle = 0;
      const idleBreath = Math.sin(Date.now() * 0.003) * 0.04;
      leftArmGroup.rotation.set(idleBreath, 0, -0.1);
      rightArmGroup.rotation.set(-idleBreath, 0, 0.1);
      leftLegGroup.rotation.set(0, 0, 0);
      rightLegGroup.rotation.set(0, 0, 0);
      headGroup.rotation.set(0, 0, 0);
      torsoMesh.rotation.set(0, 0, 0);
    }
  }

  return {
    root,
    update,
    headGroup,
    leftArmGroup,
    rightArmGroup
  };
}
