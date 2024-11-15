import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

export const createWall = (points, options = {}) => {
  return new fabric.Line(points, {
    id: uuidv4(),
    type: "wall",
    stroke: "#000000",
    strokeWidth: 5,
    selectable: true,
    hasControls: true,
    ...options,
  });
};

export const createDoor = (options = {}) => {
  const width = options.width || 60;
  const height = options.height || 10;

  const door = new fabric.Group([], {
    id: uuidv4(),
    type: "door",
    left: options.left || 100,
    top: options.top || 100,
  });

  const frame = new fabric.Rect({
    width: width,
    height: height,
    fill: "#8B4513",
    stroke: "#000000",
    strokeWidth: 1,
  });

  const arc = new fabric.Path(
    `M 0 ${height} A ${width} ${width} 0 0 1 ${width} ${height}`,
    {
      fill: "transparent",
      stroke: "#000000",
      strokeWidth: 1,
    }
  );

  door.addWithUpdate([frame, arc]);
  return door;
};

export const createWindow = (options = {}) => {
  const width = options.width || 40;
  const height = options.height || 10;

  return new fabric.Rect({
    id: uuidv4(),
    type: "window",
    left: options.left || 100,
    top: options.top || 100,
    width: width,
    height: height,
    fill: "#87CEEB",
    stroke: "#000000",
    strokeWidth: 1,
    ...options,
  });
};
