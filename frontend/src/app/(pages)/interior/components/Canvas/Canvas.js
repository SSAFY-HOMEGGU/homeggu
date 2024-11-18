import React, { useRef, useEffect, useCallback, useState } from "react";
import useCanvasStore from "../../store/canvasStore";
import useProjectStore from "../../store/projectStore";
import FloorPlanner from "../../utils/FloorPlanner";
import NavigationController from "./NavigationController";
import { toast } from "react-toastify";

const Canvas = ({ projectId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);
  const floorPlannerRef = useRef(null);
  const containerRef = useRef(null);
  const isPanningRef = useRef(false);

  const { setCanvas, setSelectedObject, clearSelectedObject, mode } =
    useCanvasStore();
  const { loadProject, currentProject } = useProjectStore();

  // 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setIsLoading(true);
        const project = loadProject(projectId);

        if (!project) {
          console.warn("Project not found");
          router.push("/interior");
          return;
        }

        if (floorPlannerRef.current && project.data?.canvasState) {
          console.log("Loading project state:", project.data.canvasState);
          const success = floorPlannerRef.current.loadFromState(
            project.data.canvasState
          );
          if (!success) {
            console.error("Failed to load project state");
          }
        } else {
          console.log("Creating new project state");
          // 새 프로젝트인 경우 기본 상태 초기화
          if (floorPlannerRef.current) {
            floorPlannerRef.current.clear();
            floorPlannerRef.current.createGrid();
          }
        }
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId, loadProject]);

  // Canvas 초기화
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;

    try {
      const floorPlanner = new FloorPlanner("floor-planner-canvas");
      floorPlannerRef.current = floorPlanner;

      floorPlanner.setDimensions(width, height);
      floorPlanner.createGrid();
      setCanvas(floorPlanner);

      // 선택 이벤트 처리
      floorPlanner.canvas.on("selection:created", (e) => {
        if (isPanningRef.current) return;
        const target = e.selected[0];
        if (target) {
          setSelectedObject({
            name: target.name || target.type || "Unknown",
            x1: target.left,
            y1: target.top,
            x2: target.left + (target.width || 0),
            y2: target.top + (target.height || 0),
            width: target.width,
            height: target.height,
            angle: target.angle,
            thickness: target.strokeWidth,
            textureA: target.textureA || "Default",
            textureB: target.textureB || "Default",
          });
        }
      });

      floorPlanner.canvas.on("selection:cleared", clearSelectedObject);

      // 현재 프로젝트의 저장된 상태가 있다면 로드
      if (currentProject?.data?.canvasState) {
        console.log("Loading initial project state");
        floorPlanner.loadFromState(currentProject.data.canvasState);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Failed to initialize FloorPlanner:", err);
      setIsLoading(false);
    }

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!containerRef.current || !floorPlannerRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      floorPlannerRef.current.setDimensions(newWidth, newHeight);
      floorPlannerRef.current.createGrid();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (floorPlannerRef.current?.canvas) {
        floorPlannerRef.current.canvas.dispose();
      }
    };
  }, [setCanvas, setSelectedObject, clearSelectedObject, currentProject]);

  // 모드 변경 시 FloorPlanner 모드 업데이트
  useEffect(() => {
    if (floorPlannerRef.current) {
      floorPlannerRef.current.setMode(mode);
    }
  }, [mode]);

  // Navigation 컨트롤 핸들러들
  const handlePan = useCallback((deltaX, deltaY) => {
    if (floorPlannerRef.current?.canvas) {
      const canvas = floorPlannerRef.current.canvas;
      const vpt = canvas.viewportTransform;
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.requestRenderAll();
      floorPlannerRef.current.createGrid();
    }
  }, []);

  const handleZoomIn = () => {
    if (floorPlannerRef.current) {
      const canvas = floorPlannerRef.current.getCanvas();
      let zoom = canvas.getZoom();
      zoom = Math.min(20, zoom * 1.1);
      canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
      floorPlannerRef.current.createGrid();
    }
  };

  const handleZoomOut = () => {
    if (floorPlannerRef.current) {
      const canvas = floorPlannerRef.current.getCanvas();
      let zoom = canvas.getZoom();
      zoom = Math.max(0.5, zoom / 1.1);
      canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
      floorPlannerRef.current.createGrid();
    }
  };

  const handleResetView = useCallback(() => {
    if (floorPlannerRef.current?.canvas) {
      const canvas = floorPlannerRef.current.canvas;
      canvas.setZoom(1);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      floorPlannerRef.current.createGrid();
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-50">
      <canvas
        ref={canvasRef}
        id="floor-planner-canvas"
        className="absolute inset-0 w-full h-full"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="text-lg">Loading...</div>
        </div>
      )}
      <NavigationController
        onMove={handlePan}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleResetView}
      />
    </div>
  );
};

export default Canvas;
