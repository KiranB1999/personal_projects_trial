import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Aircraft properties
const aircraft = {
    speed: 0,
    altitude: 0,
    heading: 0,
    pitch: 0,
    roll: 0,
    yaw: 0,
    maxSpeed: 500,
    minSpeed: 0,
    acceleration: 1,
    turnRate: 0.02,
    crashed: false
};

// Raycaster for collision detection
const raycaster = new THREE.Raycaster();
const collisionDistance = 2; // Minimum distance to detect collision

// Create aircraft model (temporary box geometry)
const geometry = new THREE.BoxGeometry(1, 0.3, 2);
const material = new THREE.MeshPhongMaterial({ color: 0x999999 });
const airplane = new THREE.Mesh(geometry, material);
scene.add(airplane);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create skybox
const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Create terrain
const terrainGeometry = new THREE.PlaneGeometry(20000, 20000, 150, 150);
const terrainMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x1a472a,
    wireframe: false,
    flatShading: true
});
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);

// Generate gentle terrain heights
const vertices = terrainGeometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
    if (i % 3 === 1) { // Only modify Y coordinates
        vertices[i] = Math.random() * 150 - 75; // Increased height variation
    }
}
terrainGeometry.attributes.position.needsUpdate = true;
terrainGeometry.computeVertexNormals();

terrain.rotation.x = -Math.PI / 2;
terrain.position.y = -1000;
scene.add(terrain);

// Add water
const waterGeometry = new THREE.PlaneGeometry(20000, 20000);
const waterMaterial = new THREE.MeshPhongMaterial({
    color: 0x0077be,
    transparent: true,
    opacity: 0.6,
    shininess: 100
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.y = -800;
scene.add(water);

// Add mountains
for (let i = 0; i < 80; i++) { // Increased number of mountains
    const height = Math.random() * 1500 + 800; // Taller mountains
    const radius = Math.random() * 400 + 150;
    const mountainGeometry = new THREE.ConeGeometry(radius, height, Math.floor(Math.random() * 3) + 4);
    const mountainMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(0x4a4a4a).multiplyScalar(0.8 + Math.random() * 0.4)
    });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    
    mountain.position.x = Math.random() * 32000 - 16000; // Wider distribution
    mountain.position.z = Math.random() * 32000 - 16000;
    mountain.position.y = -600;
    mountain.rotation.y = Math.random() * Math.PI;
    
    scene.add(mountain);
}

// Add fog with increased distance
scene.fog = new THREE.Fog(0x87CEEB, 2000, 16000);

// Set up camera position
camera.position.set(0, 5, 10);
camera.lookAt(airplane.position);

// Controls state
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false
};

// Event listeners for controls
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Update HUD elements
function updateHUD() {
    document.getElementById('speed').textContent = Math.round(aircraft.speed);
    document.getElementById('altitude').textContent = Math.round(aircraft.altitude);
    document.getElementById('heading').textContent = Math.round(aircraft.heading * (180/Math.PI));
}

// Handle aircraft controls
function checkCollisions() {
    if (aircraft.crashed) return;

    // Update raycaster position and direction
    raycaster.set(airplane.position, new THREE.Vector3(0, -1, 0));

    // Check collision with terrain and mountains
    const intersects = raycaster.intersectObjects([terrain, ...scene.children.filter(child => 
        child instanceof THREE.Mesh && child.geometry instanceof THREE.ConeGeometry
    )]);

    if (intersects.length > 0 && intersects[0].distance < collisionDistance) {
        aircraft.crashed = true;
        aircraft.speed = 0;
        console.log('Aircraft crashed!');
    }
}

function handleControls() {
    if (aircraft.crashed) return;
    // Speed control with W/S
    if (keys['w']) {
        aircraft.speed = Math.min(aircraft.speed + aircraft.acceleration, aircraft.maxSpeed);
    }
    if (keys['s']) {
        aircraft.speed = Math.max(aircraft.speed - aircraft.acceleration, aircraft.minSpeed);
    }

    // Altitude control with Up/Down arrows
    if (keys['ArrowUp']) {
        aircraft.altitude += 2;
    }
    if (keys['ArrowDown']) {
        aircraft.altitude = Math.max(aircraft.altitude - 2, 0);
    }

    // Direction control with Left/Right arrows
    if (keys['ArrowLeft']) {
        aircraft.yaw -= aircraft.turnRate;
    }
    if (keys['ArrowRight']) {
        aircraft.yaw += aircraft.turnRate;
    }

    // Roll control with A/D
    if (keys['a']) {
        aircraft.roll -= aircraft.turnRate;
    }
    if (keys['d']) {
        aircraft.roll += aircraft.turnRate;
    }

    // Update aircraft position and rotation
    airplane.rotation.z = aircraft.roll;
    airplane.position.y = aircraft.altitude;
    airplane.rotation.y = aircraft.yaw;

    // Update position based on speed and direction
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(airplane.quaternion);
    direction.multiplyScalar(aircraft.speed * 0.1);
    airplane.position.add(direction);

    // Update heading
    aircraft.heading = aircraft.yaw;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    handleControls();
    checkCollisions();
    updateHUD();

    // Update camera position to follow the aircraft with dynamic height based on pitch
    const baseCameraHeight = 5;
    const pitchInfluence = Math.sin(-aircraft.pitch) * 10; // Camera height changes with pitch
    const cameraOffset = new THREE.Vector3(0, baseCameraHeight + pitchInfluence, 15);
    cameraOffset.applyQuaternion(airplane.quaternion);
    camera.position.copy(airplane.position).add(cameraOffset);

    // Adjust camera look target based on pitch
    const lookTarget = airplane.position.clone();
    const lookAheadDistance = 10;
    const lookAheadOffset = new THREE.Vector3(0, pitchInfluence * 0.5, -lookAheadDistance);
    lookAheadOffset.applyQuaternion(airplane.quaternion);
    lookTarget.add(lookAheadOffset);
    camera.lookAt(lookTarget);

    renderer.render(scene, camera);
}

animate();