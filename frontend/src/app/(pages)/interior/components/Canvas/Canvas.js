// Canvas.js
"use client";
import React, { useRef, useEffect } from "react";
import useCanvasStore from "../../store/canvasStore";
import FloorPlanner from "../../utils/FloorPlanner";

const Canvas = () => {
  const canvasRef = useRef(null);
  const floorPlannerRef = useRef(null);
  const { setCanvas, mode } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // 컨테이너 크기 계산
    const container = canvasRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 캔버스 크기 설정
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // FloorPlanner 초기화
    const floorPlanner = new FloorPlanner(canvasRef.current.id);
    floorPlannerRef.current = floorPlanner;

    // FloorPlanner 크기 설정
    floorPlanner.setDimensions(width, height);

    setCanvas(floorPlanner);

    // 리사이즈 핸들러
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (floorPlannerRef.current) {
        floorPlannerRef.current.setDimensions(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (floorPlannerRef.current) {
        const fabricCanvas = floorPlannerRef.current.getCanvas();
        if (fabricCanvas) {
          fabricCanvas.dispose();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (floorPlannerRef.current) {
      floorPlannerRef.current.setMode(mode);
    }
  }, [mode]);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        id="floor-planner-canvas"
        className="w-full h-full"
      />
    </div>
  );
};

export default Canvas;
