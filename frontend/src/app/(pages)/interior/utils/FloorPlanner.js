import { fabric } from "fabric";

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

    this.setupEventListeners();
    this.createGrid();
  }

  setMode(mode) {
    this.mode = mode;
    this.isDrawingWall = false;

    if (mode === "select") {
      this.canvas.selection = false;
      this.updateVerticesState();
      this.canvas.forEachObject((obj) => {
        if (obj.isWall || obj.isRoom) {
          obj.evented = true;
        }
      });
    } else if (mode === "wall") {
      this.canvas.selection = false;
      this.canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
      });
      this.canvas.discardActiveObject();
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
    if (e.e.button === 2) return;
    if (this.mode !== "wall") return;

    this.isDrawingWall = true;

    this.vertices.forEach((vertex) => {
      if (vertex.fabricObject) {
        vertex.fabricObject.selectable = false;
        vertex.fabricObject.evented = false;
      }
    });

    const pointer = this.canvas.getPointer(e.e);
    const snappedPoint = this.snapToGrid
      ? this.snapToGridPoint(pointer)
      : pointer;
    this.mouseFrom = { x: snappedPoint.x, y: snappedPoint.y };
    this.isDrawing = true;

    this.startMarker = new fabric.Circle({
      left: snappedPoint.x,
      top: snappedPoint.y,
      radius: 5,
      fill: "blue",
      stroke: "white",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
    });

    this.endMarker = new fabric.Circle({
      left: snappedPoint.x,
      top: snappedPoint.y,
      radius: 5,
      fill: "blue",
      stroke: "white",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
    });

    this.drawingObject = new fabric.Line(
      [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
      {
        stroke: "#7D7D7D",
        strokeWidth: 5,
        selectable: false,
        evented: false,
      }
    );

    this.lengthText = new fabric.Text("0 cm", {
      left: snappedPoint.x,
      top: snappedPoint.y - 20,
      fontSize: 14,
      fill: "#000",
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
    });

    this.canvas.add(this.startMarker);
    this.canvas.add(this.endMarker);
    this.canvas.add(this.drawingObject);
    this.canvas.add(this.lengthText);
    this.canvas.renderAll();
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
    if (this.isDrawing && this.mouseFrom && this.mouseTo) {
      const length = Math.sqrt(
        Math.pow(this.mouseTo.x - this.mouseFrom.x, 2) +
          Math.pow(this.mouseTo.y - this.mouseFrom.y, 2)
      );

      if (length >= this.gridSize) {
        this.createWall(this.mouseFrom, this.mouseTo);
      }
    }

    if (this.drawingObject) {
      this.canvas.remove(this.drawingObject);
    }
    if (this.startMarker) {
      this.canvas.remove(this.startMarker);
    }
    if (this.endMarker) {
      this.canvas.remove(this.endMarker);
    }
    if (this.lengthText) {
      this.canvas.remove(this.lengthText);
    }

    this.isDrawing = false;
    this.isDrawingWall = false;
    this.drawingObject = null;
    this.startMarker = null;
    this.endMarker = null;
    this.lengthText = null;
    this.mouseFrom = null;
    this.mouseTo = null;

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

  createWallSegment(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (length < 1) return; // 너무 짧은 벽은 생성하지 않음

    const wallRect = new fabric.Rect({
      left: from.x + dx / 2,
      top: from.y + dy / 2,
      width: length,
      height: this.currentWallType.thickness,
      fill: "#B0B0B0",
      stroke: "#7D7D7D",
      strokeWidth: 1,
      angle: angle,
      originX: "center",
      originY: "center",
      selectable: false,
      hasControls: false,
      hasBorders: false,
      evented: false,
      isWall: true,
    });

    const wall = new Wall(from.x, from.y, to.x, to.y, wallRect);

    // 시작점과 끝점의 vertex 찾기 또는 생성
    let startVertex = this.findOrCreateVertex(from.x, from.y);
    let endVertex = this.findOrCreateVertex(to.x, to.y);

    wall.startVertex = startVertex;
    wall.endVertex = endVertex;
    startVertex.addWall(wall);
    endVertex.addWall(wall);

    this.walls.push(wall);
    this.canvas.add(wallRect);
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
      radius: 5,
      fill: "#2196F3",
      stroke: "#fff",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      selectable: this.mode === "select" && !this.isDrawingWall,
      evented: this.mode === "select" && !this.isDrawingWall,
      isVertex: true,
    });

    vertex.fabricObject = vertexControl;

    vertexControl.on("moving", (e) => {
      if (this.isDrawingWall) {
        return false;
      }

      const pointer = this.snapToGrid
        ? this.snapToGridPoint(this.canvas.getPointer(e.e))
        : this.canvas.getPointer(e.e);

      vertexControl.set({
        left: pointer.x,
        top: pointer.y,
      });

      vertex.walls.forEach((wall) => {
        this.updateWallPosition(wall, vertex, pointer);
      });

      this.updateRooms();
      this.canvas.renderAll();
    });

    this.canvas.add(vertexControl);
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

    const width = this.canvas.width;
    const height = this.canvas.height;

    for (let i = 0; i < width / this.gridSize; i++) {
      const isBoldLine = i % 5 === 0;
      const verticalLine = new fabric.Line(
        [i * this.gridSize, 0, i * this.gridSize, height],
        {
          stroke: "#ddd",
          strokeWidth: isBoldLine ? 1.5 : 0.5,
          selectable: false,
          evented: false,
          isGrid: true,
        }
      );
      this.canvas.add(verticalLine);
    }

    for (let i = 0; i < height / this.gridSize; i++) {
      const isBoldLine = i % 5 === 0;
      const horizontalLine = new fabric.Line(
        [0, i * this.gridSize, width, i * this.gridSize],
        {
          stroke: "#ddd",
          strokeWidth: isBoldLine ? 1.5 : 0.5,
          selectable: false,
          evented: false,
          isGrid: true,
        }
      );
      this.canvas.add(horizontalLine);
    }

    this.canvas
      .getObjects()
      .filter((obj) => obj.isGrid)
      .forEach((grid) => this.canvas.sendToBack(grid));

    this.canvas.renderAll();
  }

  setupEventListeners() {
    this.canvas.on("mouse:down", (e) => this.handleMouseDown(e));
    this.canvas.on("mouse:move", (e) => this.handleMouseMove(e));
    this.canvas.on("mouse:up", () => this.handleMouseUp());

    this.canvas.on("selection:created", (e) => {
      // select 모드에서 방을 클릭했을 때만 면적 표시
      if (this.mode === "select" && e.selected[0]?.isRoom) {
        this.displayRoomArea(e.selected[0]);
      } else {
        this.clearAreaText(); // 다른 객체를 선택했을 때는 면적 제거
      }
    });

    this.canvas.on("selection:cleared", () => {
      // 선택 해제 시 면적 텍스트 제거
      this.clearAreaText();
    });

    this.canvas.on("object:moving", (e) => this.handleObjectMoving(e));
  }

  setDimensions(width, height) {
    this.canvas.setDimensions({ width, height });
    this.createGrid();
  }

  clear() {
    this.canvas.clear();
    this.walls = [];
    this.vertices = [];
    this.rooms = [];
    this.createGrid();
  }

  createFurniture(furniture) {
    if (!furniture) return;

    const { width, depth, name } = furniture;
    const canvas = this.getCanvas();
    const center = canvas.getCenter();

    // 격자 크기에 맞게 스케일 조정 (1 그리드 = 10cm)
    const scaledWidth = (width / 10) * this.gridSize;
    const scaledDepth = (depth / 10) * this.gridSize;

    // 가구 생성
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
      name: name,
      type: "furniture",
      metadata: furniture,
    });

    // 가구 이름 텍스트를 중앙에 배치
    const text = new fabric.Text(name, {
      left: 0,
      top: 0,
      fontSize: 12,
      fill: "#000000",
      originX: "center",
      originY: "center",
      selectable: false, // 텍스트는 선택 불가
      metadata: { type: "furniture-label" },
    });

    // 그룹으로 묶기
    const group = new fabric.Group([furnitureObj, text], {
      left: center.left,
      top: center.top,
      selectable: true, // 선택 가능
      hasControls: false, // 크기 조절 핸들 비활성화
      lockScalingX: true, // 가로 크기 조정 잠금
      lockScalingY: true, // 세로 크기 조정 잠금
      lockRotation: true, // 회전 금지
      lockMovementX: false, // 가로 이동 가능
      lockMovementY: false, // 세로 이동 가능
      hasBorders: true,
      type: "furniture-group",
    });

    // 이동 시 스냅 동작 추가
    group.on("moving", (e) => {
      const pointer = group.getCenterPoint();
      const snapPoint = this.findNearestWallPoint(pointer);

      if (snapPoint) {
        group.left = snapPoint.x - group.width / 2;
        group.top = snapPoint.y - group.height / 2;
      }
    });

    // 클릭 시 선택 상태 반영
    group.on("mousedown", () => {
      canvas.setActiveObject(group);
    });

    canvas.add(group);
    canvas.renderAll();

    return group;
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
