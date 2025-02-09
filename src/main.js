import './style.css'

import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import interFont from './inter_semibold.json'

let scene, camera, renderer, effect;
let textMesh;

const start = Date.now();

const effectContainer = document.querySelector('#effect-container');

if (effectContainer === null) {
  console.error("couldn't fetch effect container element...");
}

function init() {
  if (effectContainer === null) {
    return;
  }

  //// scene and camerasetup
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0, 0, 0 );
  
  camera = new THREE.PerspectiveCamera( 75, effectContainer.clientWidth / effectContainer.clientHeight, 0.1, 1000 );
  camera.position.setZ(40);

  //// lights setup
  const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight1.position.set( -10, -10, -10 );
  scene.add( pointLight1 );

  const pointLight2 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight2.position.set( 0, 0, 10 );
  scene.add( pointLight2 );

  
  //// text setup
  
  // load font
  const font = new FontLoader().parse(interFont);
  
  // create text geometry using font
  const geometry = new TextGeometry('LINSOC', {
    font: font,
    size: 8, 
    height: 2
  });

  // set center position on geometry for rotation
  geometry.center();

  const material = new THREE.MeshStandardMaterial( { color: 0xFFA500} );
  
  textMesh = new THREE.Mesh( geometry, material );
  
  scene.add(textMesh);

  //// renderer
  const canvasElement = document.querySelector('#aascii');
  
  if (canvasElement === null) {
    console.error("couldn't fetch canvas element...");
    return;
  }

  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  });
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( effectContainer.clientWidth, effectContainer.clientHeight );

  //// effect

  effect = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
  effect.setSize( effectContainer.clientWidth, effectContainer.clientHeight );
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'transparent';


  // special case for effect

  effectContainer.appendChild( effect.domElement );

  //// add event listener to fix on resize window
  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  if (effectContainer === null) {
    return;
  }

  camera.aspect = effectContainer.clientWidth / effectContainer.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( effectContainer.clientWidth, effectContainer.clientHeight );
  effect.setSize( effectContainer.clientWidth, effectContainer.clientHeight );
}

function animate() {
  requestAnimationFrame( animate );

  render();
}

function render() {
  const timer = Date.now() - start;

  textMesh.rotation.z = Math.sin(timer * 0.002) / 7.1235;

  textMesh.rotation.y += 0.005;

  effect.render( scene, camera );
}

init();
animate();


