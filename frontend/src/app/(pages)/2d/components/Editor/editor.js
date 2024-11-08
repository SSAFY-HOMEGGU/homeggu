import { Wall } from './wall';
import { Object2D } from './object2d';
import { RoomManager } from './room';
import { WALL_TYPES, ROOM_TYPES, OBJECT_FAMILIES } from './types';

export class Editor {
  constructor() {
    this.walls = [];
    this.objects = [];
    this.roomManager = new RoomManager();
    this.mode = 'select_mode';
  }

  // 벽 관련 메서드들
  createWall(start, end, type = WALL_TYPES.NORMAL, thick = 20) {
    const wall = new Wall(start, end, type, thick);
    this.walls.push(wall);
    return wall;
  }

  deleteWall(wall) {
    const index = this.walls.indexOf(wall);
    if (index > -1) {
      this.walls.splice(index, 1);
    }
    this.architect();
  }

  // 오브젝트 관련 메서드들
  createObject(family, classe, type, pos, angle, angleSign, size, hinge = 'normal', thick, value) {
    const object = new Object2D(
      family,
      classe, 
      type, 
      pos, 
      angle, 
      angleSign, 
      size, 
      hinge, 
      thick, 
      value
    );
    this.objects.push(object);
    return object;
  }

  deleteObject(object) {
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  // 통합 계산 메서드
  architect() {
    this.wallsComputing();
    const rooms = qSVG.polygonize(this.walls);
    this.roomManager.roomMaker(rooms);
    return true;
  }

  // UI 업데이트 메서드들
  clearUI() {
    const elements = ['boxwall', 'boxRoom', 'boxSurface', 'boxArea'];
    elements.forEach(id => {
      document.getElementById(id).innerHTML = '';
    });
  }

  updateUI() {
    this.clearUI();
    this.walls.forEach(wall => wall.update());
    this.objects.forEach(object => object.update());
    this.roomManager.updateUI();
  }

  // 벽 상태 관리
  makeWallInvisible(wall) {
    if (wall) {
      wall.setInvisible();
      this.architect();
    }
  }

  makeWallVisible(wall) {
    if (wall) {
      wall.setVisible();
      this.architect();
    }
  }

  splitWall(wall) {
    if (wall) {
      wall.splitWall();
      this.architect();
    }
  }

  // 도구 관련 메서드들
  nearWall(snap, range = Infinity) {
    if (!this.walls.length) return false;

    let bestDistance = Infinity;
    let bestWall = null;

    this.walls.forEach(wall => {
      const distance = wall.distanceFromPoint(snap);
      if (distance < bestDistance && distance <= range) {
        bestDistance = distance;
        bestWall = wall;
      }
    });

    return bestWall ? { wall: bestWall, distance: bestDistance } : false;
  }

  nearObject(snap, range = Infinity) {
    if (!this.objects.length) return false;

    let bestDistance = Infinity;
    let bestObject = null;

    this.objects.forEach(object => {
      const distance = object.distanceFromPoint(snap);
      if (distance < bestDistance && distance <= range) {
        bestDistance = distance;
        bestObject = object;
      }
    });

    return bestObject ? { object: bestObject, distance: bestDistance } : false;
  }

  // 저장 & 불러오기
  save() {
    const data = {
      walls: this.walls.map(wall => wall.toJSON()),
      objects: this.objects.map(object => object.toJSON()),
      rooms: this.roomManager.getRooms().map(room => room.toJSON())
    };
    return JSON.stringify(data);
  }

  load(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // 벽 불러오기
      this.walls = data.walls.map(wallData => {
        const wall = new Wall(
          wallData.start,
          wallData.end,
          wallData.type,
          wallData.thick
        );
        return Object.assign(wall, wallData);
      });

      // 오브젝트 불러오기
      this.objects = data.objects.map(objData => {
        const object = new Object2D(
          objData.family,
          objData.class,
          objData.type,
          { x: objData.x, y: objData.y },
          objData.angle,
          objData.angleSign,
          objData.size,
          objData.hinge,
          objData.thick,
          objData.value
        );
        return Object.assign(object, objData);
      });

      // 방 불러오기
      this.roomManager.loadRooms(data.rooms);

      // UI 업데이트
      this.architect();
      return true;
    } catch (error) {
      console.error('Failed to load data:', error);
      return false;
    }
  }

  // 유틸리티 메서드들
  isObjectsEquals(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  getWallsInBounds(bounds) {
    return this.walls.filter(wall => 
      wall.isInBounds(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
    );
  }

  getObjectsInBounds(bounds) {
    return this.objects.filter(object => 
      object.isInBounds(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
    );
  }

  moveWall(wall, deltaX, deltaY) {
    if (wall) {
      wall.move(deltaX, deltaY);
      this.architect();
    }
  }

  moveObject(object, deltaX, deltaY) {
    if (object) {
      object.move(deltaX, deltaY);
    }
  }

  rotateObject(object, angle) {
    if (object) {
      object.rotate(angle);
    }
  }
}