import { WALL_TYPES } from './types';

export class Wall {
  constructor(start, end, type, thick) {
    if (!Object.values(WALL_TYPES).includes(type)) {
      console.warn(`Invalid wall type: ${type}. Using default: ${WALL_TYPES.NORMAL}`);
      type = WALL_TYPES.NORMAL;
    }

    this.thick = thick;
    this.start = start;
    this.end = end;
    this.type = type;
    this.parent = null;
    this.child = null;
    this.angle = 0;
    this.equations = {};
    this.coords = [];
    this.backUp = false;
    this.graph = null;
  }

  getWallNode(coords, except = null) {
    const nodes = [];
    
    this.walls.forEach(wall => {
      if (!this.isObjectsEquals(wall, except)) {
        if (this.isObjectsEquals(wall.start, coords)) {
          nodes.push({ wall, type: 'start' });
        }
        if (this.isObjectsEquals(wall.end, coords)) {
          nodes.push({ wall, type: 'end' });
        }
      }
    });

    return nodes.length > 0 ? nodes : false;
  }

  wallsComputing(action = false) {
    document.getElementById('boxwall').innerHTML = '';
    document.getElementById('boxArea').innerHTML = '';

    // 벽 연결 검증
    this.walls.forEach(wall => {
      if (wall.parent !== null) {
        if (!this.isObjectsEquals(wall.parent.start, wall.start) && 
            !this.isObjectsEquals(wall.parent.end, wall.start)) {
          wall.parent = null;
        }
      }
      if (wall.child !== null) {
        if (!this.isObjectsEquals(wall.child.start, wall.end) && 
            !this.isObjectsEquals(wall.child.end, wall.end)) {
          wall.child = null;
        }
      }
    });

    // 각 벽 처리
    this.walls.forEach(wall => {
      // 이전 벽과 다음 벽 정보 설정
      let { previousWall, previousWallStart, previousWallEnd } = this.setupPreviousWall(wall, action);
      let { nextWall, nextWallStart, nextWallEnd } = this.setupNextWall(wall, action);

      // 벽 각도 계산
      const angleWall = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
      wall.angle = angleWall;

      // 벽 두께에 따른 오프셋 계산
      const wallThickX = (wall.thick / 2) * Math.sin(angleWall);
      const wallThickY = (wall.thick / 2) * Math.cos(angleWall);

      // 벽 방정식 생성
      const equations = this.createWallEquations(wall, wallThickX, wallThickY);
      wall.equations = equations;

      // 경로 데이터 초기화
      let dWay = this.createWallPath(
        wall,
        equations,
        { previousWall, previousWallStart, previousWallEnd },
        { nextWall, nextWallStart, nextWallEnd },
        wallThickX,
        wallThickY
      );

      // 벽 그래프 생성 및 추가
      wall.graph = this.makeWall(dWay);
      document.getElementById('boxwall').appendChild(wall.graph);
    });
  }

  setupPreviousWall(wall, action) {
    let previousWall = null;
    let previousWallStart = null;
    let previousWallEnd = null;

    if (wall.parent !== null) {
      if (this.isObjectsEquals(wall.parent.start, wall.start)) {
        previousWall = wall.parent;
        previousWallStart = previousWall.end;
        previousWallEnd = previousWall.start;
      } else if (this.isObjectsEquals(wall.parent.end, wall.start)) {
        previousWall = wall.parent;
        previousWallStart = previousWall.start;
        previousWallEnd = previousWall.end;
      }
    } else {
      const startNodes = this.getWallNode(wall.start, wall);
      if (startNodes) {
        startNodes.forEach(node => {
          const eqInter = this.createEquationFromWall(node.wall);
          let angleInter = 90;
          
          if (action === 'move') {
            angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
          }

          if (this.isValidWallConnection(node, angleInter)) {
            this.connectWalls(wall, node.wall, node.type);
            previousWall = wall.parent;
            previousWallStart = node.type === 'start' ? previousWall.end : previousWall.start;
            previousWallEnd = node.type === 'start' ? previousWall.start : previousWall.end;
          }
        });
      }
    }

    return { previousWall, previousWallStart, previousWallEnd };
  }

  setupNextWall(wall, action) {
    let nextWall = null;
    let nextWallStart = null;
    let nextWallEnd = null;

    if (wall.child !== null) {
      if (this.isObjectsEquals(wall.child.end, wall.end)) {
        nextWall = wall.child;
        nextWallStart = nextWall.end;
        nextWallEnd = nextWall.start;
      } else {
        nextWall = wall.child;
        nextWallStart = nextWall.start;
        nextWallEnd = nextWall.end;
      }
    } else {
      const endNodes = this.getWallNode(wall.end, wall);
      if (endNodes) {
        endNodes.forEach(node => {
          const eqInter = this.createEquationFromWall(node.wall);
          let angleInter = 90;
          
          if (action === 'move') {
            angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
          }

          if (this.isValidWallConnection(node, angleInter)) {
            this.connectWalls(wall, node.wall, node.type, true);
            nextWall = wall.child;
            nextWallStart = node.type === 'end' ? nextWall.end : nextWall.start;
            nextWallEnd = node.type === 'end' ? nextWall.start : nextWall.end;
          }
        });
      }
    }

    return { nextWall, nextWallStart, nextWallEnd };
  }
  createWallEquations(wall, wallThickX, wallThickY) {
    return {
      up: qSVG.createEquation(
        wall.start.x + wallThickX,
        wall.start.y - wallThickY,
        wall.end.x + wallThickX,
        wall.end.y - wallThickY
      ),
      down: qSVG.createEquation(
        wall.start.x - wallThickX,
        wall.start.y + wallThickY,
        wall.end.x - wallThickX,
        wall.end.y + wallThickY
      ),
      base: qSVG.createEquation(
        wall.start.x,
        wall.start.y,
        wall.end.x,
        wall.end.y
      )
    };
  }

  createWallPath(wall, equations, prevWallData, nextWallData, wallThickX, wallThickY) {
    let dWay = '';
    const { eqWallUp, eqWallDw } = equations;
    
    // 시작점 처리
    if (wall.parent === null) {
      dWay = this.createStartPath(wall, equations);
    } else {
      dWay = this.createParentConnectedPath(wall, prevWallData, equations, wallThickX, wallThickY);
    }

    // 끝점 처리
    if (wall.child === null) {
      dWay = this.createEndPath(dWay, wall, equations);
    } else {
      dWay = this.createChildConnectedPath(dWay, wall, nextWallData, equations, wallThickX, wallThickY);
    }

    return dWay;
  }

  makeWall(way) {
    return qSVG.create('none', 'path', {
      d: way,
      stroke: 'none',
      fill: colorWall,
      'stroke-width': 1,
      'stroke-linecap': 'butt',
      'stroke-linejoin': 'miter',
      'stroke-miterlimit': 4,
      'fill-rule': 'nonzero'
    });
  }

  setInvisible(targetWall = null) {
    const wall = targetWall || binder.wall;
    const objWall = this.objFromWall(wallBind);
    
    if (objWall.length === 0) {
      wall.type = WALL_TYPES.SEPARATE;
      wall.backUp = wall.thick;
      wall.thick = 0.07;
      this.architect();
      mode = 'select_mode';
      document.getElementById('panel').style.display = 'block';
      save();
      return true;
    }
    
    document.getElementById('boxinfo').innerHTML = 
      'Les murs contenant des portes ou des fenêtres ne peuvent être une séparation !';
    return false;
  }

  setVisible(targetWall = null) {
    const wall = targetWall || binder.wall;
    wall.type = WALL_TYPES.NORMAL;
    wall.thick = wall.backUp;
    wall.backUp = false;
    this.architect();
    mode = 'select_mode';
    document.getElementById('panel').style.display = 'block';
    save();
    return true;
  }

  splitWall(wallToSplit = null) {
    const targetWall = wallToSplit || binder.wall;
    const eqWall = this.createEquationFromWall(targetWall);
    const wallLength = qSVG.gap(targetWall.start, targetWall.end);
    
    // 분할 지점 찾기
    const splitPoints = this.findSplitPoints(targetWall, eqWall, wallLength);
    
    // 기존 벽 연결 해제
    this.disconnectWall(targetWall);
    
    // 새 벽 생성
    this.createSplitWalls(targetWall, splitPoints);

    this.architect();
    mode = 'select_mode';
    document.getElementById('panel').style.display = 'block';
    save();
    return true;
  }

  findSplitPoints(wall, equation, wallLength) {
    return this.walls
      .map(otherWall => {
        const eq = this.createEquationFromWall(otherWall);
        const intersection = qSVG.intersectionOfEquations(equation, eq, 'obj');
        
        if (!this.isValidIntersection(intersection, wall, otherWall)) {
          return null;
        }
        
        const distance = qSVG.gap(wall.start, intersection);
        if (distance <= 5 || distance >= wallLength) {
          return null;
        }
        
        return { distance, coords: intersection };
      })
      .filter(point => point !== null)
      .sort((a, b) => a.distance - b.distance);
  }

  createSplitWalls(originalWall, splitPoints) {
    let startPoint = originalWall.start;
    let prevWall = null;

    splitPoints.forEach(point => {
      const wall = new Wall(startPoint, point.coords, WALL_TYPES.NORMAL, originalWall.thick);
      this.walls.push(wall);
      
      if (prevWall) {
        prevWall.child = wall;
        wall.parent = prevWall;
      }
      
      prevWall = wall;
      startPoint = point.coords;
    });

    // 마지막 벽 생성
    const lastWall = new Wall(startPoint, originalWall.end, WALL_TYPES.NORMAL, originalWall.thick);
    this.walls.push(lastWall);
    
    if (prevWall) {
      prevWall.child = lastWall;
      lastWall.parent = prevWall;
    }
  }

  // 유틸리티 메서드들
  isValidWallConnection(node, angle) {
    return (
      (node.type === 'start' && node.wall.parent === null && angle > 20 && angle < 160) ||
      (node.type === 'end' && node.wall.child === null && angle > 20 && angle < 160)
    );
  }

  createEquationFromWall(wall) {
    return qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
  }

  isValidIntersection(intersection, wall1, wall2) {
    return (
      qSVG.btwn(intersection.x, wall1.start.x, wall1.end.x, 'round') &&
      qSVG.btwn(intersection.y, wall1.start.y, wall1.end.y, 'round') &&
      qSVG.btwn(intersection.x, wall2.start.x, wall2.end.x, 'round') &&
      qSVG.btwn(intersection.y, wall2.start.y, wall2.end.y, 'round')
    );
  }
}