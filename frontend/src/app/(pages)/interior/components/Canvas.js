"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fabric } from "fabric";
import useFloorStore from "../../../store/floorStore";
import {
  GRID_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  createWoodPattern,
  ROTATION_SNAP,
} from "../config";
import { createDefaultRoom } from "../utils";

const Canvas = () => {
  const { setSelectedObjects, setActiveTools, setSelectedWall, updateArea } =
    useFloorStore();
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (!fabric) return;

    const newCanvas = new fabric.Canvas("room-canvas", {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });

    // 그리드 생성
    for (let i = 0; i < CANVAS_WIDTH / GRID_SIZE; i++) {
      newCanvas.add(
        new fabric.Line([i * GRID_SIZE, 0, i * GRID_SIZE, CANVAS_HEIGHT], {
          stroke: "#e5e5e5",
          selectable: false,
          evented: false,
        })
      );
    }
    for (let i = 0; i < CANVAS_HEIGHT / GRID_SIZE; i++) {
      newCanvas.add(
        new fabric.Line([0, i * GRID_SIZE, CANVAS_WIDTH, i * GRID_SIZE], {
          stroke: "#e5e5e5",
          selectable: false,
          evented: false,
        })
      );
    }

    // 이벤트 핸들러 설정
    const handleSelectionCreated = (e) => {
      if (!e.selected) return;
      setSelectedObjects(e.selected);

      if (e.selected.length === 1) {
        const selectedObject = e.selected[0];
        if (selectedObject.type === "wall") {
          setSelectedWall(selectedObject);
          setWallDimensions({
            width: (selectedObject.width / GRID_SIZE) * 0.5,
            height: wallHeight,
          });
        }
      }
    };

    const handleObjectModified = (e) => {
      if (!e.target) return;

      if (dimensionText) {
        newCanvas.remove(dimensionText);
      }

      const target = e.target;
      const newAngle = Math.round(target.angle / ROTATION_SNAP) * ROTATION_SNAP;
      target.set("angle", newAngle);
      setRotationAngle(newAngle);

      if (target.type === "room" && areaText) {
        const center = target.getCenterPoint();
        areaText.set({
          left: center.x,
          top: center.y,
          angle: -newAngle,
        });
      }

      newCanvas.renderAll();
      updateArea(newCanvas);
    };

    newCanvas.on({
      "selection:created": handleSelectionCreated,
      "selection:cleared": () => {
        setSelectedObjects([]);
        setActiveTools([]);
        setSelectedWall(null);
      },
      "object:scaling": (e) => {
        if (!e.target) return;
        const target = e.target;

        if (dimensionText) {
          newCanvas.remove(dimensionText);
        }

        const width = (target.getScaledWidth() / GRID_SIZE) * 0.5;
        const height = (target.getScaledHeight() / GRID_SIZE) * 0.5;

        const newDimensionText = new fabric.Text(
          `${width.toFixed(1)}m × ${height.toFixed(1)}m`,
          {
            left: target.left + target.getScaledWidth() / 2,
            top: target.top - 20,
            fontSize: 14,
            fill: "#2196F3",
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: 5,
            textAlign: "center",
            originX: "center",
            originY: "bottom",
            selectable: false,
            evented: false,
          }
        );

        newCanvas.add(newDimensionText);
        setDimensionText(newDimensionText);
        newCanvas.renderAll();

        if (target.type === "wall") {
          setWallDimensions({
            width: width,
            height: wallHeight,
          });
          updateArea(newCanvas);
        } else if (target.type === "room") {
          updateArea(newCanvas);
          if (areaText) {
            const center = target.getCenterPoint();
            areaText.set({
              left: center.x,
              top: center.y,
            });
          }
        }
      },
      "object:modified": handleObjectModified,
      "object:scaling:started": (e) => {
        if (!e.target) return;
        const target = e.target;

        const width = (target.getScaledWidth() / GRID_SIZE) * 0.5;
        const height = (target.getScaledHeight() / GRID_SIZE) * 0.5;

        const newDimensionText = new fabric.Text(
          `${width.toFixed(1)}m × ${height.toFixed(1)}m`,
          {
            left: target.left + target.getScaledWidth() / 2,
            top: target.top - 20,
            fontSize: 14,
            fill: "#2196F3",
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: 5,
            textAlign: "center",
            originX: "center",
            originY: "bottom",
            selectable: false,
            evented: false,
          }
        );

        newCanvas.add(newDimensionText);
        setDimensionText(newDimensionText);
        newCanvas.renderAll();
      },
      "object:moving": (e) => {
        if (e.target && e.target.type === "room" && areaText) {
          const center = e.target.getCenterPoint();
          areaText.set({
            left: center.x,
            top: center.y,
          });
          newCanvas.renderAll();
        }

        if (dimensionText) {
          const target = e.target;
          dimensionText.set({
            left: target.left + target.getScaledWidth() / 2,
            top: target.top - 20,
          });
          newCanvas.renderAll();
        }
      },
      "mouse:up": (e) => {
        if (dimensionText) {
          newCanvas.remove(dimensionText);
          setDimensionText(null);
          newCanvas.renderAll();
        }
      },
      "object:rotating": (e) => {
        const target = e.target;
        const angle = target.angle;
        const snappedAngle = Math.round(angle / ROTATION_SNAP) * ROTATION_SNAP;
        target.set("angle", snappedAngle);
        setRotationAngle(snappedAngle);

        if (target.type === "group") {
          const label = target
            .getObjects()
            .find((obj) => obj instanceof fabric.Text);
          if (label) {
            label.set("angle", -snappedAngle);
          }
        }

        if (target.type === "room" && areaText) {
          const center = target.getCenterPoint();
          areaText.set({
            left: center.x,
            top: center.y,
            angle: -snappedAngle,
          });
        }
        newCanvas.renderAll();
      },
    });

    createDefaultRoom(newCanvas);
    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
    };
  }, [setSelectedObjects, setActiveTools, setSelectedWall, updateArea]);

  return <canvas id="room-canvas" className="border border-gray-200" />;
};

export default Canvas;
