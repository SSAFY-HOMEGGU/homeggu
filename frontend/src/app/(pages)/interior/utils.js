import { fabric } from "fabric";
import {
  DEFAULT_ROOM_WIDTH,
  DEFAULT_ROOM_HEIGHT,
  ROTATION_SNAP,
  GRID_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./config";

export const createDefaultRoom = (canvas) => {
  // 创建木地板图案
  const floorPattern = new fabric.Pattern({
    source: createWoodPattern(),
    repeat: "repeat",
  });

  // 创建地板矩形
  const floor = new fabric.Rect({
    left: 0,
    top: 0,
    width: DEFAULT_ROOM_WIDTH,
    height: DEFAULT_ROOM_HEIGHT,
    fill: floorPattern,
    selectable: true,
  });

  // 创建顶部墙壁
  const topWall = new fabric.Rect({
    left: 0,
    top: 0,
    width: DEFAULT_ROOM_WIDTH,
    height: 10,
    fill: "#95A5A6",
    type: "wall",
    cornerColor: "#2196F3",
    cornerSize: 8,
    transparentCorners: false,
    strokeWidth: 1,
    stroke: "#7F8C8D",
  });

  // 创建底部墙壁
  const bottomWall = new fabric.Rect({
    left: 0,
    top: DEFAULT_ROOM_HEIGHT - 10,
    width: DEFAULT_ROOM_WIDTH,
    height: 10,
    fill: "#95A5A6",
    type: "wall",
    cornerColor: "#2196F3",
    cornerSize: 8,
    transparentCorners: false,
    strokeWidth: 1,
    stroke: "#7F8C8D",
  });

  // 创建左侧墙壁
  const leftWall = new fabric.Rect({
    left: 0,
    top: 0,
    width: 10,
    height: DEFAULT_ROOM_HEIGHT,
    fill: "#95A5A6",
    type: "wall",
    cornerColor: "#2196F3",
    cornerSize: 8,
    transparentCorners: false,
    strokeWidth: 1,
    stroke: "#7F8C8D",
  });

  // 创建右侧墙壁
  const rightWall = new fabric.Rect({
    left: DEFAULT_ROOM_WIDTH - 10,
    top: 0,
    width: 10,
    height: DEFAULT_ROOM_HEIGHT,
    fill: "#95A5A6",
    type: "wall",
    cornerColor: "#2196F3",
    cornerSize: 8,
    transparentCorners: false,
    strokeWidth: 1,
    stroke: "#7F8C8D",
  });

  // 将所有元素组成一个组
  const roomGroup = new fabric.Group(
    [floor, topWall, bottomWall, leftWall, rightWall],
    {
      left: (CANVAS_WIDTH - DEFAULT_ROOM_WIDTH) / 2,
      top: (CANVAS_HEIGHT - DEFAULT_ROOM_HEIGHT) / 2,
      type: "room",
      snapAngle: ROTATION_SNAP,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      subTargetCheck: true,
    }
  );

  // 创建面积文本
  const center = roomGroup.getCenterPoint();
  const initialAreaText = new fabric.Text(
    `${(12).toFixed(2)}m² (${(12 / 3.3058).toFixed(2)}平)`,
    {
      left: center.x,
      top: center.y,
      fontSize: 16,
      fill: "#666666",
      textAlign: "center",
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    }
  );

  // 将元素添加到画布上
  canvas.add(roomGroup);
  canvas.add(initialAreaText);
  return roomGroup;
};

export const createWoodPattern = () => {
  const patternCanvas = document.createElement("canvas");
  const ctx = patternCanvas.getContext("2d");
  patternCanvas.width = 60;
  patternCanvas.height = 300;

  const woodColor1 = "#D4B995";
  const woodColor2 = "#BFA37C";

  ctx.fillStyle = woodColor1;
  ctx.fillRect(0, 0, 60, 300);

  ctx.strokeStyle = woodColor2;
  ctx.lineWidth = 1;

  for (let i = 0; i < 300; i += 30) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(60, i);
    ctx.stroke();
    for (let j = 0; j < 3; j++) {
      const y = i + 5 + j * 8;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(60, y);
      ctx.stroke();
    }
  }

  return patternCanvas;
};
