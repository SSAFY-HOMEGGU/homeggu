// interior/utils/FloorPlanner.js

import { fabric } from "fabric";
import { wallTypes } from "./catalogItems"; // wallTypes를 가져옵니다.

class Wall {
  constructor(x1, y1, x2, y2, fabricObject) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.fabricObject = fabricObject;
  }
}

class Vertex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = [];
    this.fabricObject = null;
  }

  addWall(wall) {
    if (!this.walls.includes(wall)) {
      this.walls.push(wall);
    }
  }
}

class FloorPlanner {
  getCanvas() {
    return this.canvas;
  }
  constructor(canvasId) {
    this.canvas = new fabric.Canvas(canvasId);
    this.gridVisible = true;
    this.snapToGrid = true;
    this.gridSize = 20; // 1그리드 = 10cm
    this.selectedObject = null;
    this.mode = "select";
    this.isDrawing = false;
    this.drawingObject = null;
    this.startMarker = null;
    this.endMarker = null;
    this.mouseFrom = null;
    this.mouseTo = null;
    this.walls = [];
    this.vertices = [];
    this.rooms = [];
    this.currentWallType = {
      thickness: 10,
      height: 250,
    };
    this.lengthText = null;
    this.isDrawingWall = false;
    this.areaText = null;
    // fabric.Object에 기본 metadata 설정
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        return fabric.util.object.extend(
          toObject.call(this, propertiesToInclude),
          {
            metadata: this.metadata || { type: "unknown" },
          }
        );
      };
    })(fabric.Object.prototype.toObject);

    this.initialize();
  }

  initialize() {
    this.canvas.selection = false;
    this.canvas.preserveObjectStacking = true;
    this.canvas.hoverCursor = "pointer";

    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: "#2196F3",
      cornerColor: "#2196F3",
      cornerStyle: "circle",
      cornerSize: 8,
      padding: 10,
      rotatingPointOffset: 40,
    });

    fabric.Object.prototype.metadata = fabric.Object.prototype.metadata || {
      type: "unknown",
    };

    this.setupEventListeners();
    this.setupDoorWindowPreview(); // 미리보기 설정 추가
    this.createGrid();
  }

  setupWallEvents(wall) {
    if (!wall.fabricObject) return;

    wall.fabricObject.on("moving", (e) => {
      if (this.mode !== "select") return;

      const pointer = this.snapToGrid
        ? this.snapToGridPoint(this.canvas.getPointer(e.e))
        : this.canvas.getPointer(e.e);

      // 이동 거리 계산
      const dx = pointer.x - (wall.x1 + wall.x2) / 2;
      const dy = pointer.y - (wall.y1 + wall.y2) / 2;

      // 벽과 vertex들의 새로운 위치 계산 ...
    });
  }
  setMode(mode) {
    this.mode = mode;
    this.isDrawingWall = false;

    if (mode === "door" || mode === "window") {
      this.canvas.selection = false;
      this.canvas.defaultCursor = "pointer";

      // 벽들을 이벤트 받을 수 있게 설정
      this.walls.forEach((wall) => {
        if (wall.fabricObject) {
          wall.fabricObject.set({
            selectable: false,
            evented: true,
            hoverCursor: "pointer",
          });
        }
      });

      // 문/창문 배치를 위한 클릭 이벤트 설정
      this.canvas.on("mouse:down", this.handleDoorWindowClick.bind(this));

      // 다른 모든 객체 선택 불가능하게 설정
      this.canvas.forEachObject((obj) => {
        if (!obj.isGrid && !obj.isWall) {
          obj.selectable = false;
          obj.evented = false;
        }
      });
    }

    if (mode === "select") {
      this.canvas.selection = true;

      // 모든 벽을 선택 가능하게 설정
      this.walls.forEach((wall) => {
        if (wall.fabricObject) {
          wall.fabricObject.set({
            selectable: true,
            evented: true,
            hasControls: false,
            hasBorders: true,
            hoverCursor: "move",
          });
        }
      });

      // vertex는 초기에 숨김
      this.vertices.forEach((vertex) => {
        if (vertex.fabricObject) {
          vertex.fabricObject.set({
            selectable: true,
            evented: true,
            visible: false,
          });
        }
      });

      // 방은 선택 불가능하게
      this.rooms.forEach((room) => {
        room.set({
          selectable: false,
          evented: true,
        });
      });
    } else if (mode === "wall") {
      this.canvas.selection = false;
      this.canvas.discardActiveObject();

      // 모든 벽을 선택 불가능하게 설정
      this.walls.forEach((wall) => {
        if (wall.fabricObject) {
          wall.fabricObject.set({
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            hoverCursor: "default",
          });
        }
      });

      // vertex 숨김 및 비활성화
      this.vertices.forEach((vertex) => {
        if (vertex.fabricObject) {
          vertex.fabricObject.set({
            selectable: false,
            evented: false,
            visible: false,
          });
        }
      });
    }

    this.canvas.renderAll();
  }

  snapToGridPoint(point) {
    if (!this.snapToGrid) return point;
    return {
      x: Math.round(point.x / this.gridSize) * this.gridSize,
      y: Math.round(point.y / this.gridSize) * this.gridSize,
    };
  }

  toggleGrid() {
    this.gridVisible = !this.gridVisible;
    if (this.gridVisible) {
      this.createGrid();
    } else {
      const gridLines = this.canvas.getObjects().filter((obj) => obj.isGrid);
      gridLines.forEach((line) => this.canvas.remove(line));
    }
    this.canvas.renderAll();
  }
  handleMouseDown(e) {
    if (e.e.button === 2) return; // 우클릭 무시
    if (this.mode !== "wall") return; // wall 모드가 아니면 리턴

    // 현재 선택된 객체가 있다면 선택 해제
    this.canvas.discardActiveObject();

    // wall 모드일 때는 모든 기존 벽의 이벤트를 완전히 차단
    this.walls.forEach((wall) => {
      if (wall.fabricObject) {
        wall.fabricObject.set({
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
        });
      }
    });

    this.vertices.forEach((vertex) => {
      if (vertex.fabricObject) {
        vertex.fabricObject.set({
          selectable: false,
          evented: false,
          visible: false,
        });
      }
    });

    this.isDrawingWall = true;
    this.isDrawing = true;

    const pointer = this.canvas.getPointer(e.e);
    const snappedPoint = this.snapToGrid
      ? this.snapToGridPoint(pointer)
      : pointer;
    this.mouseFrom = { x: snappedPoint.x, y: snappedPoint.y };

    // 시작점 마커를 더 눈에 띄게 수정
    this.startMarker = new fabric.Circle({
      left: snappedPoint.x,
      top: snappedPoint.y,
      radius: 6,
      fill: "#2196F3",
      stroke: "#ffffff",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
      hoverCursor: "default",
    });

    // 끝점 마커도 동일하게 수정
    this.endMarker = new fabric.Circle({
      left: snappedPoint.x,
      top: snappedPoint.y,
      radius: 6,
      fill: "#2196F3",
      stroke: "#ffffff",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
      hoverCursor: "default",
    });

    // 그리는 중인 벽
    this.drawingObject = new fabric.Line(
      [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
      {
        stroke: "#7D7D7D",
        strokeWidth: 5,
        selectable: false,
        evented: false,
        hoverCursor: "default",
      }
    );

    // 길이 표시 텍스트
    this.lengthText = new fabric.Text("0 cm", {
      left: snappedPoint.x,
      top: snappedPoint.y - 20,
      fontSize: 14,
      fill: "#000",
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
      backgroundColor: "rgba(255,255,255,0.8)",
    });

    this.canvas.add(this.startMarker);
    this.canvas.add(this.endMarker);
    this.canvas.add(this.drawingObject);
    this.canvas.add(this.lengthText);

    // 캔버스의 모든 객체에 대해 이벤트 비활성화
    this.canvas.forEachObject((obj) => {
      if (
        obj !== this.startMarker &&
        obj !== this.endMarker &&
        obj !== this.drawingObject &&
        obj !== this.lengthText
      ) {
        obj.evented = false;
        obj.selectable = false;
        obj.hoverCursor = "default";
      }
    });

    this.canvas.renderAll();
  }

  handleMouseWheel(opt) {
    const delta = opt.e.deltaY;
    let zoom = this.canvas.getZoom();
    zoom *= 0.999 ** delta;
    zoom = Math.min(20, Math.max(0.5, zoom));

    // 마우스 포인터 위치를 기준으로 줌
    this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

    // 줌 레벨이 변경될 때마다 그리드 업데이트
    this.createGrid();

    opt.e.preventDefault();
    opt.e.stopPropagation();
  }

  handleMouseMove(e) {
    if (!this.isDrawing || this.mode !== "wall") return;

    const pointer = this.canvas.getPointer(e.e);
    const snappedPoint = this.snapToGrid
      ? this.snapToGridPoint(pointer)
      : pointer;
    this.mouseTo = { x: snappedPoint.x, y: snappedPoint.y };

    if (this.drawingObject) {
      this.drawingObject.set({
        x2: snappedPoint.x,
        y2: snappedPoint.y,
      });
    }

    if (this.endMarker) {
      this.endMarker.set({
        left: snappedPoint.x,
        top: snappedPoint.y,
      });
    }

    if (this.lengthText && this.mouseFrom) {
      const length = Math.sqrt(
        Math.pow(snappedPoint.x - this.mouseFrom.x, 2) +
          Math.pow(snappedPoint.y - this.mouseFrom.y, 2)
      );

      // 1 그리드 = 10cm
      const lengthInCm = ((length / this.gridSize) * 10).toFixed(2);
      this.lengthText.set({
        text: `${lengthInCm} cm`,
        left: (this.mouseFrom.x + snappedPoint.x) / 2,
        top: (this.mouseFrom.y + snappedPoint.y) / 2 - 20,
      });
    }

    this.canvas.renderAll();
  }

  handleMouseUp() {
    if (!this.isDrawing) return;

    if (this.isDrawing && this.mouseFrom && this.mouseTo) {
      const length = Math.sqrt(
        Math.pow(this.mouseTo.x - this.mouseFrom.x, 2) +
          Math.pow(this.mouseTo.y - this.mouseFrom.y, 2)
      );

      if (length >= this.gridSize) {
        this.createWall(this.mouseFrom, this.mouseTo);
      }
    }

    // 그리기 관련 객체들 제거
    [
      this.drawingObject,
      this.startMarker,
      this.endMarker,
      this.lengthText,
    ].forEach((obj) => {
      if (obj) this.canvas.remove(obj);
    });

    // 상태 초기화
    this.isDrawing = false;
    this.isDrawingWall = false;
    this.drawingObject = null;
    this.startMarker = null;
    this.endMarker = null;
    this.lengthText = null;
    this.mouseFrom = null;
    this.mouseTo = null;

    // wall 모드일 때는 계속해서 다른 객체들의 이벤트를 비활성화 상태로 유지
    if (this.mode === "wall") {
      this.canvas.forEachObject((obj) => {
        if (!obj.isGrid) {
          // 그리드 제외
          obj.evented = false;
          obj.selectable = false;
          obj.hoverCursor = "default";
        }
      });
    }

    this.canvas.renderAll();
  }

  handleObjectMoving(e) {
    const obj = e.target;
    if (obj.type !== "furniture-group") return;

    const tolerance = 10; // 스냅 거리 허용 범위
    const objectCorners = this.getObjectCorners(obj);

    let closestSnapPoint = null;
    let minDistance = Infinity;

    // 각 벽 선분에 대해 가장 가까운 스냅 포인트 찾기
    this.walls.forEach((wall) => {
      const wallPoints = [
        { x: wall.x1, y: wall.y1 },
        { x: wall.x2, y: wall.y2 },
      ];

      objectCorners.forEach((corner) => {
        wallPoints.forEach((wallPoint) => {
          const distance = Math.sqrt(
            Math.pow(corner.x - wallPoint.x, 2) +
              Math.pow(corner.y - wallPoint.y, 2)
          );

          if (distance < minDistance && distance <= tolerance) {
            minDistance = distance;
            closestSnapPoint = {
              objectCorner: corner,
              wallSnapPoint: wallPoint,
            };
          }
        });
      });
    });

    // 가장 가까운 스냅 포인트가 있을 경우, 가구의 해당 모서리를 벽의 모서리에 맞추기
    if (closestSnapPoint) {
      const dx =
        closestSnapPoint.wallSnapPoint.x - closestSnapPoint.objectCorner.x;
      const dy =
        closestSnapPoint.wallSnapPoint.y - closestSnapPoint.objectCorner.y;

      obj.left += dx;
      obj.top += dy;
    }

    this.canvas.renderAll();
  }

  getClosestPointOnLine(lineStart, lineEnd, point) {
    const { x: x1, y: y1 } = lineStart;
    const { x: x2, y: y2 } = lineEnd;
    const { x: px, y: py } = point;

    const lineLengthSquared = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);

    if (lineLengthSquared === 0) {
      return { x: x1, y: y1 };
    }

    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t));

    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1),
    };
  }

  getObjectCorners(obj) {
    const angle = fabric.util.degreesToRadians(obj.angle);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const halfWidth = obj.width / 2;
    const halfHeight = obj.height / 2;

    const centerX = obj.left;
    const centerY = obj.top;

    return [
      {
        x: centerX - halfWidth * cos - halfHeight * sin,
        y: centerY - halfWidth * sin + halfHeight * cos,
      },
      {
        x: centerX + halfWidth * cos - halfHeight * sin,
        y: centerY + halfWidth * sin + halfHeight * cos,
      },
      {
        x: centerX - halfWidth * cos + halfHeight * sin,
        y: centerY - halfWidth * sin - halfHeight * cos,
      },
      {
        x: centerX + halfWidth * cos + halfHeight * sin,
        y: centerY + halfWidth * sin - halfHeight * cos,
      },
    ];
  }

  handleDoorWindowClick(event) {
    if (this.mode !== "door" && this.mode !== "window") return;

    const pointer = this.canvas.getPointer(event.e);
    const wallInfo = this.findWallUnderPoint(pointer);

    if (wallInfo) {
      // 미리보기 제거
      if (this.previewObject) {
        this.canvas.remove(this.previewObject);
        this.previewObject = null;
      }

      if (this.mode === "door") {
        this.addDoor(wallInfo);
      } else {
        this.addWindow(wallInfo);
      }
    }
  }

  findWallUnderPoint(pointer) {
    for (const wall of this.walls) {
      const dx = wall.x2 - wall.x1;
      const dy = wall.y2 - wall.y1;
      const wallLength = Math.sqrt(dx * dx + dy * dy);

      // 점과 벽 사이의 수직 거리 계산
      const distance = Math.abs(
        (dy * pointer.x -
          dx * pointer.y +
          wall.x2 * wall.y1 -
          wall.y2 * wall.x1) /
          wallLength
      );

      // 점이 벽의 시작점에서 끝점 사이에 있는지 확인
      const dot = (pointer.x - wall.x1) * dx + (pointer.y - wall.y1) * dy;
      const t = Math.max(0, Math.min(1, dot / (wallLength * wallLength)));

      // 벽과의 거리가 10px 이내이고, 점이 벽 선분 위에 있는 경우
      if (distance < 10 && t >= 0 && t <= 1) {
        // 벽 위의 정확한 위치 계산 (중앙에 배치하기 위해)
        const x = wall.x1 + t * dx;
        const y = wall.y1 + t * dy;

        // 벽의 방향과 각도 계산
        const wallAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const normalizedDx = dx / wallLength;
        const normalizedDy = dy / wallLength;

        return {
          wall,
          position: { x, y },
          angle: wallAngle,
          direction: { x: normalizedDx, y: normalizedDy },
          t: t,
        };
      }
    }
    return null;
  }

  addDoor(wallInfo) {
    if (!wallInfo || !wallInfo.position) return;

    const doorWidth = 60;
    const doorThickness = this.currentWallType.thickness + 2;

    // 문 객체 생성
    const doorRect = new fabric.Rect({
      width: doorWidth,
      height: doorThickness,
      fill: "#8B4513",
      stroke: "#000000",
      strokeWidth: 1,
      originX: "center",
      originY: "center",
    });

    const swingLine = new fabric.Path(
      `M ${-doorWidth / 2} ${
        -doorThickness / 2
      } A ${doorWidth} ${doorWidth} 0 0 1 ${doorWidth / 2} ${
        -doorThickness / 2
      }`,
      {
        stroke: "#000000",
        fill: "transparent",
        strokeWidth: 1,
        originX: "center",
        originY: "center",
      }
    );

    const doorGroup = new fabric.Group([doorRect, swingLine], {
      left: wallInfo.position.x,
      top: wallInfo.position.y,
      angle: wallInfo.angle,
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      type: "door",
      is3DRotated: wallInfo.is3DRotated, // 3D 회전 정보 저장
      wallDirection: wallInfo.direction, // 벽 방향 정보 저장
    });

    this.canvas.add(doorGroup);
    this.canvas.renderAll();
    return doorGroup;
  }

  // createDoorShape 메서드 추가
  createDoorShape(width, thickness, wallInfo) {
    // 문 프레임
    const frame = new fabric.Rect({
      width: width,
      height: thickness,
      fill: "#8B4513",
      stroke: "#000000",
      strokeWidth: 1,
      originX: "center",
      originY: "center",
    });

    // 문 스윙 라인 (호)
    const swingPath = new fabric.Path(
      `M ${-width / 2} ${-thickness / 2} A ${width} ${width} 0 0 1 ${
        width / 2
      } ${-thickness / 2}`,
      {
        fill: "transparent",
        stroke: "#000000",
        strokeWidth: 1,
        originX: "center",
        originY: "center",
      }
    );

    // 문 그룹 생성
    return new fabric.Group([frame, swingPath], {
      originX: "center",
      originY: "center",
    });
  }

  // 창문 추가
  addWindow(wallInfo) {
    if (!wallInfo || !wallInfo.position) return;

    const windowWidth = 40;
    const windowThickness = this.currentWallType.thickness + 2;

    const windowRect = new fabric.Rect({
      width: windowWidth,
      height: windowThickness,
      fill: "rgba(135, 206, 235, 0.5)",
      stroke: "#000000",
      strokeWidth: 1,
      originX: "center",
      originY: "center",
    });

    const centerLine = new fabric.Line(
      [0, -windowThickness / 2, 0, windowThickness / 2],
      {
        stroke: "#000000",
        strokeWidth: 1,
        originX: "center",
        originY: "center",
      }
    );

    const windowGroup = new fabric.Group([windowRect, centerLine], {
      left: wallInfo.position.x,
      top: wallInfo.position.y,
      angle: wallInfo.angle,
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      type: "window",
      is3DRotated: wallInfo.is3DRotated, // 3D 회전 정보 저장
      wallDirection: wallInfo.direction, // 벽 방향 정보 저장
    });

    this.canvas.add(windowGroup);
    this.canvas.renderAll();
    return windowGroup;
  }

  // createWindowShape 메서드 추가
  createWindowShape(width, thickness) {
    // 창문 프레임
    const frame = new fabric.Rect({
      width: width,
      height: thickness,
      fill: "rgba(135, 206, 235, 0.5)",
      stroke: "#000000",
      strokeWidth: 1,
      originX: "center",
      originY: "center",
    });

    // 창문 디테일 (선)
    const verticalLine = new fabric.Line(
      [0, -thickness / 2, 0, thickness / 2],
      {
        stroke: "#000000",
        strokeWidth: 1,
        originX: "center",
        originY: "center",
      }
    );

    // 창문 그룹 생성
    return new fabric.Group([frame, verticalLine], {
      originX: "center",
      originY: "center",
    });
  }

  placeDoor(placement) {
    const doorWidth = 60;
    const doorThickness = placement.wallThickness;

    const frame = new fabric.Rect({
      width: doorWidth,
      height: doorThickness,
      fill: "#8B4513",
      stroke: "#000000",
      strokeWidth: 1,
    });

    const swingPath = new fabric.Path(
      `M ${-doorWidth / 2} ${
        -doorThickness / 2
      } A ${doorWidth} ${doorWidth} 0 0 1 ${doorWidth / 2} ${
        -doorThickness / 2
      }`,
      {
        fill: "transparent",
        stroke: "#000000",
        strokeWidth: 1,
      }
    );

    const door = new fabric.Group([frame, swingPath], {
      left: placement.x,
      top: placement.y,
      angle: placement.angle,
      originX: "center",
      originY: "center",
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      type: "door",
    });

    this.canvas.add(door);
    this.canvas.renderAll();
  }

  placeWindow(placement) {
    const windowWidth = 40;
    const windowHeight = placement.wallThickness;

    const window = new fabric.Rect({
      left: placement.x,
      top: placement.y,
      angle: placement.angle,
      width: windowWidth,
      height: windowHeight,
      fill: "rgba(135, 206, 235, 0.5)",
      stroke: "#000000",
      strokeWidth: 1,
      originX: "center",
      originY: "center",
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      type: "window",
    });

    this.canvas.add(window);
    this.canvas.renderAll();
  }

  // 문/창문 배치 처리
  handleDoorWindowPlacement(event) {
    if (this.mode !== "door" && this.mode !== "window") return;

    const pointer = this.canvas.getPointer(event.e);
    const wallInfo = this.findWallUnderPoint(pointer);

    if (wallInfo) {
      if (this.mode === "door") {
        this.addDoor(wallInfo);
      } else {
        this.addWindow(wallInfo);
      }
    }
  }

  calculatePlacementOnWall(wallInfo, pointer) {
    const { wall, angle } = wallInfo;

    // 벽 위의 위치 계산
    const x = wall.x1 + (wall.x2 - wall.x1) * wallInfo.t;
    const y = wall.y1 + (wall.y2 - wall.y1) * wallInfo.t;

    return {
      x,
      y,
      angle,
      wallThickness: this.currentWallType.thickness,
    };
  }

  // 벽 아래의 점 찾기 메서드 업데이트
  findWallUnderPoint(pointer) {
    for (const wall of this.walls) {
      const dx = wall.x2 - wall.x1;
      const dy = wall.y2 - wall.y1;
      const wallLength = Math.sqrt(dx * dx + dy * dy);

      // 점과 벽 사이의 수직 거리 계산
      const distance = Math.abs(
        (dy * pointer.x -
          dx * pointer.y +
          wall.x2 * wall.y1 -
          wall.y2 * wall.x1) /
          wallLength
      );

      // 점이 벽의 시작점에서 끝점 사이에 있는지 확인
      const dot = (pointer.x - wall.x1) * dx + (pointer.y - wall.y1) * dy;
      const t = Math.max(0, Math.min(1, dot / (wallLength * wallLength)));

      if (distance < 10 && t >= 0 && t <= 1) {
        // 벽 위의 정확한 위치 계산
        const x = wall.x1 + t * dx;
        const y = wall.y1 + t * dy;

        // 벽의 방향 계산
        const wallAngle = wall.fabricObject.angle;

        // 3D 변환을 위한 방향 정보 추가
        const direction = {
          x: dx / wallLength,
          y: dy / wallLength,
        };

        // 벽의 방향에 따른 3D 회전 각도 결정
        const is3DRotated = Math.abs(Math.abs(wallAngle) - 90) < 1; // 벽이 Y축과 평행한지 확인

        return {
          wall,
          position: { x, y },
          angle: wallAngle,
          direction,
          is3DRotated,
          t: t,
          thickness: this.currentWallType.thickness,
        };
      }
    }
    return null;
  }

  // 포인트가 벽 근처에 있는지 확인
  isPointNearWall(point, wall) {
    const tolerance = 10; // 허용 오차 (픽셀)

    // 벽의 시작점과 끝점
    const p1 = { x: wall.x1, y: wall.y1 };
    const p2 = { x: wall.x2, y: wall.y2 };

    // 점과 선분 사이의 거리 계산
    const distance = this.pointToLineDistance(point, p1, p2);

    // 거리가 허용 오차 이내이고, 점이 선분의 범위 안에 있는지 확인
    return (
      distance <= tolerance && this.isPointWithinLineSegment(point, p1, p2)
    );
  }

  // 벽에 맞춘 배치 위치 계산
  getWallPlacementPoint(wall, point) {
    // 벽의 방향 벡터 계산
    const dx = wall.x2 - wall.x1;
    const dy = wall.y2 - wall.y1;
    const angle = Math.atan2(dy, dx);

    // 벽에 수직으로 투영된 점 찾기
    const projectedPoint = this.projectPointOnLine(
      point,
      { x: wall.x1, y: wall.y1 },
      { x: wall.x2, y: wall.y2 }
    );

    return {
      x: projectedPoint.x,
      y: projectedPoint.y,
      angle: (angle * 180) / Math.PI,
    };
  }

  // 보조 함수들
  pointToLineDistance(point, lineStart, lineEnd) {
    const numerator = Math.abs(
      (lineEnd.y - lineStart.y) * point.x -
        (lineEnd.x - lineStart.x) * point.y +
        lineEnd.x * lineStart.y -
        lineEnd.y * lineStart.x
    );

    const denominator = Math.sqrt(
      Math.pow(lineEnd.y - lineStart.y, 2) +
        Math.pow(lineEnd.x - lineStart.x, 2)
    );

    return numerator / denominator;
  }

  isPointWithinLineSegment(point, lineStart, lineEnd) {
    const dotProduct =
      ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) +
        (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) /
      (Math.pow(lineEnd.x - lineStart.x, 2) +
        Math.pow(lineEnd.y - lineStart.y, 2));

    return dotProduct >= 0 && dotProduct <= 1;
  }

  projectPointOnLine(point, lineStart, lineEnd) {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const dotProduct =
      ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) /
      (dx * dx + dy * dy);

    return {
      x: lineStart.x + dotProduct * dx,
      y: lineStart.y + dotProduct * dy,
    };
  }

  createWall(from, to) {
    if (!from || !to) return;

    // 새로운 벽의 시작점과 끝점
    let currentStart = { x: from.x, y: from.y };
    let currentEnd = { x: to.x, y: to.y };

    // 기존 벽들과의 교차점 확인
    const intersections = this.findWallIntersections(currentStart, currentEnd);

    if (intersections.length > 0) {
      // 교차점들을 시작점에서 끝점 순서로 정렬
      intersections.sort((a, b) => {
        const distA =
          Math.pow(a.x - currentStart.x, 2) + Math.pow(a.y - currentStart.y, 2);
        const distB =
          Math.pow(b.x - currentStart.x, 2) + Math.pow(b.y - currentStart.y, 2);
        return distA - distB;
      });

      // 시작점부터 각 교차점까지, 그리고 마지막 교차점부터 끝점까지 벽 생성
      let prevPoint = currentStart;

      // 각 교차점에 대해 벽 생성
      for (const intersection of intersections) {
        this.createWallSegment(prevPoint, intersection);
        prevPoint = intersection;
      }

      // 마지막 교차점에서 끝점까지 벽 생성
      this.createWallSegment(prevPoint, currentEnd);
    } else {
      // 교차점이 없는 경우 단일 벽 생성
      this.createWallSegment(currentStart, currentEnd);
    }

    this.updateVertexControls();
    this.checkAndCreateRoom();
  }

  findWallIntersections(start, end) {
    const intersections = [];
    const tolerance = 0.1; // 수치 오차를 위한 허용 범위

    this.walls.forEach((wall) => {
      const intersection = this.lineIntersection(
        start.x,
        start.y,
        end.x,
        end.y,
        wall.x1,
        wall.y1,
        wall.x2,
        wall.y2,
        tolerance
      );

      if (intersection && this.isPointOnLine(intersection, wall)) {
        // 이미 존재하는 vertex와 가까운 경우, 해당 vertex 위치 사용
        const existingVertex = this.findNearestVertex(
          intersection.x,
          intersection.y
        );
        if (existingVertex) {
          intersection.x = existingVertex.x;
          intersection.y = existingVertex.y;
        }

        // 중복 교차점 제거
        if (
          !intersections.some(
            (p) =>
              Math.abs(p.x - intersection.x) < tolerance &&
              Math.abs(p.y - intersection.y) < tolerance
          )
        ) {
          intersections.push(intersection);
        }
      }
    });

    return intersections;
  }

  lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4, tolerance) {
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    if (Math.abs(denominator) < tolerance) return null;

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // 선분 내부에 교차점이 있는지 확인
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;

    const x = x1 + ua * (x2 - x1);
    const y = y1 + ua * (y2 - y1);

    return { x, y };
  }

  isPointOnLine(point, wall) {
    const tolerance = 0.1;

    // 점이 선분 위에 있는지 확인
    const d1 = Math.sqrt(
      Math.pow(point.x - wall.x1, 2) + Math.pow(point.y - wall.y1, 2)
    );
    const d2 = Math.sqrt(
      Math.pow(point.x - wall.x2, 2) + Math.pow(point.y - wall.y2, 2)
    );
    const lineLength = Math.sqrt(
      Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
    );

    return Math.abs(d1 + d2 - lineLength) < tolerance;
  }

  findNearestVertex(x, y, maxDistance = 5) {
    return this.vertices.find((vertex) => {
      const dx = Math.abs(vertex.x - x);
      const dy = Math.abs(vertex.y - y);
      return dx < maxDistance && dy < maxDistance;
    });
  }

  createVertexControl(vertex) {
    const vertexControl = new fabric.Circle({
      left: vertex.x,
      top: vertex.y,
      radius: 6,
      fill: "#2196F3",
      stroke: "#fff",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      selectable: true,
      evented: true,
      visible: false, // 초기에는 숨김
      isVertex: true,
      hoverCursor: "move",
    });

    vertex.fabricObject = vertexControl;

    // vertex 이동 이벤트 처리
    vertexControl.on("moving", (e) => {
      if (this.isDrawingWall) return false;

      const pointer = this.snapToGrid
        ? this.snapToGridPoint(this.canvas.getPointer(e.e))
        : this.canvas.getPointer(e.e);

      vertexControl.set({
        left: pointer.x,
        top: pointer.y,
      });

      // 이 vertex와 연결된 모든 벽 업데이트
      vertex.walls.forEach((wall) => {
        this.updateWallPosition(wall, vertex, pointer);
      });

      // 방도 함께 업데이트
      this.updateRooms();
      this.canvas.renderAll();
    });

    return vertexControl;
  }

  createRoom(points) {
    const uniquePoints = points.filter(
      (point, index, self) =>
        self.findIndex((p) => this.arePointsClose(p, point)) === index
    );

    if (uniquePoints.length < 3) return;

    const room = new fabric.Polygon(uniquePoints, {
      fill: "rgba(245, 222, 179, 0.3)",
      stroke: "transparent",
      selectable: false,
      evented: true,
      isRoom: true,
      objectCaching: false,
    });

    room.points = uniquePoints; // 면적 계산을 위해 points 저장

    // 방 클릭 시 모든 방의 면적 표시
    room.on("mousedown", () => {
      if (this.mode === "select") {
      }
    });

    this.rooms.push(room);
    this.canvas.add(room);
    this.canvas.sendToBack(room);

    // 그리드는 방보다 더 뒤로
    this.canvas
      .getObjects()
      .filter((obj) => obj.isGrid)
      .forEach((grid) => this.canvas.sendToBack(grid));

    this.displayRoomArea(room); // 개별 방의 면적 표시
  }

  displayRoomArea(room) {
    // 기존 면적 텍스트가 있다면 제거
    if (room.areaText) {
      this.canvas.remove(room.areaText);
      room.areaText = null;
    }

    const areaInGridUnits = this.calculatePolygonArea(room.points);
    const areaInSquareMeters = areaInGridUnits * 0.01 * 0.01; // 1그리드 = 10cm
    const areaInPyeong = areaInSquareMeters / 3.3;

    // 방의 중심점 계산
    const points = room.points;
    let centerX = 0;
    let centerY = 0;

    for (let i = 0; i < points.length; i++) {
      centerX += points[i].x;
      centerY += points[i].y;
    }

    centerX /= points.length;
    centerY /= points.length;

    const areaText = new fabric.Text(
      `${areaInSquareMeters.toFixed(2)}m² (${areaInPyeong.toFixed(1)}평)`,
      {
        left: centerX,
        top: centerY,
        fontSize: 16,
        fill: "#000",
        selectable: false,
        originX: "center",
        originY: "center",
        roomId: room.id,
      }
    );

    room.areaText = areaText;
    this.canvas.add(areaText);
    this.canvas.renderAll();
  }

  clearAllAreaTexts() {
    this.rooms.forEach((room) => {
      if (room.areaText) {
        this.canvas.remove(room.areaText);
        room.areaText = null;
      }
    });
  }

  calculatePolygonArea(points) {
    if (!points || points.length < 3) return 0;

    let area = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].x * points[j].y - points[j].x * points[i].y;
    }

    // 그리드 크기를 고려한 실제 면적 계산 (1그리드 = 10cm)
    const realArea = Math.abs(area / 2);
    return (realArea / (this.gridSize * this.gridSize)) * 100; // cm² 단위로 변환
  }

  findOrCreateVertex(x, y, tolerance = 5) {
    let vertex = this.vertices.find(
      (v) => Math.abs(v.x - x) < tolerance && Math.abs(v.y - y) < tolerance
    );

    if (!vertex) {
      vertex = new Vertex(x, y);
      this.createVertexControl(vertex);
      this.vertices.push(vertex);
    }

    return vertex;
  }

  updateWallPosition(wall, movedVertex, newPosition) {
    const isStart = wall.startVertex === movedVertex;

    if (isStart) {
      wall.x1 = newPosition.x;
      wall.y1 = newPosition.y;
    } else {
      wall.x2 = newPosition.x;
      wall.y2 = newPosition.y;
    }

    const centerX = (wall.x1 + wall.x2) / 2;
    const centerY = (wall.y1 + wall.y2) / 2;
    const length = Math.sqrt(
      Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
    );
    const angle =
      (Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1) * 180) / Math.PI;

    wall.fabricObject.set({
      left: centerX,
      top: centerY,
      width: length,
      angle: angle,
    });
  }

  updateVerticesState() {
    this.vertices.forEach((vertex) => {
      if (vertex.fabricObject) {
        const isActive = this.mode === "select" && !this.isDrawingWall;
        vertex.fabricObject.selectable = isActive;
        vertex.fabricObject.evented = isActive;
      }
    });
  }

  updateVertexControls() {
    this.vertices.forEach((vertex) => {
      if (vertex.fabricObject) {
        this.canvas.bringToFront(vertex.fabricObject);
      }
    });
  }

  updateRooms() {
    // 모든 방과 면적 텍스트 제거
    this.rooms.forEach((room) => {
      if (room.areaText) {
        this.canvas.remove(room.areaText);
      }
      this.canvas.remove(room);
    });
    this.rooms = [];

    // 방 다시 생성 (면적 텍스트도 함께 생성됨)
    this.checkAndCreateRoom();
  }
  checkAndCreateRoom() {
    const nodes = new Map();

    // 모든 벽의 끝점들과 연결 정보 수집
    this.walls.forEach((wall) => {
      const start = this.pointToString({ x: wall.x1, y: wall.y1 });
      const end = this.pointToString({ x: wall.x2, y: wall.y2 });

      if (!nodes.has(start)) {
        nodes.set(start, new Set());
      }
      nodes.get(start).add(end);

      if (!nodes.has(end)) {
        nodes.set(end, new Set());
      }
      nodes.get(end).add(start);
    });

    // 기존 방들과 면적 텍스트 제거
    this.rooms.forEach((room) => {
      if (room.areaText) {
        this.canvas.remove(room.areaText);
      }
      this.canvas.remove(room);
    });
    this.rooms = [];

    // 닫힌 경로 찾기
    const allPaths = this.findClosedPaths(nodes);

    // 최소한의 독립적인 방 찾기
    const independentRooms = this.findIndependentRooms(allPaths);

    // 독립적인 방들만 생성
    independentRooms.forEach((path) => {
      this.createRoom(path);
    });

    if (this.mode === "select") {
      this.walls.forEach((wall) => {
        if (wall.fabricObject) {
          wall.fabricObject.set({
            selectable: true,
            evented: true,
            hasControls: false,
            hasBorders: true,
            hoverCursor: "move",
          });
        }
      });
    }

    this.canvas.renderAll();
  }

  // 독립적인 방들을 찾는 새로운 메서드
  findIndependentRooms(paths) {
    if (paths.length === 0) return [];

    // 면적을 기준으로 경로들을 정렬 (작은 것부터)
    const sortedPaths = paths
      .map((path) => ({
        path,
        area: this.calculatePolygonArea(path),
      }))
      .sort((a, b) => a.area - b.area);

    const independentRooms = [];
    const usedPoints = new Set();

    // 각 경로에 대해
    for (const { path } of sortedPaths) {
      // 이 경로의 모든 점이 이미 사용되었는지 확인
      const pathPoints = path.map((p) => this.pointToString(p));
      const isSubset = pathPoints.every((point) => usedPoints.has(point));

      // 이미 다른 방에 포함된 경로라면 스킵
      if (isSubset) continue;

      // 독립적인 방으로 인정하고 포인트들을 사용된 것으로 표시
      independentRooms.push(path);
      pathPoints.forEach((point) => usedPoints.add(point));
    }

    return independentRooms;
  }

  findClosedPaths(nodes) {
    const paths = [];
    const visited = new Set();

    for (const [startNode] of nodes) {
      if (!visited.has(startNode)) {
        this.findPathsFromNode(
          startNode,
          startNode,
          [startNode],
          nodes,
          new Set([startNode]),
          paths
        );
      }
    }

    return paths.map((path) =>
      path.map((pointStr) => {
        const [x, y] = pointStr.split(",").map(Number);
        return { x, y };
      })
    );
  }

  findPathsFromNode(
    startNode,
    currentNode,
    currentPath,
    nodes,
    visited,
    paths
  ) {
    const neighbors = nodes.get(currentNode);
    if (!neighbors) return;

    for (const neighbor of neighbors) {
      if (neighbor === startNode && currentPath.length > 2) {
        paths.push([...currentPath]);
        continue;
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        currentPath.push(neighbor);
        this.findPathsFromNode(
          startNode,
          neighbor,
          currentPath,
          nodes,
          visited,
          paths
        );
        currentPath.pop();
        visited.delete(neighbor);
      }
    }
  }

  isPathAlreadyRoom(path) {
    if (!path || path.length < 3) return false;

    return this.rooms.some((room) => {
      if (room.points.length !== path.length) return false;
      return path.every((pathPoint) =>
        room.points.some((roomPoint) =>
          this.arePointsClose(pathPoint, roomPoint)
        )
      );
    });
  }

  arePointsClose(p1, p2, tolerance = 1) {
    if (!p1 || !p2) return false;
    const dx = Math.abs(p1.x - p2.x);
    const dy = Math.abs(p1.y - p2.y);
    return dx < tolerance && dy < tolerance;
  }

  pointToString(point) {
    return `${point.x},${point.y}`;
  }

  clearAreaText() {
    if (this.areaText) {
      this.canvas.remove(this.areaText);
      this.areaText = null;
    }
  }

  createGrid() {
    if (!this.gridVisible) return;

    const existingGrid = this.canvas.getObjects().filter((obj) => obj.isGrid);
    existingGrid.forEach((obj) => this.canvas.remove(obj));

    // 현재 zoom level 가져오기
    const zoom = this.canvas.getZoom();

    // viewport의 실제 크기 계산
    const vpt = this.canvas.viewportTransform;
    const viewportWidth = this.canvas.width / zoom;
    const viewportHeight = this.canvas.height / zoom;

    // 보이는 영역의 좌상단 좌표
    const startX = -vpt[4] / zoom;
    const startY = -vpt[5] / zoom;

    // 그리드 확장 영역 계산 (여유 공간 추가)
    const extraSpace = 1000; // 픽셀 단위
    const totalWidth = viewportWidth + extraSpace;
    const totalHeight = viewportHeight + extraSpace;

    // 그리드 시작점 조정 (음수 영역 포함)
    const gridStartX =
      Math.floor(startX / this.gridSize) * this.gridSize - extraSpace / 2;
    const gridStartY =
      Math.floor(startY / this.gridSize) * this.gridSize - extraSpace / 2;

    // 수평선 그리기
    for (let i = 0; i <= totalHeight / this.gridSize; i++) {
      const y = gridStartY + i * this.gridSize;
      const isBoldLine = Math.abs(Math.round(y / this.gridSize)) % 5 === 0;

      const horizontalLine = new fabric.Line(
        [gridStartX, y, gridStartX + totalWidth, y],
        {
          stroke: "#ddd",
          strokeWidth: isBoldLine ? 1.5 : 0.5,
          selectable: false,
          evented: false,
          isGrid: true,
          metadata: { type: "grid-line", direction: "horizontal" }, // metadata 추가
        }
      );
      this.canvas.add(horizontalLine);
    }

    // 수직선 그리기
    for (let i = 0; i <= totalWidth / this.gridSize; i++) {
      const x = gridStartX + i * this.gridSize;
      const isBoldLine = Math.abs(Math.round(x / this.gridSize)) % 5 === 0;

      const verticalLine = new fabric.Line(
        [x, gridStartY, x, gridStartY + totalHeight],
        {
          stroke: "#ddd",
          strokeWidth: isBoldLine ? 1.5 : 0.5,
          selectable: false,
          evented: false,
          isGrid: true,
          metadata: { type: "grid-line", direction: "vertical" }, // metadata 추가
        }
      );
      this.canvas.add(verticalLine);
    }

    // 모든 그리드 선을 캔버스의 맨 뒤로 보내기
    this.canvas
      .getObjects()
      .filter((obj) => obj.isGrid)
      .forEach((grid) => this.canvas.sendToBack(grid));

    this.canvas.renderAll();
  }

  createWallSegment(from, to) {
    if (!from || !to) return;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (length < 1) return;

    // fabricObject를 먼저 생성
    const fabricObject = new fabric.Line([from.x, from.y, to.x, to.y], {
      stroke: "#B0B0B0",
      strokeWidth: this.currentWallType.thickness,
      selectable: true,
      hasControls: false,
      hasBorders: true,
      lockRotation: true,
      originX: "center",
      originY: "center",
      hoverCursor: "move",
      type: "wall",
      evented: true,
    });

    // Wall 객체 생성 및 fabricObject 연결
    const wall = new Wall(from.x, from.y, to.x, to.y, fabricObject);
    wall.thickness = this.currentWallType.thickness;
    wall.height = this.currentWallType.height;

    // vertex 생성 및 연결
    let startVertex = this.findOrCreateVertex(from.x, from.y);
    let endVertex = this.findOrCreateVertex(to.x, to.y);

    wall.startVertex = startVertex;
    wall.endVertex = endVertex;
    startVertex.addWall(wall);
    endVertex.addWall(wall);

    // 벽 이벤트 설정
    fabricObject.on("selected", () => {
      this.handleWallSelected(wall);
    });

    fabricObject.on("moving", (e) => {
      if (this.mode !== "select") return;

      const pointer = this.snapToGrid
        ? this.snapToGridPoint(this.canvas.getPointer(e.e))
        : this.canvas.getPointer(e.e);

      // 이동 거리 계산
      const dx = pointer.x - (wall.x1 + wall.x2) / 2;
      const dy = pointer.y - (wall.y1 + wall.y2) / 2;

      // 벽과 vertex들의 새로운 위치 계산
      const newStartX = wall.x1 + dx;
      const newStartY = wall.y1 + dy;
      const newEndX = wall.x2 + dx;
      const newEndY = wall.y2 + dy;

      // wall 객체 업데이트
      wall.x1 = newStartX;
      wall.y1 = newStartY;
      wall.x2 = newEndX;
      wall.y2 = newEndY;

      // fabric 객체 업데이트
      fabricObject.set({
        x1: newStartX,
        y1: newStartY,
        x2: newEndX,
        y2: newEndY,
      });

      // vertex 업데이트
      if (wall.startVertex?.fabricObject) {
        wall.startVertex.x = newStartX;
        wall.startVertex.y = newStartY;
        wall.startVertex.fabricObject.set({
          left: newStartX,
          top: newStartY,
        });
      }

      if (wall.endVertex?.fabricObject) {
        wall.endVertex.x = newEndX;
        wall.endVertex.y = newEndY;
        wall.endVertex.fabricObject.set({
          left: newEndX,
          top: newEndY,
        });
      }

      // 연결된 벽들 업데이트
      wall.startVertex?.walls.forEach((connectedWall) => {
        if (connectedWall !== wall) {
          this.updateWallPosition(connectedWall, wall.startVertex, {
            x: newStartX,
            y: newStartY,
          });
        }
      });

      wall.endVertex?.walls.forEach((connectedWall) => {
        if (connectedWall !== wall) {
          this.updateWallPosition(connectedWall, wall.endVertex, {
            x: newEndX,
            y: newEndY,
          });
        }
      });

      // 방 업데이트
      this.updateRooms();
    });

    this.walls.push(wall);
    this.canvas.add(fabricObject);
    return wall;
  }

  handleWallSelected(wall) {
    if (this.mode !== "select") return;

    // vertex 정확한 위치에 표시
    if (wall.startVertex?.fabricObject) {
      wall.startVertex.fabricObject.set({
        left: wall.x1,
        top: wall.y1,
        visible: true,
        evented: true,
      });
      this.canvas.bringToFront(wall.startVertex.fabricObject);
    }

    if (wall.endVertex?.fabricObject) {
      wall.endVertex.fabricObject.set({
        left: wall.x2,
        top: wall.y2,
        visible: true,
        evented: true,
      });
      this.canvas.bringToFront(wall.endVertex.fabricObject);
    }

    this.canvas.renderAll();
  }

  createVertexControl(vertex) {
    const vertexControl = new fabric.Circle({
      left: vertex.x,
      top: vertex.y,
      radius: 5,
      fill: "#2196F3",
      stroke: "#fff",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      selectable: true,
      evented: true,
      visible: false, // 초기에는 숨김 상태
      isVertex: true,
    });

    vertex.fabricObject = vertexControl;

    // vertex 이동 이벤트 처리
    vertexControl.on("moving", (e) => {
      const pointer = this.snapToGrid
        ? this.snapToGridPoint(this.canvas.getPointer(e.e))
        : this.canvas.getPointer(e.e);

      vertexControl.set({
        left: pointer.x,
        top: pointer.y,
      });

      // 연결된 모든 벽 업데이트
      vertex.walls.forEach((wall) => {
        this.updateWallPosition(wall, vertex, pointer);
      });

      // 방 업데이트
      this.updateRooms();
      this.canvas.renderAll();
    });

    this.canvas.add(vertexControl);
    return vertexControl;
  }

  // 벽이 선택 해제될 때의 처리
  handleWallDeselected(wall) {
    // vertex 숨기기
    if (wall.startVertex && wall.startVertex.fabricObject) {
      wall.startVertex.fabricObject.set({
        visible: false,
        evented: false,
      });
    }
    if (wall.endVertex && wall.endVertex.fabricObject) {
      wall.endVertex.fabricObject.set({
        visible: false,
        evented: false,
      });
    }
    this.canvas.renderAll();
  }
  // 벽에 hover할 때 미리보기를 표시하는 메서드 추가
  setupDoorWindowPreview() {
    this.canvas.on("mouse:move", (event) => {
      if (this.mode !== "door" && this.mode !== "window") return;

      const pointer = this.canvas.getPointer(event.e);
      const wallInfo = this.findWallUnderPoint(pointer);

      if (wallInfo) {
        // 기존 미리보기 제거
        if (this.previewObject) {
          this.canvas.remove(this.previewObject);
        }

        // 새로운 미리보기 생성
        const previewProps = {
          width: this.mode === "door" ? 60 : 40,
          thickness: this.currentWallType.thickness,
          position: wallInfo.position,
          angle: wallInfo.angle,
        };

        this.previewObject =
          this.mode === "door"
            ? this.createDoorPreview(previewProps)
            : this.createWindowPreview(previewProps);

        this.canvas.add(this.previewObject);
        this.canvas.renderAll();
      } else if (this.previewObject) {
        // 벽 위에 없을 때는 미리보기 제거
        this.canvas.remove(this.previewObject);
        this.previewObject = null;
        this.canvas.renderAll();
      }
    });
  }

  createDoorPreview({ width, thickness, position, angle }) {
    // 반투명한 문 미리보기 생성
    const doorRect = new fabric.Rect({
      width: width,
      height: thickness,
      fill: "rgba(139, 69, 19, 0.5)",
      stroke: "rgba(0, 0, 0, 0.5)",
      strokeWidth: 1,
    });

    const swingLine = new fabric.Path(
      `M ${-width / 2} 0 A ${width} ${width} 0 0 1 ${width / 2} 0`,
      {
        stroke: "rgba(0, 0, 0, 0.5)",
        fill: "transparent",
        strokeWidth: 1,
      }
    );

    const group = new fabric.Group([doorRect, swingLine], {
      left: position.x,
      top: position.y,
      angle: angle,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
      opacity: 0.7,
    });

    return group;
  }

  createWindowPreview({ width, thickness, position, angle }) {
    // 반투명한 창문 미리보기 생성
    const windowRect = new fabric.Rect({
      width: width,
      height: thickness,
      fill: "rgba(135, 206, 235, 0.3)",
      stroke: "rgba(0, 0, 0, 0.5)",
      strokeWidth: 1,
    });

    const centerLine = new fabric.Line([0, -thickness / 2, 0, thickness / 2], {
      stroke: "rgba(0, 0, 0, 0.5)",
      strokeWidth: 1,
    });

    const group = new fabric.Group([windowRect, centerLine], {
      left: position.x,
      top: position.y,
      angle: angle,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
      opacity: 0.7,
    });

    return group;
  }

  setupEventListeners() {
    this.canvas.on("mouse:down", (e) => this.handleMouseDown(e));
    this.canvas.on("mouse:move", (e) => this.handleMouseMove(e));
    this.canvas.on("mouse:up", () => this.handleMouseUp());
    this.canvas.on("mouse:wheel", (opt) => this.handleMouseWheel(opt));

    let isDragging = false;
    let lastPosX;
    let lastPosY;

    this.canvas.on("mouse:down", (opt) => {
      if (opt.e.button === 2 || (opt.e.spaceBar && opt.e.which === 1)) {
        isDragging = true;
        lastPosX = opt.e.clientX;
        lastPosY = opt.e.clientY;
        this.canvas.selection = false;
      }
    });

    this.canvas.on("mouse:move", (opt) => {
      if (isDragging) {
        const e = opt.e;
        const vpt = this.canvas.viewportTransform;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        this.canvas.requestRenderAll();
        this.createGrid(); // 패닝 중에도 그리드 업데이트
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    });

    this.canvas.on("mouse:up", () => {
      isDragging = false;
      this.canvas.selection = true;
    });

    this.canvas.on("selection:created", (e) => {
      // select 모드에서 방을 클릭했을 때만 면적 표시
      if (this.mode === "select" && e.selected[0]?.isRoom) {
        this.displayRoomArea(e.selected[0]);
      } else {
        this.clearAreaText(); // 다른 객체를 선택했을 때는 면적 제거
      }

      const selectedObject = e.selected[0];
      if (selectedObject && selectedObject.isWall) {
        const wall = this.walls.find((w) => w.fabricObject === selectedObject);
        if (wall) {
          this.handleWallSelected(wall);
        }
      }
    });

    this.canvas.on("selection:cleared", () => {
      this.walls.forEach((wall) => {
        this.handleWallDeselected(wall);
      });
      // 선택 해제 시 면적 텍스트 제거
      this.clearAreaText();
    });

    this.canvas.on("object:added", (e) => {
      const obj = e.target;
      // metadata가 없는 경우 기본값 설정
      if (!obj.metadata) {
        obj.metadata = {
          type: obj.isGrid ? "grid-line" : "unknown",
        };
      }
    });

    this.canvas.on("object:moving", (e) => this.handleObjectMoving(e));
  }

  setDimensions(width, height) {
    this.canvas.setDimensions({ width, height });
    this.createGrid();
  }

  toJSON() {
    try {
      // 모든 vertex들의 위치 정보를 먼저 수집
      const verticesMap = new Map();
      this.vertices.forEach((vertex, index) => {
        verticesMap.set(`${vertex.x},${vertex.y}`, index);
      });

      // 벽체 데이터 저장 시 vertex 참조 정보 포함
      const wallsData = this.walls.map((wall) => {
        // 각 벽의 시작점과 끝점에 해당하는 vertex 인덱스 찾기
        const startKey = `${wall.x1},${wall.y1}`;
        const endKey = `${wall.x2},${wall.y2}`;

        return {
          id: wall.id || Math.random().toString(36).substr(2, 9),
          x1: wall.x1,
          y1: wall.y1,
          x2: wall.x2,
          y2: wall.y2,
          thickness: wall.thickness || this.currentWallType.thickness,
          startVertexIndex: verticesMap.get(startKey),
          endVertexIndex: verticesMap.get(endKey),
          // 벽체의 원본 방향 정보 저장
          originalAngle: Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1),
        };
      });

      // vertex 정보도 함께 저장
      const verticesData = Array.from(this.vertices.values()).map((vertex) => ({
        x: vertex.x,
        y: vertex.y,
        connectedWallIds: vertex.walls.map((w) => w.id),
      }));

      return {
        version: "1.1", // 버전 업데이트
        walls: wallsData,
        vertices: verticesData,
        settings: {
          gridVisible: this.gridVisible,
          snapToGrid: this.snapToGrid,
          gridSize: this.gridSize,
          currentWallType: this.currentWallType,
        },
      };
    } catch (error) {
      console.error("Error in toJSON:", error);
      throw error;
    }
  }

  loadFromState(state) {
    if (!state) return false;

    try {
      // 캔버스 초기화
      this.clear();

      // 설정 복원
      if (state.settings) {
        Object.assign(this, state.settings);
      }

      // 먼저 모든 vertex 생성
      const vertexMap = new Map();
      if (state.vertices) {
        state.vertices.forEach((vData, index) => {
          const vertex = new Vertex(vData.x, vData.y);
          this.vertices.push(vertex);
          vertexMap.set(index, vertex);
        });
      }

      // 벽체 생성 및 vertex 연결
      if (state.walls && Array.isArray(state.walls)) {
        const createdWalls = state.walls.map((wallData) => {
          // 시작점과 끝점에 해당하는 vertex 찾기
          const startVertex = vertexMap.get(wallData.startVertexIndex);
          const endVertex = vertexMap.get(wallData.endVertexIndex);

          // 벽체 생성 시 vertex 정보 활용
          const wall = this.createWallSegment(
            { x: wallData.x1, y: wallData.y1 },
            { x: wallData.x2, y: wallData.y2 }
          );

          if (wall) {
            wall.id = wallData.id;
            wall.thickness = wallData.thickness;

            // vertex 연결 설정
            if (startVertex) {
              wall.startVertex = startVertex;
              startVertex.addWall(wall);
            }
            if (endVertex) {
              wall.endVertex = endVertex;
              endVertex.addWall(wall);
            }

            // fabricObject 속성 설정
            if (wall.fabricObject) {
              wall.fabricObject.set({
                strokeWidth: wallData.thickness,
                selectable: true,
                hasControls: false,
                hasBorders: true,
                lockRotation: true,
                originX: "center",
                originY: "center",
              });
            }
          }
          return wall;
        });

        // 모든 벽이 생성된 후 연결 관계 재검증
        this.validateWallConnections();
      }

      // 방 다시 생성
      this.checkAndCreateRoom();

      // 캔버스 렌더링
      this.canvas.renderAll();

      return true;
    } catch (error) {
      console.error("Error loading state:", error);
      return false;
    }
  }

  // 벽체 연결 관계 검증 메서드 추가
  validateWallConnections() {
    this.vertices.forEach((vertex) => {
      // 같은 지점에 있는 vertex들을 찾아서 병합
      const samePositionVertices = this.vertices.filter(
        (v) =>
          v !== vertex &&
          Math.abs(v.x - vertex.x) < 0.1 &&
          Math.abs(v.y - vertex.y) < 0.1
      );

      if (samePositionVertices.length > 0) {
        samePositionVertices.forEach((sameVertex) => {
          // 벽체 연결 정보 이전
          sameVertex.walls.forEach((wall) => {
            if (!vertex.walls.includes(wall)) {
              vertex.addWall(wall);
              if (wall.startVertex === sameVertex) {
                wall.startVertex = vertex;
              }
              if (wall.endVertex === sameVertex) {
                wall.endVertex = vertex;
              }
            }
          });

          // 중복 vertex 제거
          const index = this.vertices.indexOf(sameVertex);
          if (index > -1) {
            this.vertices.splice(index, 1);
          }
        });
      }
    });
  }

  // 캔버스 초기화 메서드
  clear() {
    // 모든 객체 제거
    this.canvas.clear();

    // 상태 초기화
    this.walls = [];
    this.vertices = [];
    this.rooms = [];

    // 기본 설정으로 초기화
    this.gridVisible = true;
    this.snapToGrid = true;
    this.mode = "select";

    // 그리드 재생성
    this.createGrid();
    this.canvas.renderAll();
  }

  loadFromJSON(jsonData) {
    if (!jsonData) return;

    // 기존 캔버스 초기화
    this.clear();

    // 설정 복원
    if (jsonData.settings) {
      this.gridVisible = jsonData.settings.gridVisible;
      this.snapToGrid = jsonData.settings.snapToGrid;
      this.gridSize = jsonData.settings.gridSize;
      this.currentWallType = jsonData.settings.currentWallType;
    }

    // 뷰포트 및 줌 복원
    if (jsonData.viewportTransform) {
      this.canvas.setViewportTransform(jsonData.viewportTransform);
    }
    if (jsonData.zoom) {
      this.canvas.setZoom(jsonData.zoom);
    }

    // 벽 복원
    if (jsonData.walls) {
      jsonData.walls.forEach((wallData) => {
        this.createWallSegment(
          { x: wallData.x1, y: wallData.y1 },
          { x: wallData.x2, y: wallData.y2 }
        );
      });
    }

    // 문 복원
    if (jsonData.doors) {
      jsonData.doors.forEach((doorData) => {
        const wallInfo = this.findWallUnderPoint({
          x: doorData.left,
          y: doorData.top,
        });
        if (wallInfo) {
          this.addDoor(wallInfo);
        }
      });
    }

    // 창문 복원
    if (jsonData.windows) {
      jsonData.windows.forEach((windowData) => {
        const wallInfo = this.findWallUnderPoint({
          x: windowData.left,
          y: windowData.top,
        });
        if (wallInfo) {
          this.addWindow(wallInfo);
        }
      });
    }

    // 가구 복원
    if (jsonData.furniture) {
      jsonData.furniture.forEach((furnitureData) => {
        this.createFurniture(furnitureData.metadata);
      });
    }

    // 방 다시 생성
    this.checkAndCreateRoom();
    this.canvas.renderAll();
  }

  // 추가된 addToHistory 메서드
  addToHistory() {
    if (typeof this.onHistoryAdd === "function") {
      const json = this.canvas.toJSON();
      this.onHistoryAdd(json);
    }
  }

  // addToHistory 호출을 위한 콜백 등록
  setOnHistoryAdd(callback) {
    this.onHistoryAdd = callback;
  }

  addPredefinedRoom(wallTypeId) {
    // wallTypeId에 해당하는 항목 찾기
    const wallType = wallTypes.find((type) => type.id === wallTypeId);

    if (!wallType || !wallType.walls) {
      console.error("Invalid wall type or no walls defined.");
      return;
    }

    // 벽 생성 및 방 닫기 처리
    const walls = [];
    wallType.walls.forEach(({ x1, y1, x2, y2 }) => {
      const wall = this.createWallSegment({ x: x1, y: y1 }, { x: x2, y: y2 });
      walls.push(wall);
    });

    // 방 생성
    this.checkAndCreateRoom();
    this.canvas.renderAll();
  }

  createFurniture(furnitureData) {
    if (!furnitureData || !furnitureData.metadata) {
      console.error("Invalid furniture data:", furnitureData);
      return;
    }
    const canvas = this.getCanvas();
    const center = canvas.getCenter();
    console.log("Creating furniture with data:", furnitureData); // 디버깅용

    // metadata에서 필요한 값들을 추출하고 기본값 설정
    const metadata = {
      type: "furniture",
      id: String(furnitureData.metadata.id || "unknown"),
      name: String(furnitureData.metadata.name || "가구"),
      width: Number(furnitureData.metadata.width || 100),
      depth: Number(furnitureData.metadata.depth || 100),
      height: Number(furnitureData.metadata.height || 100),
      model3D: furnitureData.metadata.model3D || null,
    };

    // 유효성 검사
    if (!width || !depth || !height) {
      console.error("Invalid furniture dimensions:", { width, depth, height });
      return;
    }
    // 격자 크기에 맞게 스케일 조정 (1 그리드 = 10cm)
    const scaledWidth = (width / 10) * this.gridSize;
    const scaledDepth = (depth / 10) * this.gridSize;

    // 가구 객체
    const furnitureObj = new fabric.Rect({
      left: 0,
      top: 0,
      width: scaledWidth,
      height: scaledDepth,
      fill: "#B5936B",
      stroke: "#8B7355",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
      metadata: metadata,
    });

    // 가구 이름 텍스트
    const text = new fabric.Text(metadata.name, {
      left: 0,
      top: 0,
      fontSize: 12,
      fill: "#000000",
      originX: "center",
      originY: "center",
      selectable: false,
      metadata: { type: "furniture-label" },
    });

    // 그룹으로 묶기
    const group = new fabric.Group([furnitureObj, text], {
      left: center.left,
      top: center.top,
      selectable: true,
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: false,
      lockMovementX: false,
      lockMovementY: false,
      hasBorders: true,
      type: "furniture-group",
      metadata: metadata,
    });
    // 이동 시 스냅 동작 추가
    group.on("moving", (e) => {
      if (this.mode !== "select") return;
      const pointer = this.snapToGrid
        ? this.snapToGridPoint(this.canvas.getPointer(e.e))
        : this.canvas.getPointer(e.e);
      const snapPoint = this.findNearestWallPoint(pointer);
      if (snapPoint) {
        group.set({
          left: snapPoint.x,
          top: snapPoint.y,
        });
      }
    });

    // 클릭 시 선택 상태 반영
    group.on("mousedown", () => {
      canvas.setActiveObject(group);
    });
    console.log("Created furniture group:", {
      name: displayName,
      dimensions: { width, depth, height },
      metadata: group.metadata,
    });

    canvas.add(group);
    canvas.renderAll();

    console.log("Created furniture group with metadata:", group.metadata);

    return group;
  }
  ensureMetadata(obj, type = "unknown") {
    if (!obj.metadata) {
      obj.metadata = { type };
    }
    return obj.metadata;
  }

  getObjectMetadata(obj) {
    return obj.metadata || { type: "unknown" };
  }

  setObjectMetadata(obj, metadata) {
    obj.metadata = { ...obj.metadata, ...metadata };
    return obj;
  }

  validateMetadata(metadata) {
    if (!metadata) return false;
    if (metadata.type === "furniture") {
      return;
      metadata.id &&
        metadata.name &&
        typeof metadata.width === "number" &&
        typeof metadata.depth === "number" &&
        typeof metadata.height === "number";
    }
    return true;
  }
  findNearestWallPoint(point) {
    let nearestPoint = null;
    let minDistance = Infinity;

    this.walls.forEach((wall) => {
      const wallPoints = [
        { x: wall.x1, y: wall.y1 },
        { x: wall.x2, y: wall.y2 },
      ];

      wallPoints.forEach((wallPoint) => {
        const distance = Math.sqrt(
          Math.pow(point.x - wallPoint.x, 2) +
            Math.pow(point.y - wallPoint.y, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = wallPoint;
        }
      });
    });

    // 20px 이하의 거리일 경우만 스냅
    return minDistance <= 20 ? nearestPoint : null;
  }
}

export default FloorPlanner;
