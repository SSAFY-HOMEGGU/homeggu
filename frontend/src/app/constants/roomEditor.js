// src/app/constants/roomEditor.js

// 에디터 기본 설정
export const EDITOR_CONFIG = {
  GRID_SIZE: 50, // 1m = 50px
  SNAP_GRID: 5, // 0.1m = 5px
  SNAP_ANGLE: 15, // 15도 단위 회전
  WALL_THICKNESS: 10, // 10cm
  DEFAULT_WALL_HEIGHT: 230, // 2.3m
  DEFAULT_ROOM_WIDTH: 400, // 4m
  DEFAULT_ROOM_HEIGHT: 300, // 3m
};

// 도구 유형
export const TOOL_TYPES = {
  WALL: "wall",
  DOOR: "door",
  WINDOW: "window",
  DIMENSION: "dimension",
  SELECT: "select",
};

// 문 유형
export const DOOR_TYPES = {
  SINGLE_DOOR: {
    id: "single_door",
    label: "외여닫이문",
    width: 90, // cm
    height: 200, // cm
    icon: "🚪",
    description: "일반적인 외여닫이 문",
  },
  DOUBLE_DOOR: {
    id: "double_door",
    label: "양여닫이문",
    width: 120,
    height: 200,
    icon: "🚪🚪",
    description: "양쪽으로 열리는 문",
  },
  SLIDING_DOOR: {
    id: "sliding_door",
    label: "미닫이문",
    width: 120,
    height: 200,
    icon: "⬌",
    description: "옆으로 미는 문",
  },
};

// 창문 유형
export const WINDOW_TYPES = {
  FIXED: {
    id: "fixed_window",
    label: "고정창",
    width: 90,
    height: 120,
    sillHeight: 90, // 창대 높이
    icon: "⬚",
    description: "열리지 않는 고정 창문",
  },
  SLIDING: {
    id: "sliding_window",
    label: "미닫이창",
    width: 120,
    height: 120,
    sillHeight: 90,
    icon: "⇆",
    description: "좌우로 미는 창문",
  },
  CASEMENT: {
    id: "casement_window",
    label: "여닫이창",
    width: 90,
    height: 120,
    sillHeight: 90,
    icon: "⇌",
    description: "바깥으로 여는 창문",
  },
};

// 객체 타입
export const OBJECT_TYPES = {
  WALL: "wall",
  DEFAULT_WALL: "defaultWall",
  DEFAULT_ROOM: "defaultRoom",
  DOOR: "door",
  WINDOW: "window",
  DIMENSION: "dimension",
  AREA_TEXT: "areaText",
  TEMP_WALL: "tempWall",
};

// 측정 단위 변환
export const UNITS = {
  PIXELS_PER_METER: 50, // 1m = 50px
  PIXELS_PER_CM: 0.5, // 1cm = 0.5px
  SQ_METERS_PER_PYEONG: 3.3058, // 1평 = 3.3058㎡
};
