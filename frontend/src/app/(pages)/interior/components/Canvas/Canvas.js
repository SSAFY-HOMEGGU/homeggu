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

const Canvas = () => {
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef(null);
  const floorPlannerRef = useRef(null);
  const containerRef = useRef(null);

  const {
    setCanvas,
    setSelectedObject,
    clearSelectedObject,
    mode,
    gridVisible,
    snapToGrid,
  } = useCanvasStore();

  useEffect(() => {
    setIsLoading(true);

    if (!canvasRef.current || !containerRef.current) {
      console.error("Canvas or Container is not available");
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
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

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-md"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-md"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-md"
                onClick={handleResetView}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Canvas;
