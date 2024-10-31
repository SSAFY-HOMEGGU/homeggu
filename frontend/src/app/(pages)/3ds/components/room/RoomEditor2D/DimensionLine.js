// src/app/3ds/components/room/RoomEditor2D/DimensionLine.js
import { fabric } from "fabric";
import { EDITOR_CONFIG, OBJECT_TYPES, UNITS } from "@/app/constants/roomEditor";

export const createDimensionLine = (canvas, object) => {
  // 기존 치수선 삭제
  canvas.getObjects().forEach((obj) => {
    if (
      obj.data?.type === OBJECT_TYPES.DIMENSION &&
      obj.data?.targetId === object.id
    ) {
      canvas.remove(obj);
    }
  });

  if (
    object.data?.type === OBJECT_TYPES.WALL ||
    object.data?.type === OBJECT_TYPES.DEFAULT_WALL
  ) {
    const width = Math.round(object.width * (100 / EDITOR_CONFIG.GRID_SIZE)); // cm 단위
    const angle = object.angle || 0;
    const center = object.getCenterPoint();
    const offset = 30; // 치수선과 벽 사이 거리

    // 치수선 위치 계산
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const startPoint = {
      x: center.x - (object.width / 2) * cos,
      y: center.y - (object.width / 2) * sin,
    };

    const endPoint = {
      x: center.x + (object.width / 2) * cos,
      y: center.y + (object.width / 2) * sin,
    };

    // 치수선 그룹 생성
    const dimensionLine = new fabric.Group(
      [
        // 메인 라인
        new fabric.Line(
          [
            startPoint.x,
            startPoint.y - offset * sin,
            endPoint.x,
            endPoint.y - offset * sin,
          ],
          {
            stroke: "#666",
            strokeWidth: 1,
          }
        ),
        // 시작점 수직선
        new fabric.Line(
          [
            startPoint.x,
            startPoint.y,
            startPoint.x,
            startPoint.y - offset * sin,
          ],
          {
            stroke: "#666",
            strokeWidth: 1,
          }
        ),
        // 끝점 수직선
        new fabric.Line(
          [endPoint.x, endPoint.y, endPoint.x, endPoint.y - offset * sin],
          {
            stroke: "#666",
            strokeWidth: 1,
          }
        ),
        // 치수 텍스트
        new fabric.Text(`${width}cm`, {
          left: center.x,
          top: center.y - offset - 15,
          fontSize: 12,
          backgroundColor: "white",
          padding: 5,
          originX: "center",
          originY: "center",
        }),
      ],
      {
        selectable: false,
        data: {
          type: OBJECT_TYPES.DIMENSION,
          targetId: object.id,
        },
      }
    );

    canvas.add(dimensionLine);
    canvas.renderAll();
  }
};

export const updateAreaText = (canvas) => {
  const defaultRoom = canvas
    .getObjects()
    .find((obj) => obj.data?.type === OBJECT_TYPES.DEFAULT_ROOM);
  if (!defaultRoom) return;

  // 기존 면적 텍스트 제거
  const existingAreaText = defaultRoom
    .getObjects()
    .find((obj) => obj.data?.type === OBJECT_TYPES.AREA_TEXT);
  if (existingAreaText) {
    defaultRoom.remove(existingAreaText);
  }

  const width = (defaultRoom.width * (100 / EDITOR_CONFIG.GRID_SIZE)) / 100;
  const height = (defaultRoom.height * (100 / EDITOR_CONFIG.GRID_SIZE)) / 100;
  const areaSqM = width * height;
  const areaPyung = areaSqM / UNITS.SQ_METERS_PER_PYEONG;

  const areaText = new fabric.Text(
    `${areaSqM.toFixed(1)}㎡\n(${areaPyung.toFixed(1)}평)`,
    {
      fontSize: 14,
      textAlign: "center",
      backgroundColor: "rgba(255,255,255,0.8)",
      padding: 5,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
      data: { type: OBJECT_TYPES.AREA_TEXT },
      left: defaultRoom.width / 2,
      top: defaultRoom.height / 2,
    }
  );

  // 정확한 중앙 위치 계산
  const center = defaultRoom.getCenterPoint();
  areaText.set({
    left: defaultRoom.width / 2,
    top: defaultRoom.height / 2,
  });

  defaultRoom.addWithUpdate(areaText);
  canvas.renderAll();
};
