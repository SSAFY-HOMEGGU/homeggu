// src/app/(pages)/interior/utils/useCanvas.js

import { useEffect } from "react";
import useCanvasStore from "../store/canvasStore";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

export const useCanvas = (canvasRef) => {
  const { setCanvas, setActiveObject, mode, addObject, updateObjectList } =
    useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.8,
      backgroundColor: "#ffffff",
    });

    canvas.selection = true;
    canvas.preserveObjectStacking = true;

    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: "#2196F3",
      cornerColor: "#2196F3",
      cornerStyle: "circle",
      cornerSize: 10,
      padding: 10,
    });

    canvas.on("object:added", (e) => {
      const obj = e.target;
      if (!obj.id) {
        obj.id = uuidv4();
      }
      const shapeData = {
        id: obj.id,
        type: obj.type,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        strokeWidth: obj.strokeWidth || 1,
      };
      addObject(shapeData);
    });

    canvas.on("selection:created", (e) => {
      setActiveObject(e.selected[0]);
    });

    canvas.on("selection:cleared", () => {
      setActiveObject(null);
    });

    canvas.on("object:modified", () => {
      updateObjectList(
        canvas.getObjects().map((obj) => ({
          id: obj.id,
          type: obj.type,
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          strokeWidth: obj.strokeWidth || 1,
        }))
      );
    });

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth * 0.7,
        height: window.innerHeight * 0.8,
      });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    setCanvas(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, [canvasRef, setCanvas, setActiveObject, addObject, updateObjectList]);
};

export default useCanvas;
