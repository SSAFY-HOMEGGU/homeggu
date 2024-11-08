// room.js
import { ROOM_TYPES } from './types';

export class RoomManager {
  constructor() {
    this.rooms = [];
    this.globalArea = 0;
  }

  roomMaker(polygonRooms) {
    this.globalArea = 0;
    
    if (!polygonRooms.polygons.length) {
      this.rooms = [];
      return;
    }

    // 방 처리
    polygonRooms.polygons.forEach(polygon => {
      let foundRoom = false;

      for (let i = 0; i < this.rooms.length; i++) {
        const countCoords = polygon.coords.length;
        const diffCoords = qSVG.diffObjIntoArray(polygon.coords, this.rooms[i].coords);

        // 방 유효성 검사
        const isValidRoom = this.checkRoomValidity(polygon, this.rooms[i], diffCoords);

        if (isValidRoom) {
          foundRoom = true;
          this.updateRoom(this.rooms[i], polygon);
          break;
        }
      }

      if (!foundRoom) {
        this.addNewRoom(polygon);
      }
    });

    // 불필요한 방 제거
    this.removeUnusedRooms(polygonRooms);
    
    // UI 업데이트
    this.updateUI(polygonRooms);
  }

  checkRoomValidity(polygon, room, diffCoords) {
    if (polygon.way.length === room.way.length) {
      return qSVG.diffArray(polygon.way, room.way).length === 0 || diffCoords === 0;
    }
    if (polygon.way.length === room.way.length + 1) {
      return qSVG.diffArray(polygon.way, room.way).length === 1 || diffCoords === 2;
    }
    if (polygon.way.length === room.way.length - 1) {
      return qSVG.diffArray(polygon.way, room.way).length === 1;
    }
    return false;
  }

  updateRoom(room, polygon) {
    Object.assign(room, {
      area: polygon.area,
      inside: polygon.inside,
      coords: polygon.coords,
      coordsOutside: polygon.coordsOutside,
      way: polygon.way,
      coordsInside: polygon.coordsInside
    });
  }

  addNewRoom(polygon) {
    this.rooms.push({
      coords: polygon.coords,
      coordsOutside: polygon.coordsOutside,
      coordsInside: polygon.coordsInside,
      inside: polygon.inside,
      way: polygon.way,
      area: polygon.area,
      surface: '',
      name: '',
      color: 'gradientWhite',
      showSurface: true,
      action: 'add',
      type: ROOM_TYPES.NORMAL
    });
  }

  removeUnusedRooms(polygonRooms) {
    const toRemove = [];

    this.rooms.forEach((room, index) => {
      let found = false;
      for (const polygon of polygonRooms.polygons) {
        if (this.checkRoomValidity(polygon, room, qSVG.diffObjIntoArray(polygon.coords, room.coords))) {
          found = true;
          break;
        }
      }
      if (!found) toRemove.push(index);
    });

    // 인덱스를 큰 순서대로 정렬하여 제거
    toRemove.sort((a, b) => b - a).forEach(index => {
      this.rooms.splice(index, 1);
    });
  }

  updateUI(polygonRooms) {
    // DOM 요소 초기화
    document.getElementById('boxRoom').innerHTML = '';
    document.getElementById('boxSurface').innerHTML = '';
    document.getElementById('boxArea').innerHTML = '';

    this.rooms.forEach(room => {
      if (room.action === 'add') {
        this.globalArea += room.area;
      }

      // 경로 생성
      const pathCreate = this.createRoomPath(room, polygonRooms);

      // SVG 요소 생성
      this.createRoomSVG(room, pathCreate);

      // 텍스트 요소 생성
      this.createRoomText(room);
    });

    // 전체 면적 표시 업데이트
    this.updateTotalArea();
  }

  createRoomPath(room, polygonRooms) {
    let pathCreate = `M${room.coords[0].x},${room.coords[0].y}`;
    
    room.coords.slice(1).forEach(coord => {
      pathCreate += ` L${coord.x},${coord.y}`;
    });

    if (room.inside.length) {
      room.inside.forEach(insideIndex => {
        const insidePolygon = polygonRooms.polygons[insideIndex];
        const lastCoord = insidePolygon.coords[insidePolygon.coords.length - 1];
        pathCreate += ` M${lastCoord.x},${lastCoord.y}`;
        
        for (let i = insidePolygon.coords.length - 2; i >= 0; i--) {
          const coord = insidePolygon.coords[i];
          pathCreate += ` L${coord.x},${coord.y}`;
        }
      });
    }

    return pathCreate;
  }

  createRoomSVG(room, pathCreate) {
    // 방 영역 SVG
    qSVG.create('boxRoom', 'path', {
      d: pathCreate,
      fill: `url(#${room.color})`,
      'fill-opacity': 1,
      stroke: 'none',
      'fill-rule': 'evenodd',
      class: 'room'
    });

    // 표면 SVG
    qSVG.create('boxSurface', 'path', {
      d: pathCreate,
      fill: '#fff',
      'fill-opacity': 1,
      stroke: 'none',
      'fill-rule': 'evenodd',
      class: 'room'
    });
  }

  createRoomText(room) {
    const centroid = qSVG.polygonVisualCenter(room);

    // 방 이름 텍스트
    if (room.name) {
      const nameStyle = {
        color: room.color === 'gradientBlack' || room.color === 'gradientBlue' ? 'white' : '#343938'
      };
      qSVG.textOnDiv(room.name, centroid, nameStyle, 'boxArea');
      centroid.y += 20;
    }

    // 면적 텍스트
    if (room.showSurface) {
      const area = room.surface || `${(room.area / (meter * meter)).toFixed(2)} m²`;
      const areaStyle = {
        color: room.color === 'gradientBlack' || room.color === 'gradientBlue' ? 'white' : '#343938',
        fontSize: '18px',
        fontWeight: room.surface ? 'bold' : 'normal'
      };
      qSVG.textOnDiv(area, centroid, areaStyle, 'boxArea');
    }
  }

  updateTotalArea() {
    const areaElement = document.getElementById('areaValue');
    if (this.globalArea <= 0) {
      this.globalArea = 0;
      areaElement.innerHTML = '';
    } else {
      areaElement.innerHTML = `<i class="fa fa-map-o" aria-hidden="true"></i> ${(this.globalArea / 3600).toFixed(1)} m²`;
    }
  }

  rayCastingRoom(point) {
    const roomsInPoint = this.rooms.map((room, index) => ({
      room,
      index,
      inside: qSVG.rayCasting(point, room.coords)
    })).filter(item => item.inside);

    if (!roomsInPoint.length) return false;

    // 가장 작은 면적의 방 찾기
    return roomsInPoint.reduce((smallest, current) => 
      current.room.area <= smallest.room.area ? current : smallest
    ).room;
  }
}