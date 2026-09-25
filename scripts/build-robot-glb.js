import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as fs from 'fs';
import * as path from 'path';

// Polyfill FileReader for Node.js
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = 'data:application/octet-stream;base64,' + Buffer.from(buf).toString('base64');
      if (this.onloadend) this.onloadend();
    });
  }
}
globalThis.FileReader = NodeFileReader;

console.log('🤖 Re-architecting 3D GLB Robot matching exact character reference...');

const scene = new THREE.Scene();
scene.name = 'MMK_Robot_Character';

// ----------------------------------------------------
// 1. Materials
// ----------------------------------------------------
const matWhiteArmor = new THREE.MeshStandardMaterial({
  name: 'Mat_WhiteArmor',
  color: new THREE.Color(0xf5f8fc),
  roughness: 0.18,
  metalness: 0.08
});

// Deep Glossy Obsidian Black Visor Screen
const matVisorScreen = new THREE.MeshStandardMaterial({
  name: 'Mat_VisorScreen',
  color: new THREE.Color(0x060912),
  roughness: 0.04,
  metalness: 0.88
});

// Vibrant High-Emission Cyan LED
const matCyanGlow = new THREE.MeshStandardMaterial({
  name: 'Mat_CyanGlow',
  color: new THREE.Color(0x00d8ff),
  emissive: new THREE.Color(0x00d8ff),
  emissiveIntensity: 1.35,
  roughness: 0.1,
  metalness: 0.1
});

// Dark Gunmetal / Titanium for Joint Mechanics
const matDarkJoints = new THREE.MeshStandardMaterial({
  name: 'Mat_DarkJoints',
  color: new THREE.Color(0x151922),
  roughness: 0.35,
  metalness: 0.75
});

// Metallic Cyan Trim Ring / Accent
const matCyanTrim = new THREE.MeshStandardMaterial({
  name: 'Mat_CyanTrim',
  color: new THREE.Color(0x19d3ff),
  roughness: 0.25,
  metalness: 0.6
});

// Pupil Core Dark Navy
const matPupilDark = new THREE.MeshStandardMaterial({
  name: 'Mat_PupilDark',
  color: new THREE.Color(0x04101e),
  roughness: 0.2,
  metalness: 0.5
});

const matMouthDark = new THREE.MeshStandardMaterial({
  name: 'Mat_MouthDark',
  color: new THREE.Color(0x1a0f16),
  roughness: 0.5,
  metalness: 0.1
});

const matTonguePink = new THREE.MeshStandardMaterial({
  name: 'Mat_TonguePink',
  color: new THREE.Color(0xff4b72),
  roughness: 0.28,
  metalness: 0.05
});

// ----------------------------------------------------
// 2. Skeletal Hierarchy
// ----------------------------------------------------
const rootBone = new THREE.Group();
rootBone.name = 'Root';
scene.add(rootBone);

// Hips
const hipsBone = new THREE.Group();
hipsBone.name = 'Hips';
hipsBone.position.set(0, 0.90, 0);
rootBone.add(hipsBone);

// Pelvis Mesh (Sleek white chassis)
const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.18, 28);
pelvisGeo.scale(1.05, 1.0, 0.88);
const pelvisMesh = new THREE.Mesh(pelvisGeo, matWhiteArmor);
pelvisMesh.name = 'Mesh_Pelvis';
hipsBone.add(pelvisMesh);

// Dark hip joint socket collars
const lHipSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 20), matDarkJoints);
lHipSocket.rotation.z = Math.PI / 2;
lHipSocket.position.set(-0.16, -0.06, 0);
hipsBone.add(lHipSocket);

const rHipSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 20), matDarkJoints);
rHipSocket.rotation.z = Math.PI / 2;
rHipSocket.position.set(0.16, -0.06, 0);
hipsBone.add(rHipSocket);

// Spine / Ribbed Waist (Stomach)
const spineBone = new THREE.Group();
spineBone.name = 'Spine';
spineBone.position.set(0, 0.14, 0);
hipsBone.add(spineBone);

// 3 Dark Ribbed Accordion Rings
for (let i = 0; i < 3; i++) {
  const ribGeo = new THREE.TorusGeometry(0.20 - (i === 1 ? 0.012 : 0), 0.024, 12, 32);
  ribGeo.rotateX(Math.PI / 2);
  const rib = new THREE.Mesh(ribGeo, matDarkJoints);
  rib.position.set(0, i * 0.055, 0);
  spineBone.add(rib);
}

// Glowing cyan waist accent ring
const waistCyanRing = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.007, 8, 32), matCyanGlow);
waistCyanRing.rotation.x = Math.PI / 2;
waistCyanRing.position.set(0, 0.055, 0);
spineBone.add(waistCyanRing);

// Chest
const chestBone = new THREE.Group();
chestBone.name = 'Chest';
chestBone.position.set(0, 0.20, 0);
spineBone.add(chestBone);

// Sculpted Breastplate (Curved white armor, slightly tapered)
const chestGeo = new THREE.CylinderGeometry(0.26, 0.21, 0.28, 32);
chestGeo.scale(1.18, 1.0, 0.92);
const chestMesh = new THREE.Mesh(chestGeo, matWhiteArmor);
chestMesh.name = 'Mesh_Chest';
chestBone.add(chestMesh);

// Center Chest Arc Reactor Assembly (centered directly on pecs)
// 1. Recessed dark metallic socket
const reactorSocketGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.03, 32);
reactorSocketGeo.rotateX(Math.PI / 2);
const reactorSocket = new THREE.Mesh(reactorSocketGeo, matDarkJoints);
reactorSocket.position.set(0, 0.00, 0.245);
chestBone.add(reactorSocket);

// 2. Cyan metallic bezel ring
const reactorBezelGeo = new THREE.TorusGeometry(0.082, 0.012, 16, 32);
const reactorBezel = new THREE.Mesh(reactorBezelGeo, matCyanTrim);
reactorBezel.position.set(0, 0.00, 0.252);
chestBone.add(reactorBezel);

// 3. Glowing Cyan Core
const reactorCoreGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 32);
reactorCoreGeo.rotateX(Math.PI / 2);
const reactorCore = new THREE.Mesh(reactorCoreGeo, matCyanGlow);
reactorCore.name = 'Mesh_ChestReactor';
reactorCore.position.set(0, 0.00, 0.258);
chestBone.add(reactorCore);

// Neck Collar
const neckBone = new THREE.Group();
neckBone.name = 'Neck';
neckBone.position.set(0, 0.20, 0);
chestBone.add(neckBone);

const neckGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.12, 24);
const neckMesh = new THREE.Mesh(neckGeo, matDarkJoints);
neckMesh.position.set(0, 0.05, 0);
neckBone.add(neckMesh);

// Cyan ring on neck collar
const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.126, 0.006, 8, 24), matCyanTrim);
neckRing.rotation.x = Math.PI / 2;
neckRing.position.set(0, 0.05, 0);
neckBone.add(neckRing);

// ----------------------------------------------------
// 3. Head & Deep Obsidian Screen Visor Face
// ----------------------------------------------------
const headBone = new THREE.Group();
headBone.name = 'Head';
headBone.position.set(0, 0.15, 0);
neckBone.add(headBone);

// Main White Helmet Shell
const helmetCenterY = 0.16;
const helmetGeo = new THREE.SphereGeometry(0.42, 36, 28);
helmetGeo.scale(1.15, 0.98, 1.02);
const helmetMesh = new THREE.Mesh(helmetGeo, matWhiteArmor);
helmetMesh.name = 'Mesh_Helmet';
helmetMesh.position.set(0, helmetCenterY, 0);
headBone.add(helmetMesh);

// Forehead Top Cyan Sensor Button
const topSensor = new THREE.Mesh(new THREE.CircleGeometry(0.045, 24), matCyanGlow);
topSensor.position.set(0, helmetCenterY + 0.36, 0.24);
topSensor.rotation.x = -0.62;
headBone.add(topSensor);

const topSensorRim = new THREE.Mesh(new THREE.RingGeometry(0.044, 0.054, 24), matCyanTrim);
topSensorRim.position.set(0, helmetCenterY + 0.36, 0.241);
topSensorRim.rotation.x = -0.62;
headBone.add(topSensorRim);

// Visor Screen: Centered at Math.PI * 0.5 (+Z front)
// Spans upper-mid face, leaving white forehead and generous white cheeks & chin!
const visorGeo = new THREE.SphereGeometry(0.426, 36, 28, Math.PI * 0.22, Math.PI * 0.56, Math.PI * 0.31, Math.PI * 0.24);
visorGeo.scale(1.16, 1.00, 1.05);
const visorMesh = new THREE.Mesh(visorGeo, matVisorScreen);
visorMesh.name = 'Mesh_VisorScreen';
visorMesh.position.set(0, helmetCenterY, 0.008);
headBone.add(visorMesh);

// --- Glowing Cyan Ring Eyes ---
function createEyeAssembly(side) {
  const eyeGroup = new THREE.Group();
  eyeGroup.name = side < 0 ? 'LeftEye' : 'RightEye';
  // Positioned neatly inside the dark visor screen
  eyeGroup.position.set(side * 0.165, helmetCenterY + 0.075, 0.442);

  // 1. Outer Glowing Cyan Ring (neon ring)
  const outerRingGeo = new THREE.TorusGeometry(0.065, 0.015, 16, 32);
  const outerRing = new THREE.Mesh(outerRingGeo, matCyanGlow);
  eyeGroup.add(outerRing);

  // 2. Soft cyan back glow
  const glowDiscGeo = new THREE.CircleGeometry(0.058, 28);
  const glowDisc = new THREE.Mesh(glowDiscGeo, matCyanGlow);
  glowDisc.position.set(0, 0, 0.001);
  eyeGroup.add(glowDisc);

  // 3. Inner Deep Obsidian Pupil
  const pupilGeo = new THREE.CircleGeometry(0.046, 24);
  const pupilMesh = new THREE.Mesh(pupilGeo, matPupilDark);
  pupilMesh.position.set(0, 0, 0.003);
  eyeGroup.add(pupilMesh);

  return eyeGroup;
}

headBone.add(createEyeAssembly(-1));
headBone.add(createEyeAssembly(1));

// Cute Dark Button Nose on the bottom border of the visor
const noseGeo = new THREE.SphereGeometry(0.020, 16, 14);
noseGeo.scale(1.3, 0.8, 0.5);
const noseMesh = new THREE.Mesh(noseGeo, matDarkJoints);
noseMesh.position.set(0, helmetCenterY - 0.025, 0.448);
headBone.add(noseMesh);

// Cute Friendly Smiling Open Mouth on the WHITE HELMET CHIN
const smileGroup = new THREE.Group();
smileGroup.name = 'Smile';
smileGroup.position.set(0, helmetCenterY - 0.125, 0.432);
headBone.add(smileGroup);

// Open mouth crescent (dark interior)
const mouthShape = new THREE.Shape();
mouthShape.moveTo(-0.062, 0.012);
mouthShape.quadraticCurveTo(0, 0.022, 0.062, 0.012);
mouthShape.quadraticCurveTo(0, -0.055, -0.062, 0.012);
const mouthCavity = new THREE.Mesh(
  new THREE.ShapeGeometry(mouthShape),
  matMouthDark
);
smileGroup.add(mouthCavity);

// Cute pink tongue
const tongueShape = new THREE.Shape();
tongueShape.moveTo(-0.034, -0.022);
tongueShape.quadraticCurveTo(0, -0.005, 0.034, -0.022);
tongueShape.quadraticCurveTo(0, -0.052, -0.034, -0.022);
const tongue = new THREE.Mesh(
  new THREE.ShapeGeometry(tongueShape),
  matTonguePink
);
tongue.position.z = 0.002;
smileGroup.add(tongue);

// Cute Cheek Accent Vents
const cheekVentL = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.008, 0.01), matDarkJoints);
cheekVentL.position.set(-0.165, helmetCenterY - 0.105, 0.42);
cheekVentL.rotation.z = -0.12;
headBone.add(cheekVentL);

const cheekVentR = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.008, 0.01), matDarkJoints);
cheekVentR.position.set(0.165, helmetCenterY - 0.105, 0.42);
cheekVentR.rotation.z = 0.12;
headBone.add(cheekVentR);

// Cute Headphone Ear Cups & Antennas (Left & Right)
function createHeadphone(side) {
  const hp = new THREE.Group();
  hp.name = side < 0 ? 'LeftHeadphone' : 'RightHeadphone';
  hp.position.set(side * 0.49, helmetCenterY + 0.04, 0);

  // Outer White Dome Shell
  const domeGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.08, 28);
  domeGeo.rotateZ(Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, matWhiteArmor);
  hp.add(dome);

  // Cyan Trim Ring on Headphone
  const hpRing = new THREE.Mesh(new THREE.TorusGeometry(0.122, 0.012, 12, 28), matCyanTrim);
  hpRing.rotation.y = Math.PI / 2;
  hp.add(hpRing);

  // Inner Dark Cushion
  const cushionGeo = new THREE.CylinderGeometry(0.105, 0.105, 0.04, 24);
  cushionGeo.rotateZ(Math.PI / 2);
  const cushion = new THREE.Mesh(cushionGeo, matDarkJoints);
  cushion.position.set(side * -0.04, 0, 0);
  hp.add(cushion);

  // Antenna Base Socket
  const antBase = new THREE.Mesh(new THREE.SphereGeometry(0.024, 14, 14), matDarkJoints);
  antBase.position.set(0, 0.11, 0);
  hp.add(antBase);

  // Curved / Angled Antenna Stem
  const stemGeo = new THREE.CylinderGeometry(0.011, 0.010, 0.28, 14);
  stemGeo.translate(0, 0.14, 0);
  stemGeo.rotateZ(side * -0.22);
  stemGeo.rotateX(-0.06);
  const stem = new THREE.Mesh(stemGeo, matDarkJoints);
  stem.position.set(0, 0.11, 0);
  hp.add(stem);

  // Glowing Cyan Sphere Ball Tip with collar
  const tipCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.016, 14), matDarkJoints);
  tipCollar.position.set(side * 0.062, 0.38, 0.015);
  hp.add(tipCollar);

  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.034, 18, 18), matCyanGlow);
  tip.position.set(side * 0.062, 0.395, 0.015);
  hp.add(tip);

  return hp;
}

headBone.add(createHeadphone(-1));
headBone.add(createHeadphone(1));

// ----------------------------------------------------
// 4. Natural Relaxed Articulated Arms
// ----------------------------------------------------
// Left Arm (Wave Rig)
const leftShoulderBone = new THREE.Group();
leftShoulderBone.name = 'LeftShoulder';
leftShoulderBone.position.set(-0.35, 0.06, 0);
chestBone.add(leftShoulderBone);

const lShoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.08, 18, 18), matDarkJoints);
leftShoulderBone.add(lShoulderBall);

const lShoulderArmor = new THREE.Mesh(new THREE.SphereGeometry(0.098, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), matWhiteArmor);
lShoulderArmor.rotation.z = Math.PI * 0.25;
leftShoulderBone.add(lShoulderArmor);

const leftArmBone = new THREE.Group();
leftArmBone.name = 'LeftArm';
leftArmBone.position.set(-0.04, -0.06, 0);
// Natural relaxed angle (hanging comfortably at side)
leftArmBone.rotation.z = -0.42;
leftArmBone.rotation.x = -0.10;
leftShoulderBone.add(leftArmBone);

const lBicepMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.060, 0.17, 20), matWhiteArmor);
lBicepMesh.position.set(0, -0.085, 0);
leftArmBone.add(lBicepMesh);

const lBicepTrim = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.008, 10, 24), matCyanTrim);
lBicepTrim.rotation.x = Math.PI / 2;
lBicepTrim.position.set(0, -0.155, 0);
leftArmBone.add(lBicepTrim);

const lElbow = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), matDarkJoints);
lElbow.position.set(0, -0.185, 0);
leftArmBone.add(lElbow);

const leftForearmBone = new THREE.Group();
leftForearmBone.name = 'LeftForearm';
leftForearmBone.position.set(0, -0.185, 0);
leftForearmBone.rotation.z = 0.16;
leftForearmBone.rotation.x = 0.22;
leftArmBone.add(leftForearmBone);

const lForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.18, 20), matWhiteArmor);
lForearmMesh.position.set(0, -0.09, 0);
leftForearmBone.add(lForearmMesh);

// Cyan Forearm Stripe
const lForearmStripe = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.12, 0.075), matCyanGlow);
lForearmStripe.position.set(-0.042, -0.09, 0);
leftForearmBone.add(lForearmStripe);

// Left Hand
const leftHandBone = new THREE.Group();
leftHandBone.name = 'LeftHand';
leftHandBone.position.set(0, -0.19, 0);
leftForearmBone.add(leftHandBone);

const lPalm = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 14), matDarkJoints);
lPalm.scale.set(0.9, 1.2, 0.6);
lPalm.position.set(0, -0.04, 0);
leftHandBone.add(lPalm);

const lShield = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 12, 0, Math.PI, 0, Math.PI), matWhiteArmor);
lShield.scale.set(0.95, 1.1, 0.6);
lShield.rotation.y = Math.PI / 2;
lShield.position.set(0, -0.04, 0.01);
leftHandBone.add(lShield);

// Fingers
for (let i = -1.5; i <= 1.5; i += 1.0) {
  const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.010, 0.08, 10), matDarkJoints);
  finger.position.set(i * 0.022, -0.09, 0.01);
  finger.rotation.x = 0.25;
  leftHandBone.add(finger);

  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), matCyanGlow);
  dot.position.set(i * 0.022, -0.13, 0.022);
  leftHandBone.add(dot);
}

// Right Arm (Symmetrical natural hang)
const rightShoulderBone = new THREE.Group();
rightShoulderBone.name = 'RightShoulder';
rightShoulderBone.position.set(0.35, 0.06, 0);
chestBone.add(rightShoulderBone);

const rShoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.08, 18, 18), matDarkJoints);
rightShoulderBone.add(rShoulderBall);

const rShoulderArmor = new THREE.Mesh(new THREE.SphereGeometry(0.098, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), matWhiteArmor);
rShoulderArmor.rotation.z = -Math.PI * 0.25;
rightShoulderBone.add(rShoulderArmor);

const rightArmBone = new THREE.Group();
rightArmBone.name = 'RightArm';
rightArmBone.position.set(0.04, -0.06, 0);
rightArmBone.rotation.z = 0.42;
rightArmBone.rotation.x = -0.10;
rightShoulderBone.add(rightArmBone);

const rBicepMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.060, 0.17, 20), matWhiteArmor);
rBicepMesh.position.set(0, -0.085, 0);
rightArmBone.add(rBicepMesh);

const rBicepTrim = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.008, 10, 24), matCyanTrim);
rBicepTrim.rotation.x = Math.PI / 2;
rBicepTrim.position.set(0, -0.155, 0);
rightArmBone.add(rBicepTrim);

const rElbow = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), matDarkJoints);
rElbow.position.set(0, -0.185, 0);
rightArmBone.add(rElbow);

const rightForearmBone = new THREE.Group();
rightForearmBone.name = 'RightForearm';
rightForearmBone.position.set(0, -0.185, 0);
rightForearmBone.rotation.z = -0.16;
rightForearmBone.rotation.x = 0.22;
rightArmBone.add(rightForearmBone);

const rForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.18, 20), matWhiteArmor);
rForearmMesh.position.set(0, -0.09, 0);
rightForearmBone.add(rForearmMesh);

const rForearmStripe = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.12, 0.075), matCyanGlow);
rForearmStripe.position.set(0.042, -0.09, 0);
rightForearmBone.add(rForearmStripe);

const rightHandBone = new THREE.Group();
rightHandBone.name = 'RightHand';
rightHandBone.position.set(0, -0.19, 0);
rightForearmBone.add(rightHandBone);

const rPalm = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 14), matDarkJoints);
rPalm.scale.set(0.9, 1.2, 0.6);
rPalm.position.set(0, -0.04, 0);
rightHandBone.add(rPalm);

const rShield = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 12, 0, Math.PI, 0, Math.PI), matWhiteArmor);
rShield.scale.set(0.95, 1.1, 0.6);
rShield.rotation.y = -Math.PI / 2;
rShield.position.set(0, -0.04, 0.01);
rightHandBone.add(rShield);

for (let i = -1.5; i <= 1.5; i += 1.0) {
  const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.010, 0.08, 10), matDarkJoints);
  finger.position.set(i * 0.022, -0.09, 0.01);
  finger.rotation.x = 0.25;
  rightHandBone.add(finger);

  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), matCyanGlow);
  dot.position.set(i * 0.022, -0.13, 0.022);
  rightHandBone.add(dot);
}

// ----------------------------------------------------
// 5. Ergonomic Legs & Stylish Astronaut Sneaker Boots
// ----------------------------------------------------
function createLeg(side) {
  const hipJoint = new THREE.Group();
  hipJoint.name = side < 0 ? 'LeftLeg' : 'RightLeg';
  hipJoint.position.set(side * 0.16, -0.08, 0);
  hipsBone.add(hipJoint);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 18), matDarkJoints);
  hipJoint.add(ball);

  // Thigh
  const thighBone = new THREE.Group();
  thighBone.name = side < 0 ? 'LeftThigh' : 'RightThigh';
  thighBone.position.set(0, -0.04, 0);
  hipJoint.add(thighBone);

  const thighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.072, 0.24, 24), matWhiteArmor);
  thighMesh.position.set(0, -0.12, 0);
  thighBone.add(thighMesh);

  const thighTrim = new THREE.Mesh(new THREE.TorusGeometry(0.084, 0.008, 10, 24), matCyanTrim);
  thighTrim.rotation.x = Math.PI / 2;
  thighTrim.position.set(0, -0.22, 0);
  thighBone.add(thighTrim);

  // Knee Joint
  const kneeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.08, 20), matDarkJoints);
  kneeMesh.rotation.z = Math.PI / 2;
  kneeMesh.position.set(0, -0.25, 0);
  thighBone.add(kneeMesh);

  // Shin
  const shinBone = new THREE.Group();
  shinBone.name = side < 0 ? 'LeftShin' : 'RightShin';
  shinBone.position.set(0, -0.25, 0);
  thighBone.add(shinBone);

  const shinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.090, 0.25, 24), matWhiteArmor);
  shinMesh.position.set(0, -0.125, 0);
  shinBone.add(shinMesh);

  const shinStripe = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.16, 0.086), matCyanGlow);
  shinStripe.position.set(0, -0.125, 0.046);
  shinBone.add(shinStripe);

  // Foot / Boot
  const footBone = new THREE.Group();
  footBone.name = side < 0 ? 'LeftFoot' : 'RightFoot';
  footBone.position.set(0, -0.26, 0.03);
  shinBone.add(footBone);

  // Rounded Boot Upper
  const bootGeo = new THREE.SphereGeometry(0.125, 24, 20);
  bootGeo.scale(1.0, 0.85, 1.6);
  bootGeo.translate(0, -0.02, 0.05);
  const bootMesh = new THREE.Mesh(bootGeo, matWhiteArmor);
  footBone.add(bootMesh);

  // Dark Sole
  const soleGeo = new THREE.CylinderGeometry(0.13, 0.135, 0.035, 28);
  soleGeo.scale(1.0, 1.0, 1.65);
  soleGeo.translate(0, -0.085, 0.05);
  const soleMesh = new THREE.Mesh(soleGeo, matDarkJoints);
  footBone.add(soleMesh);

  // Stance angle
  hipJoint.rotation.z = side * -0.05;
  thighBone.rotation.z = side * 0.03;
  footBone.rotation.z = side * 0.02;

  // Dark Toe Bumper Cap
  const toeCapGeo = new THREE.SphereGeometry(0.08, 16, 14);
  toeCapGeo.scale(1.15, 0.75, 0.9);
  const toeCap = new THREE.Mesh(toeCapGeo, matDarkJoints);
  toeCap.position.set(0, -0.045, 0.165);
  footBone.add(toeCap);

  return hipJoint;
}

createLeg(-1);
createLeg(1);

// ----------------------------------------------------
// 6. Animation Clips (Idle, Wave, Blink, Dance)
// ----------------------------------------------------
const idleTimes = [0, 1.5, 3.0];
const idleTracks = [
  new THREE.VectorKeyframeTrack('Hips.position', idleTimes, [
    0, 0.90, 0,
    0, 0.935, 0,
    0, 0.90, 0
  ]),
  new THREE.QuaternionKeyframeTrack('Head.quaternion', idleTimes, [
    0, 0, 0, 1,
    0.02, 0.025, 0, 0.999,
    0, 0, 0, 1
  ]),
  new THREE.QuaternionKeyframeTrack('LeftArm.quaternion', idleTimes, [
    -0.05, -0.01, -0.21, 0.98,
    -0.04, -0.01, -0.23, 0.97,
    -0.05, -0.01, -0.21, 0.98
  ]),
  new THREE.QuaternionKeyframeTrack('RightArm.quaternion', idleTimes, [
    -0.05, 0.01, 0.21, 0.98,
    -0.04, 0.01, 0.23, 0.97,
    -0.05, 0.01, 0.21, 0.98
  ])
];
const clipIdle = new THREE.AnimationClip('Idle', 3.0, idleTracks);

const waveTimes = [0, 0.25, 0.55, 0.85, 1.15, 1.45, 1.65, 1.85];
const waveTracks = [
  new THREE.QuaternionKeyframeTrack('LeftArm.quaternion', waveTimes, [
    -0.0489, -0.0104, -0.2082, 0.9768,
    0.0316, 0.3029, -0.7649, 0.5676,
    0.0316, 0.3029, -0.7649, 0.5676,
    0.0316, 0.3029, -0.7649, 0.5676,
    0.0316, 0.3029, -0.7649, 0.5676,
    0.0316, 0.3029, -0.7649, 0.5676,
    0.0516, 0.1132, -0.4691, 0.8743,
    -0.0489, -0.0104, -0.2082, 0.9768
  ]),
  new THREE.QuaternionKeyframeTrack('LeftForearm.quaternion', waveTimes, [
    0.1094, -0.0088, 0.0794, 0.9908,
    0.1013, 0.1497, -0.6269, 0.7578,
    0.1410, 0.1130, -0.3750, 0.9092,
    0.1013, 0.1497, -0.6269, 0.7578,
    0.1410, 0.1130, -0.3750, 0.9092,
    0.1013, 0.1497, -0.6269, 0.7578,
    0.1172, 0.0491, -0.1940, 0.9727,
    0.1094, -0.0088, 0.0794, 0.9908
  ]),
  new THREE.QuaternionKeyframeTrack('LeftHand.quaternion', waveTimes, [
    0.0748, 0.0037, -0.0498, 0.9959,
    0.0497, -0.0050, 0.0997, 0.9938,
    0.0496, 0.0062, -0.1245, 0.9910,
    0.0496, -0.0062, 0.1245, 0.9910,
    0.0496, 0.0062, -0.1245, 0.9910,
    0.0496, -0.0062, 0.1245, 0.9910,
    0.0599, -0.0015, 0.0250, 0.9979,
    0.0748, 0.0037, -0.0498, 0.9959
  ]),
  new THREE.QuaternionKeyframeTrack('RightArm.quaternion', waveTimes, [
    -0.0489, 0.0104, 0.2082, 0.9768,
    -0.0489, 0.0104, 0.2082, 0.9768,
    -0.0489, 0.0104, 0.2082, 0.9768,
    -0.0489, 0.0104, 0.2082, 0.9768,
    -0.0489, 0.0104, 0.2082, 0.9768,
    -0.0489, 0.0104, 0.2082, 0.9768,
    -0.0489, 0.0104, 0.2082, 0.9768,
    -0.0489, 0.0104, 0.2082, 0.9768
  ]),
  new THREE.QuaternionKeyframeTrack('Head.quaternion', waveTimes, [
    0, 0, 0, 1,
    -0.02, 0.08, -0.06, 0.995,
    -0.02, -0.06, 0.04, 0.997,
    -0.02, 0.08, -0.06, 0.995,
    -0.02, -0.06, 0.04, 0.997,
    -0.02, 0.08, -0.06, 0.995,
    0, 0.02, 0, 0.999,
    0, 0, 0, 1
  ])
];
const clipWave = new THREE.AnimationClip('Wave', 1.85, waveTracks);

const blinkTimes = [0, 0.1, 0.2, 0.35, 0.45, 0.7, 0.9, 1.2, 1.4];
const blinkTracks = [
  new THREE.VectorKeyframeTrack('LeftEye.scale', blinkTimes, [
    1, 1, 1,
    1, 0.08, 1,
    1, 1, 1,
    1, 0.08, 1,
    1, 1, 1,
    1, 0.08, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1
  ]),
  new THREE.VectorKeyframeTrack('RightEye.scale', blinkTimes, [
    1, 1, 1,
    1, 0.08, 1,
    1, 1, 1,
    1, 0.08, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1
  ]),
  new THREE.QuaternionKeyframeTrack('Head.quaternion', blinkTimes, [
    0, 0, 0, 1,
    0.06, 0, 0, 0.998,
    0, 0, 0, 1,
    0.06, 0, 0, 0.998,
    0, 0, 0, 1,
    -0.03, 0.05, 0.04, 0.997,
    0, 0.02, 0, 0.999,
    0, 0, 0, 1,
    0, 0, 0, 1
  ])
];
const clipBlink = new THREE.AnimationClip('Blink', 1.4, blinkTracks);

const danceTimes = [0, 0.35, 0.7, 1.05, 1.4, 1.75, 2.1, 2.45, 2.8, 3.15, 3.5, 4.0];
const danceTracks = [
  new THREE.VectorKeyframeTrack('Hips.position', danceTimes, [
    0, 0.90, 0,
    0, 0.78, 0,
    0, 0.98, 0,
    0, 0.78, 0,
    0, 0.98, 0,
    0, 1.15, 0,
    0, 1.25, 0,
    0, 0.90, 0,
    0, 0.96, 0,
    0, 0.85, 0,
    0, 0.92, 0,
    0, 0.90, 0
  ]),
  new THREE.QuaternionKeyframeTrack('Hips.quaternion', danceTimes, [
    0, 0, 0, 1,
    0, 0, -0.16, 0.98,
    0, 0, 0.16, 0.98,
    0, 0, -0.16, 0.98,
    0, 0, 0.16, 0.98,
    0, 0.707, 0, 0.707,
    0, 1.0, 0, 0,
    0, 0, 0, 1,
    0, 0, -0.12, 0.99,
    0, 0, 0.12, 0.99,
    0, 0, 0, 1,
    0, 0, 0, 1
  ]),
  new THREE.QuaternionKeyframeTrack('LeftArm.quaternion', danceTimes, [
    -0.0489, -0.0104, -0.2082, 0.9768,
    0.1613, 0.2723, -0.5443, 0.7769,
    0.0967, 0.0247, -0.2462, 0.9641,
    0.1613, 0.2723, -0.5443, 0.7769,
    0.0967, 0.0247, -0.2462, 0.9641,
    0.1008, 0.3528, -0.6957, 0.6175,
    0.1008, 0.3528, -0.6957, 0.6175,
    0.1464, 0.1523, -0.4117, 0.8865,
    0.1613, 0.2723, -0.5443, 0.7769,
    0.0967, 0.0247, -0.2462, 0.9641,
    0.1539, 0.1448, -0.3669, 0.9060,
    -0.0489, -0.0104, -0.2082, 0.9768
  ]),
  new THREE.QuaternionKeyframeTrack('RightArm.quaternion', danceTimes, [
    -0.0489, 0.0104, 0.2082, 0.9768,
    0.0967, -0.0247, 0.2462, 0.9641,
    0.1613, -0.2723, 0.5443, 0.7769,
    0.0967, -0.0247, 0.2462, 0.9641,
    0.1613, -0.2723, 0.5443, 0.7769,
    0.1008, -0.3528, 0.6957, 0.6175,
    0.1008, -0.3528, 0.6957, 0.6175,
    0.1464, -0.1523, 0.4117, 0.8865,
    0.0967, -0.0247, 0.2462, 0.9641,
    0.1613, -0.2723, 0.5443, 0.7769,
    0.1539, -0.1448, 0.3669, 0.9060,
    -0.0489, 0.0104, 0.2082, 0.9768
  ]),
  new THREE.QuaternionKeyframeTrack('Head.quaternion', danceTimes, [
    0, 0, 0, 1,
    0.05, 0.1, 0.08, 0.99,
    0.05, -0.1, -0.08, 0.99,
    0.05, 0.1, 0.08, 0.99,
    0.05, -0.1, -0.08, 0.99,
    0.1, 0, 0, 0.995,
    0.1, 0, 0, 0.995,
    0, 0, 0, 1,
    0.05, 0.08, 0.05, 0.99,
    0.05, -0.08, -0.05, 0.99,
    0, 0, 0, 1,
    0, 0, 0, 1
  ])
];
const clipDance = new THREE.AnimationClip('Dance', 4.0, danceTracks);

// ----------------------------------------------------
// 7. Binary GLB Export
// ----------------------------------------------------
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (gltfBuffer) => {
    const outDirModels = path.resolve('src/assets/models');
    if (!fs.existsSync(outDirModels)) {
      fs.mkdirSync(outDirModels, { recursive: true });
    }
    const targetFile = path.join(outDirModels, 'robot.glb');
    const targetFileRoot = path.resolve('src/assets/robot.glb');

    fs.writeFileSync(targetFile, Buffer.from(gltfBuffer));
    fs.writeFileSync(targetFileRoot, Buffer.from(gltfBuffer));

    console.log(`✅ Success! Redesigned 3D GLB Robot generated!`);
    console.log(`📁 File: ${targetFile} (${(gltfBuffer.byteLength / 1024).toFixed(1)} KB)`);
    process.exit(0);
  },
  (error) => {
    console.error('❌ Error exporting GLTF:', error);
    process.exit(1);
  },
  {
    binary: true,
    animations: [clipIdle, clipWave, clipBlink, clipDance]
  }
);
