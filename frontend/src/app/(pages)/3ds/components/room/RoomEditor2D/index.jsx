// src/app/3ds/components/room/RoomEditor2D/index.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import EditorToolbar from "../EditorToolbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  EDITOR_CONFIG,
  TOOL_TYPES,
  OBJECT_TYPES,
  DOOR_TYPES,
  WINDOW_TYPES,
} from "@/app/constants/roomEditor";
import { createDefaultRoom } from "./DefaultRoom";
import { createDimensionLine, updateAreaText } from "./DimensionLine";

const RoomEditor2D = () => {
  // Refs & State
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeTool, setActiveTool] = useState(TOOL_TYPES.SELECT);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [wallHeight, setWallHeight] = useState(
    EDITOR_CONFIG.DEFAULT_WALL_HEIGHT
  );
  const [scale, setScale] = useState(1);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showDoorWindow, setShowDoorWindow] = useState(false);
  const [selectedWall, setSelectedWall] = useState(null);
  const [showWallLengthDialog, setShowWallLengthDialog] = useState(false);
  const [showRoomSizeDialog, setShowRoomSizeDialog] = useState(false);
  const [wallStartPoint, setWallStartPoint] = useState(null);
  const [wallAngle, setWallAngle] = useState(0);

  // 캔버스 상태 저장
  const saveState = () => {
    if (!canvas) return;
    const json = canvas.toJSON(["data", "lockDelete"]);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 포인트가 방 내부에 있는지 확인
  const isPointInsideRoom = (point, roomObj) => {
    const roomBounds = roomObj.getBoundingRect();
    const roomLeft = roomBounds.left + EDITOR_CONFIG.WALL_THICKNESS;
    const roomRight =
      roomBounds.left + roomBounds.width - EDITOR_CONFIG.WALL_THICKNESS;
    const roomTop = roomBounds.top + EDITOR_CONFIG.WALL_THICKNESS;
    const roomBottom =
      roomBounds.top + roomBounds.height - EDITOR_CONFIG.WALL_THICKNESS;

    return (
      point.x >= roomLeft &&
      point.x <= roomRight &&
      point.y >= roomTop &&
      point.y <= roomBottom
    );
  };

  // 벽 생성 함수
  const createWall = ({ startPoint, length, angle }) => {
    const pixelLength = length * (EDITOR_CONFIG.GRID_SIZE / 100);
    const radians = (angle * Math.PI) / 180;

    const wall = new fabric.Rect({
      left: startPoint.x,
      top: startPoint.y,
      width: pixelLength,
      height: EDITOR_CONFIG.WALL_THICKNESS,
      fill: "#666666",
      angle: angle,
      data: {
        type: OBJECT_TYPES.WALL,
        height: wallHeight,
        thickness: EDITOR_CONFIG.WALL_THICKNESS,
      },
    });

    canvas.add(wall);
    createDimensionLine(canvas, wall);
    saveState();
  };

  // 방 크기 변경 함수
  const handleRoomSizeChange = ({ width, height }) => {
    const defaultRoom = canvas
      .getObjects()
      .find((obj) => obj.data?.type === OBJECT_TYPES.DEFAULT_ROOM);
    if (!defaultRoom) return;

    const pixelWidth = width * (EDITOR_CONFIG.GRID_SIZE / 100);
    const pixelHeight = height * (EDITOR_CONFIG.GRID_SIZE / 100);

    defaultRoom.set({
      width: pixelWidth,
      height: pixelHeight,
    });

    // 벽들의 크기와 위치 조정
    const walls = defaultRoom
      .getObjects()
      .filter((obj) => obj.data?.type === OBJECT_TYPES.DEFAULT_WALL);

    walls.forEach((wall) => {
      if (wall.top === 0) {
        // 위쪽 벽
        wall.set({ width: pixelWidth });
      } else if (wall.left === 0) {
        // 왼쪽 벽
        wall.set({ height: pixelHeight });
      } else if (wall.top > 0) {
        // 아래쪽 벽
        wall.set({
          width: pixelWidth,
          top: pixelHeight - EDITOR_CONFIG.WALL_THICKNESS,
        });
      } else {
        // 오른쪽 벽
        wall.set({
          height: pixelHeight,
          left: pixelWidth - EDITOR_CONFIG.WALL_THICKNESS,
        });
      }
    });

    defaultRoom.addWithUpdate();
    updateAreaText(canvas);
    canvas.renderAll();
    saveState();
  };

  // 격자 생성
  const createGrid = (canvas) => {
    for (let i = 0; i < 1000; i += EDITOR_CONFIG.GRID_SIZE) {
      canvas.add(
        new fabric.Line([i, 0, i, 800], {
          stroke: "#e9ecef",
          selectable: false,
        })
      );
      canvas.add(
        new fabric.Line([0, i, 1000, i], {
          stroke: "#e9ecef",
          selectable: false,
        })
      );
    }

    // 축척 표시
    canvas.add(
      new fabric.Text("1m", {
        left: 10,
        top: 10,
        fontSize: 14,
        selectable: false,
      })
    );
  };

  // Canvas 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1000,
      height: 800,
      backgroundColor: "#f8f9fa",
    });

    createGrid(newCanvas);
    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  // 캔버스 초기화 후 기본 방 생성
  useEffect(() => {
    if (!canvas) return;
    const room = createDefaultRoom(canvas, wallHeight);
    updateAreaText(canvas);
    saveState();
  }, [canvas]);

  // 이벤트 핸들러들
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (opt) => {
      if (activeTool === TOOL_TYPES.WALL) {
        const pointer = canvas.getPointer(opt.e);
        const defaultRoom = canvas
          .getObjects()
          .find((obj) => obj.data?.type === OBJECT_TYPES.DEFAULT_ROOM);

        if (!defaultRoom || !isPointInsideRoom(pointer, defaultRoom)) {
          return;
        }

        // 우클릭 시 길이 입력 다이얼로그 표시
        if (opt.e.button === 2) {
          setWallStartPoint({
            x:
              Math.round(pointer.x / EDITOR_CONFIG.SNAP_GRID) *
              EDITOR_CONFIG.SNAP_GRID,
            y:
              Math.round(pointer.y / EDITOR_CONFIG.SNAP_GRID) *
              EDITOR_CONFIG.SNAP_GRID,
          });
          setShowWallLengthDialog(true);
          return;
        }

        setIsDrawing(true);
        setStartPoint({
          x:
            Math.round(pointer.x / EDITOR_CONFIG.SNAP_GRID) *
            EDITOR_CONFIG.SNAP_GRID,
          y:
            Math.round(pointer.y / EDITOR_CONFIG.SNAP_GRID) *
            EDITOR_CONFIG.SNAP_GRID,
        });
      }
    };

    const handleMouseMove = (opt) => {
      if (!isDrawing || !startPoint || activeTool !== TOOL_TYPES.WALL) return;

      const pointer = canvas.getPointer(opt.e);
      const defaultRoom = canvas
        .getObjects()
        .find((obj) => obj.data?.type === OBJECT_TYPES.DEFAULT_ROOM);

      if (!defaultRoom || !isPointInsideRoom(pointer, defaultRoom)) {
        return;
      }

      // 스냅 적용된 좌표
      const snappedX =
        Math.round(pointer.x / EDITOR_CONFIG.SNAP_GRID) *
        EDITOR_CONFIG.SNAP_GRID;
      const snappedY =
        Math.round(pointer.y / EDITOR_CONFIG.SNAP_GRID) *
        EDITOR_CONFIG.SNAP_GRID;

      // 각도 계산 및 스냅
      const dx = snappedX - startPoint.x;
      const dy = snappedY - startPoint.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const snappedAngle =
        Math.round(angle / EDITOR_CONFIG.SNAP_ANGLE) * EDITOR_CONFIG.SNAP_ANGLE;
      const rad = (snappedAngle * Math.PI) / 180;

      // 길이 계산
      const length = Math.sqrt(dx * dx + dy * dy);

      // 임시 벽 업데이트
      canvas.getObjects().forEach((obj) => {
        if (obj.data?.type === OBJECT_TYPES.TEMP_WALL) {
          canvas.remove(obj);
        }
      });

      const wall = new fabric.Rect({
        left: startPoint.x,
        top: startPoint.y,
        width: length,
        height: EDITOR_CONFIG.WALL_THICKNESS,
        fill: "#666666",
        angle: snappedAngle,
        data: {
          type: OBJECT_TYPES.TEMP_WALL,
          height: wallHeight,
          thickness: EDITOR_CONFIG.WALL_THICKNESS,
        },
      });

      canvas.add(wall);
      canvas.renderAll();
    };

    const handleMouseUp = (opt) => {
      if (isDrawing && startPoint && activeTool === TOOL_TYPES.WALL) {
        const pointer = canvas.getPointer(opt.e);

        canvas.getObjects().forEach((obj) => {
          if (obj.data?.type === OBJECT_TYPES.TEMP_WALL) {
            canvas.remove(obj);
          }
        });

        const dx = pointer.x - startPoint.x;
        const dy = pointer.y - startPoint.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const snappedAngle =
          Math.round(angle / EDITOR_CONFIG.SNAP_ANGLE) *
          EDITOR_CONFIG.SNAP_ANGLE;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > EDITOR_CONFIG.SNAP_GRID) {
          createWall({
            startPoint,
            length: length * (100 / EDITOR_CONFIG.GRID_SIZE),
            angle: snappedAngle,
          });
        }

        setIsDrawing(false);
        setStartPoint(null);
      }
    };

    const handleDoubleClick = (opt) => {
      const target = canvas.findTarget(opt.e);
      if (target?.data?.type === OBJECT_TYPES.DEFAULT_ROOM) {
        setShowRoomSizeDialog(true);
      }
    };

    // 객체 이동과 회전 관련 핸들러
    const handleObjectMoving = (e) => {
      const obj = e.target;

      // 스냅 적용
      const newLeft =
        Math.round(obj.left / EDITOR_CONFIG.SNAP_GRID) *
        EDITOR_CONFIG.SNAP_GRID;
      const newTop =
        Math.round(obj.top / EDITOR_CONFIG.SNAP_GRID) * EDITOR_CONFIG.SNAP_GRID;

      obj.set({
        left: newLeft,
        top: newTop,
      });

      if (
        obj.data?.type === OBJECT_TYPES.WALL ||
        obj.data?.type === OBJECT_TYPES.DEFAULT_WALL
      ) {
        createDimensionLine(canvas, obj);
      } else if (obj.data?.type === OBJECT_TYPES.DEFAULT_ROOM) {
        updateAreaText(canvas);
      }
    };

    const handleRotating = (e) => {
      const obj = e.target;
      if (
        obj.data?.type === OBJECT_TYPES.WALL ||
        obj.data?.type === OBJECT_TYPES.DEFAULT_WALL
      ) {
        const angle = obj.angle;
        const snappedAngle =
          Math.round(angle / EDITOR_CONFIG.SNAP_ANGLE) *
          EDITOR_CONFIG.SNAP_ANGLE;
        obj.set("angle", snappedAngle);
        canvas.getElement().style.cursor =
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38'/%3E%3C/svg%3E\"), auto";
        createDimensionLine(canvas, obj);
      }
    };

    // 이벤트 리스너 등록
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("mouse:dblclick", handleDoubleClick);
    canvas.on("object:moving", handleObjectMoving);
    canvas.on("object:rotating", handleRotating);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("mouse:dblclick", handleDoubleClick);
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:rotating", handleRotating);
    };
  }, [canvas, isDrawing, startPoint, activeTool, wallHeight]);

  // 툴바 핸들러들
  const handleUndo = () => {
    if (historyIndex > 0) {
      canvas.loadFromJSON(history[historyIndex - 1], () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      canvas.loadFromJSON(history[historyIndex + 1], () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  };

  const handleSave = () => {
    const json = canvas.toJSON(["data", "lockDelete"]);
    const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "room.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        canvas.loadFromJSON(e.target.result, () => {
          canvas.renderAll();
          saveState();
        });
      };
      reader.readAsText(file);
    }
  };

  const handleScaleChange = (newScale) => {
    if (!canvas) return;
    setScale(newScale);
    canvas.setZoom(newScale);
    canvas.renderAll();
  };

  const handleRotate = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const currentAngle = activeObject.angle || 0;
      activeObject.set("angle", currentAngle + EDITOR_CONFIG.SNAP_ANGLE);
      canvas.renderAll();
      saveState();
    }
  };

  return (
    <div
      className="h-screen flex flex-col"
      onContextMenu={(e) => e.preventDefault()}
    >
      <EditorToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onLoad={handleLoad}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        scale={scale}
        onScaleChange={handleScaleChange}
        onRotate={handleRotate}
      />

      <div className="flex-1 overflow-auto border border-gray-200 bg-gray-50">
        <div className="relative">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* 벽 길이 입력 다이얼로그 */}
      {showWallLengthDialog && (
        <Dialog
          open={showWallLengthDialog}
          onOpenChange={setShowWallLengthDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>벽 길이 입력</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <span className="w-20">길이:</span>
                <Input
                  type="number"
                  defaultValue={100}
                  onChange={(e) => setWallLength(Number(e.target.value))}
                  min={10}
                  step={10}
                />
                <span>cm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20">각도:</span>
                <Input
                  type="number"
                  defaultValue={0}
                  onChange={(e) => setWallAngle(Number(e.target.value))}
                  step={15}
                />
                <span>도</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowWallLengthDialog(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={() => {
                    if (wallStartPoint) {
                      createWall({
                        startPoint: wallStartPoint,
                        length: Number(e.target.value),
                        angle: wallAngle,
                      });
                    }
                    setShowWallLengthDialog(false);
                  }}
                >
                  확인
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 방 크기 조절 다이얼로그 */}
      {showRoomSizeDialog && (
        <Dialog open={showRoomSizeDialog} onOpenChange={setShowRoomSizeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>방 크기 조정</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <span className="w-20">가로:</span>
                <Input
                  type="number"
                  defaultValue={400}
                  onChange={(e) => setRoomWidth(Number(e.target.value))}
                  min={100}
                  step={10}
                />
                <span>cm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20">세로:</span>
                <Input
                  type="number"
                  defaultValue={300}
                  onChange={(e) => setRoomHeight(Number(e.target.value))}
                  min={100}
                  step={10}
                />
                <span>cm</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRoomSizeDialog(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={() => {
                    handleRoomSizeChange({
                      width: roomWidth,
                      height: roomHeight,
                    });
                    setShowRoomSizeDialog(false);
                  }}
                >
                  확인
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoomEditor2D;
