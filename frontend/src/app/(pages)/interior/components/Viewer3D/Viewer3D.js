// Viewer3D.js
"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import useCanvasStore from "../../store/canvasStore";

const WALL_HEIGHT = 250;
const COLORS = {
  WALL: 0xcccccc,
  FLOOR: 0xeeeeee,
  DOOR: 0x8b4513,
  WINDOW: 0x87ceeb,
};

const Viewer3D = () => {
  const containerRef = useRef(null);
  const { objectList } = useCanvasStore();
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      10000
    );
    camera.position.set(0, 1000, 1500);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1000, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(2000, 20);
    scene.add(gridHelper);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const meshes = [];
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        meshes.push(object);
      }
    });
    meshes.forEach((mesh) => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
      sceneRef.current.remove(mesh);
    });

    objectList.forEach((obj) => {
      if (obj.type === "wall") createWall3D(obj, sceneRef.current);
      else if (obj.type === "door") createDoor3D(obj, sceneRef.current);
      else if (obj.type === "window") createWindow3D(obj, sceneRef.current);
    });
  }, [objectList]);

  const createWall3D = (wallObj, scene) => {
    const wallGeometry = new THREE.BoxGeometry(
      wallObj.width,
      WALL_HEIGHT,
      wallObj.strokeWidth
    );
    const wallMaterial = new THREE.MeshStandardMaterial({ color: COLORS.WALL });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(wallObj.left, WALL_HEIGHT / 2, wallObj.top);
    scene.add(wall);
  };

  const createDoor3D = (doorObj, scene) => {
    const doorGeometry = new THREE.BoxGeometry(
      doorObj.width,
      WALL_HEIGHT * 0.8,
      10
    );
    const doorMaterial = new THREE.MeshStandardMaterial({ color: COLORS.DOOR });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(doorObj.left, WALL_HEIGHT * 0.4, doorObj.top);
    scene.add(door);
  };

  const createWindow3D = (windowObj, scene) => {
    const windowGeometry = new THREE.BoxGeometry(
      windowObj.width,
      WALL_HEIGHT * 0.4,
      10
    );
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.WINDOW,
      transparent: true,
      opacity: 0.6,
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(windowObj.left, WALL_HEIGHT * 0.7, windowObj.top);
    scene.add(window);
  };

  return <div ref={containerRef} className="w-full h-full min-h-[500px]" />;
};

export default Viewer3D;
