export const GRID_SIZE = 20;

export const OBJECT_TYPES = {
  WALL: "wall",
  DOOR: "door",
  WINDOW: "window",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
  TEXT: "text",
  IMAGE: "image",
};

export const MODES = {
  SELECT: "select",
  WALL: "wall",
  DOOR: "door",
  WINDOW: "window",
  SHAPE: "shape",
  TEXT: "text",
};

export const DEFAULT_COLORS = {
  WALL: "#000000",
  DOOR: "#8B4513",
  WINDOW: "#87CEEB",
  SHAPE_FILL: "#ffffff",
  SHAPE_STROKE: "#000000",
  TEXT: "#000000",
};

export const CANVAS_DEFAULTS = {
  GRID_COLOR: "#CCCCCC",
  GRID_LINE_WIDTH: 0.5,
  BACKGROUND_COLOR: "#FFFFFF",
  SELECTION_COLOR: "rgba(33, 150, 243, 0.3)",
  SELECTION_LINE_WIDTH: 2,
  SELECTION_BORDER_COLOR: "#2196F3",
  CORNER_COLOR: "#2196F3",
  CORNER_SIZE: 10,
  OBJECT_PADDING: 10,
};

export const SNAP_THRESHOLD = 10;
export const SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
