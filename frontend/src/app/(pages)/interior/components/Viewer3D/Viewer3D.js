// interior/components/Viewer3D/Viewer3D.js
"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import useCanvasStore from "../../store/canvasStore";

const WALL_HEIGHT = 250;
const WALL_THICKNESS = 10;
const COLORS = {
  FLOOR: 0xeeeeee,
  DOOR: 0x8b4513,
  WINDOW: 0xffffff,
};

const WALL_TEXTURE_PATH = "/images/wallpattern.jpg";

const Viewer3D = () => {
  const containerRef = useRef(null);
  const { canvas, walls, currentView } = useCanvasStore();
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const meshesRef = useRef(new Map());

  useEffect(() => {
    if (!containerRef.current || !canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Load wall texture
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load(
      WALL_TEXTURE_PATH,
      () => console.log("Texture loaded successfully"),
      undefined,
      (error) => console.error("Error loading texture:", error)
    );

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      10000
    );
    camera.position.set(0, 500, 1000);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Ambient Light (더 밝은 조명)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // 기존보다 강하게 설정
    scene.add(ambientLight);

    // Directional Light (더 밝은 직사광)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // 강도 증가
    directionalLight.position.set(1000, 1000, 1000);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Grid setup
    const gridHelper = new THREE.GridHelper(2000, 20, 0xdddddd, 0xdddddd); // 밝은 그리드 색상
    scene.add(gridHelper);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x06437a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0; // 필요 시 조정하여 바닥 위치 확인
    ground.receiveShadow = true;
    scene.add(ground);

    const updateScene = () => {
      // Clear existing meshes
      meshesRef.current.forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
        scene.remove(mesh);
      });
      meshesRef.current.clear();

      // Create walls from canvas objects
      canvas.walls.forEach((wall) => {
        if (!wall.fabricObject) return;

        const wallLength = Math.sqrt(
          Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
        );
        const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);

        const wallGeometry = new THREE.BoxGeometry(
          wallLength,
          WALL_HEIGHT,
          WALL_THICKNESS
        );
        const wallMaterial = new THREE.MeshStandardMaterial({
          map: wallTexture,
          color: 0xffffff,
          roughness: 0.2,
          metalness: 0.0,
        });

        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        wallMesh.position.set(
          (wall.x1 + wall.x2) / 2,
          WALL_HEIGHT / 2,
          (wall.y1 + wall.y2) / 2
        );
        wallMesh.rotation.y = -angle;
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;

        scene.add(wallMesh);
        meshesRef.current.set(wall.id, wallMesh);
      });

      // Add doors and windows if they exist
      canvas.canvas.getObjects().forEach((obj) => {
        if (obj.type === "door" || obj.type === "window") {
          // Find the wall this object is attached to
          const walls = canvas.walls;
          let attachedWall = null;
          let minDistance = Infinity;

          walls.forEach((wall) => {
            const point = { x: obj.left, y: obj.top };
            const distanceToWall = pointToLineDistance(
              point,
              { x: wall.x1, y: wall.y1 },
              { x: wall.x2, y: wall.y2 }
            );
            if (distanceToWall < minDistance) {
              minDistance = distanceToWall;
              attachedWall = wall;
            }
          });

          if (attachedWall) {
            const wallAngle = Math.atan2(
              attachedWall.y2 - attachedWall.y1,
              attachedWall.x2 - attachedWall.x1
            );

            // Create geometry based on type
            const geometry = new THREE.BoxGeometry(
              obj.width,
              obj.type === "door" ? WALL_HEIGHT * 0.8 : WALL_HEIGHT * 0.4,
              WALL_THICKNESS * 1.2
            );

            let material;

            if (obj.type === "door") {
              // 문 재질 설정
              material = new THREE.MeshStandardMaterial({
                color: COLORS.DOOR,
                roughness: 0.6,
                metalness: 0.3,
              });
            } else {
              // 창문 재질 설정 (발광 효과 추가)
              material = new THREE.MeshPhongMaterial({
                color: 0xffffff, // 하얀색
                transparent: true,
                opacity: 0.3, // 더 투명하게
                emissive: 0xffffff, // 하얀색 발광
                emissiveIntensity: 0.3, // 발광 강도
                specular: 0xffffff, // 반사광 색상
                shininess: 100, // 반사광 강도
                side: THREE.DoubleSide, // 양면 렌더링
              });
            }

            const mesh = new THREE.Mesh(geometry, material);

            // Position the object
            mesh.position.set(
              obj.left,
              obj.type === "door" ? WALL_HEIGHT * 0.4 : WALL_HEIGHT * 0.7,
              obj.top
            );

            // Apply the same rotation as the wall
            mesh.rotation.y = -wallAngle;

            // 그림자 설정
            mesh.castShadow = true;
            if (obj.type === "window") {
              mesh.receiveShadow = true; // 창문은 그림자도 받음
            }

            scene.add(mesh);
            meshesRef.current.set(obj.id, mesh);
          }
        }
      });
    };
    // Helper function to calculate distance from point to line
    function pointToLineDistance(point, lineStart, lineEnd) {
      const numerator = Math.abs(
        (lineEnd.y - lineStart.y) * point.x -
          (lineEnd.x - lineStart.x) * point.y +
          lineEnd.x * lineStart.y -
          lineEnd.y * lineStart.x
      );
      const denominator = Math.sqrt(
        Math.pow(lineEnd.y - lineStart.y, 2) +
          Math.pow(lineEnd.x - lineStart.x, 2)
      );
      return numerator / denominator;
    }

    // Initial update
    updateScene();

    // Subscribe to canvas changes
    const handleCanvasChange = () => {
      updateScene();
    };

    canvas.canvas.on("object:modified", handleCanvasChange);
    canvas.canvas.on("object:added", handleCanvasChange);
    canvas.canvas.on("object:removed", handleCanvasChange);

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.canvas.off("object:modified", handleCanvasChange);
      canvas.canvas.off("object:added", handleCanvasChange);
      canvas.canvas.off("object:removed", handleCanvasChange);

      meshesRef.current.forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
      });

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });

      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [canvas]);

  // Handle canvas switch between 2D and 3D views
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const { setCurrentView, currentView } = useCanvasStore.getState();
        setCurrentView(currentView === "2d" ? "3d" : "2d");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[500px]" />;
};

export default Viewer3D;
