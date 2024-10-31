// src/app/3ds/components/room/RoomEditor2D/FloorPattern.js
import { fabric } from "fabric";
import { EDITOR_CONFIG } from "@/app/constants/roomEditor";

export const createFloorPattern = (canvas) => {
  const patternCanvas = document.createElement("canvas");
  const ctx = patternCanvas.getContext("2d");
  patternCanvas.width = EDITOR_CONFIG.GRID_SIZE;
  patternCanvas.height = EDITOR_CONFIG.GRID_SIZE;

  // 투명한 배경
  ctx.fillStyle = "rgba(232, 212, 188, 0.5)"; // 반투명한 베이지색
  ctx.fillRect(0, 0, EDITOR_CONFIG.GRID_SIZE, EDITOR_CONFIG.GRID_SIZE);

  // 나뭇결 패턴
  ctx.strokeStyle = "rgba(212, 182, 145, 0.6)"; // 반투명한 나뭇결 색상
  ctx.lineWidth = 1;

  // 대각선 나뭇결
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(EDITOR_CONFIG.GRID_SIZE, EDITOR_CONFIG.GRID_SIZE);
  ctx.stroke();

  // 추가 나뭇결
  ctx.beginPath();
  ctx.moveTo(EDITOR_CONFIG.GRID_SIZE / 2, 0);
  ctx.lineTo(EDITOR_CONFIG.GRID_SIZE, EDITOR_CONFIG.GRID_SIZE / 2);
  ctx.stroke();

  return new fabric.Pattern({
    source: patternCanvas,
    repeat: "repeat",
  });
};
