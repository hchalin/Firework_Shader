import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import fireworkVertexShader from "./shaders/firework/vertex.glsl";
import fireworkFragmentShader from "./shaders/firework/fragment.glsl";
import gsap from "gsap";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2), // handle pixel ratio for different devices
};

sizes.resolution = new THREE.Vector2(
  sizes.width * sizes.pixelRatio,
  sizes.height * sizes.pixelRatio
);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1.5, 0, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio();

//let material = null;

/**
 * Fireworks
 */
const textures = [
  textureLoader.load("./particles/1.png"),
  textureLoader.load("./particles/2.png"),
  textureLoader.load("./particles/3.png"),
  textureLoader.load("./particles/4.png"),
  textureLoader.load("./particles/5.png"),
  textureLoader.load("./particles/6.png"),
  textureLoader.load("./particles/7.png"),
  textureLoader.load("./particles/8.png"),
];

const createFirework = ({
  count,
  position,
  size,
  texture,
  sphereRadius,
  color,
}) => {
  //const texture = textures[7];

  // Geometry
  const positionsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const timesMultipliersArray = new Float32Array(count);

  for (let i = 0; i < count; ++i) {
    const i3 = i * 3;

    // create spherical -> generate coordinates in a sphere
    const spherical = new THREE.Spherical(
      sphereRadius * (0.75 + Math.random() * 0.25),
      Math.PI * Math.random(),
      Math.PI * 2 * Math.random()
    );

    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positionsArray[i3] = position.x;
    positionsArray[i3 + 1] = position.y;
    positionsArray[i3 + 2] = position.z;

    sizesArray[i] = Math.random();

    timesMultipliersArray[i] = 1 + Math.random();
  }

  // geometry
  const geometry = new THREE.BufferGeometry();

  // Send geometry atributes
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionsArray, 3)
  );

  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizesArray, 1)
  );

  geometry.setAttribute(
    "aTimeMultiplier",
    new THREE.Float32BufferAttribute(timesMultipliersArray, 1)
  );

  texture.flipY = false;

  // material
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworkVertexShader,
    fragmentShader: fireworkFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(size), // temp value
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  // Points
  const firework = new THREE.Points(geometry, material);
  firework.position.copy(position);
  scene.add(firework);

  // Dispose - Destructor
  const destroy = () => {
    scene.remove(firework);
    geometry.dispose();
    material.dispose();
  };

  // Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    ease: "linear",
    duration: 3,
    onComplete: destroy,
  });
};

// Firework props
// const props = {
//   count: 100,
//   position: new THREE.Vector3(),
//   size: 0.3,
//   textures,
//   sphereRadius: 1,
//   color: new THREE.Color("cyan"),
// };

const createRandomFirework = () => {
  const count = Math.round(400 * Math.random() * 1000);
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    Math.random(),
    (Math.random() - 0.5) * 2
  );
  const size = 0.1 + Math.random() * 0.1;
  const texture = textures[Math.floor(Math.random() * textures.length)];
  const radius = 0.5 * Math.random();
  const color = new THREE.Color();
  color.setHSL(Math.random(), 1, 0.7);
  const props = {
    count,
    position,
    size,
    texture,
    radius,
    color,
  };
  createFirework(props);
};

// create firework
window.addEventListener("click", () => {
  createRandomFirework();
});

createRandomFirework();

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Update material
  //material.uniforms.uSize.value = props.size;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
