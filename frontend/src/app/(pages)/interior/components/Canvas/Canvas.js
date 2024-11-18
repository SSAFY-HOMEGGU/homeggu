//interior/components/Canvas/Canvas.js
"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import useCanvasStore from "../../store/canvasStore";
import FloorPlanner from "../../utils/FloorPlanner";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/app/components/ui/tooltip";
import NavigationController from "./NavigationController";

const Canvas = () => {
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef(null);
  const floorPlannerRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const {
    setCanvas,
    setSelectedObject,
    clearSelectedObject,
    mode,
    gridVisible,
    snapToGrid,
  } = useCanvasStore();

  // 패닝 핸들러
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

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const handleMouseDown = (e) => {
      if (e.button === 2) {
        // 우클릭
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;

      handlePan(deltaX, deltaY);

      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        container.style.cursor = "default";
      }
    };

    const preventContextMenu = (e) => e.preventDefault();

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("contextmenu", preventContextMenu);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("contextmenu", preventContextMenu);
    };
  }, [handlePan]);

  useEffect(() => {
    setIsLoading(true);

    if (!canvasRef.current || !containerRef.current) {
      console.error("Canvas or Container is not available");
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    let isPanning = false;
    let lastX = 0;
    let lastY = 0;
    let isSpacePressed = false;

    // 키보드 이벤트 리스너
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !isSpacePressed) {
        isSpacePressed = true;
        container.style.cursor = "grab";
        // 패닝 모드일 때 캔버스 선택 기능 비활성화
        if (floorPlannerRef.current?.canvas) {
          floorPlannerRef.current.canvas.selection = false;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        isSpacePressed = false;
        container.style.cursor = "default";
        // 패닝 모드 해제 시 캔버스 선택 기능 복원
        if (floorPlannerRef.current?.canvas) {
          floorPlannerRef.current.canvas.selection = true;
        }
      }
    };

    // 마우스 이벤트 리스너
    const handleMouseDown = (e) => {
      if (e.button === 2 || (isSpacePressed && e.button === 0)) {
        isPanning = true;
        isPanningRef.current = true;
        lastX = e.clientX;
        lastY = e.clientY;
        container.style.cursor = "grabbing";

        // 패닝 시작 시 캔버스 선택 기능 비활성화
        if (floorPlannerRef.current?.canvas) {
          floorPlannerRef.current.canvas.selection = false;
          floorPlannerRef.current.canvas.discardActiveObject();
          floorPlannerRef.current.canvas.renderAll();
        }
      }
    };

    const handleMouseMove = (e) => {
      if (!isPanning) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;

      if (floorPlannerRef.current?.canvas) {
        const canvas = floorPlannerRef.current.canvas;
        const vpt = canvas.viewportTransform;
        vpt[4] += deltaX;
        vpt[5] += deltaY;
        canvas.requestRenderAll();
        floorPlannerRef.current.createGrid();
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseUp = () => {
      if (isPanning) {
        isPanning = false;
        isPanningRef.current = false;
        container.style.cursor = isSpacePressed ? "grab" : "default";

        // 패닝 종료 시 캔버스 선택 기능 복원
        if (floorPlannerRef.current?.canvas) {
          floorPlannerRef.current.canvas.selection = true;
        }
      }
    };

    // 컨텍스트 메뉴 방지
    const preventContextMenu = (e) => e.preventDefault();

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("contextmenu", preventContextMenu);

    const canvas = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) {
      console.error("Container dimensions are invalid");
      setIsLoading(false);
      return;
    }

    canvas.width = width;
    canvas.height = height;

    try {
      const floorPlanner = new FloorPlanner("floor-planner-canvas");
      floorPlannerRef.current = floorPlanner;

      floorPlanner.setDimensions(width, height);
      floorPlanner.createGrid();
      setCanvas(floorPlanner);

      // 초기 줌 레벨 설정
      const initialZoom = 0.5;
      floorPlanner.canvas.setZoom(initialZoom);
      floorPlanner.canvas.setViewportTransform([
        initialZoom,
        0,
        0,
        initialZoom,
        0,
        0,
      ]);

      // Selection events
      floorPlanner.canvas.on("selection:created", (e) => {
        if (isPanningRef.current) return; // 패닝 중에는 선택 이벤트 무시
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

      setIsLoading(false);
    } catch (err) {
      console.error("Failed to initialize FloorPlanner:", err);
      setIsLoading(false);
    }

    const handleResize = () => {
      if (!container || !floorPlannerRef.current) return;

      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (newWidth === 0 || newHeight === 0) {
        console.error("Container dimensions are invalid during resize");
        return;
      }

      floorPlannerRef.current.setDimensions(newWidth, newHeight);
      floorPlannerRef.current.createGrid();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup all event listeners
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("contextmenu", preventContextMenu);
      window.removeEventListener("resize", handleResize);

      if (floorPlannerRef.current?.canvas) {
        floorPlannerRef.current.canvas.dispose();
      }
    };
  }, [setCanvas, setSelectedObject, clearSelectedObject]);

  useEffect(() => {
    if (floorPlannerRef.current) {
      floorPlannerRef.current.setMode(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (floorPlannerRef.current) {
      if (gridVisible) {
        floorPlannerRef.current.createGrid();
      } else {
        const canvas = floorPlannerRef.current.canvas;
        const gridLines = canvas.getObjects().filter((obj) => obj.isGrid);
        gridLines.forEach((line) => canvas.remove(line));
        canvas.renderAll();
      }
    }
  }, [gridVisible]);

  useEffect(() => {
    if (floorPlannerRef.current) {
      floorPlannerRef.current.snapToGrid = snapToGrid;
    }
  }, [snapToGrid]);

  const handleZoomIn = () => {
    if (floorPlannerRef.current) {
      const canvas = floorPlannerRef.current.getCanvas();
      let zoom = canvas.getZoom();
      zoom = Math.min(20, zoom * 1.1);

      const center = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };
      canvas.zoomToPoint(center, zoom);
      floorPlannerRef.current.createGrid();
    }
  };

  const handleZoomOut = () => {
    if (floorPlannerRef.current) {
      const canvas = floorPlannerRef.current.getCanvas();
      let zoom = canvas.getZoom();
      zoom = Math.max(0.5, zoom / 1.1);

      const center = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };
      canvas.zoomToPoint(center, zoom);
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
      {isLoading && <div>Loading...</div>}

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
