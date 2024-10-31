// src/app/3ds/components/room/RoomEditor2D/DefaultRoom.js
import { fabric } from "fabric";
import { EDITOR_CONFIG, OBJECT_TYPES } from "@/app/constants/roomEditor";
import { createFloorPattern } from "./FloorPattern";

export const createDefaultRoom = (canvas, wallHeight) => {
  const floorPattern = createFloorPattern(canvas);

  // 바닥
  const floor = new fabric.Rect({
    left: 0,
    top: 0,
    width: EDITOR_CONFIG.DEFAULT_ROOM_WIDTH,
    height: EDITOR_CONFIG.DEFAULT_ROOM_HEIGHT,
    fill: floorPattern,
    selectable: false,
  });

  // 벽
  const walls = [
    // 위쪽 벽
    new fabric.Rect({
      left: 0,
      top: 0,
      width: EDITOR_CONFIG.DEFAULT_ROOM_WIDTH,
      height: EDITOR_CONFIG.WALL_THICKNESS,
      fill: "#666666",
      lockDelete: true,
      data: { type: OBJECT_TYPES.DEFAULT_WALL, height: wallHeight },
    }),
    // 오른쪽 벽
    new fabric.Rect({
      left: EDITOR_CONFIG.DEFAULT_ROOM_WIDTH - EDITOR_CONFIG.WALL_THICKNESS,
      top: 0,
      width: EDITOR_CONFIG.WALL_THICKNESS,
      height: EDITOR_CONFIG.DEFAULT_ROOM_HEIGHT,
      fill: "#666666",
      lockDelete: true,
      data: { type: OBJECT_TYPES.DEFAULT_WALL, height: wallHeight },
    }),
    // 아래쪽 벽
    new fabric.Rect({
      left: 0,
      top: EDITOR_CONFIG.DEFAULT_ROOM_HEIGHT - EDITOR_CONFIG.WALL_THICKNESS,
      width: EDITOR_CONFIG.DEFAULT_ROOM_WIDTH,
      height: EDITOR_CONFIG.WALL_THICKNESS,
      fill: "#666666",
      lockDelete: true,
      data: { type: OBJECT_TYPES.DEFAULT_WALL, height: wallHeight },
    }),
    // 왼쪽 벽
    new fabric.Rect({
      left: 0,
      top: 0,
      width: EDITOR_CONFIG.WALL_THICKNESS,
      height: EDITOR_CONFIG.DEFAULT_ROOM_HEIGHT,
      fill: "#666666",
      lockDelete: true,
      data: { type: OBJECT_TYPES.DEFAULT_WALL, height: wallHeight },
    }),
  ];

  // 방 그룹 생성
  const roomGroup = new fabric.Group([floor, ...walls], {
    left: 100,
    top: 100,
    selectable: true,
    hasControls: true,
    hasBorders: true,
    lockDelete: true,
    subTargetCheck: true,
    data: { type: OBJECT_TYPES.DEFAULT_ROOM },
    padding: 10,
  });

  canvas.add(roomGroup);
  return roomGroup;
};
