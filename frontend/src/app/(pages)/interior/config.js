// src/app/(pages)/interior/config.js

import { BedSingle, BedDouble, Armchair, Table2 } from "lucide-react";

// 그리드 및 캔버스 설정 상수
export const GRID_SIZE = 50;           // 1 grid = 0.5m
export const CANVAS_WIDTH = 1200;      // 캔버스 너비
export const CANVAS_HEIGHT = 800;      // 캔버스 높이
export const DEFAULT_ROOM_WIDTH = 400; // 4m = 8 grids
export const DEFAULT_ROOM_HEIGHT = 300; // 3m = 6 grids

// 회전 각도 스냅 설정
export const ROTATION_SNAP = 15;       // 회전 각도를 15도 단위로 스냅

// 가구 설정 (아이콘과 기본 치수 포함)
export const FURNITURE_CONFIG = {
  싱글침대: {
    width: 100,
    height: 200,
    color: "#B19CD9",
    icon: BedSingle,
  },
  더블침대: {
    width: 150,
    height: 200,
    color: "#A390BC",
    icon: BedDouble,
  },
  "2인소파": {
    width: 150,
    height: 75,
    color: "#FFB6C1",
    icon: Armchair,
  },
  "3인소파": {
    width: 200,
    height: 75,
    color: "#FF99AC",
    icon: Armchair,
  },
  식탁: {
    width: 150,
    height: 100,
    color: "#DEB887",
    icon: Table2,
  },
  책상: {
    width: 120,
    height: 60,
    color: "#D4A76A",
    icon: Table2,
  },
  의자: {
    width: 50,
    height: 50,
    color: "#90EE90",
    icon: Armchair,
  },
};

// 나무 패턴 생성 함수
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
