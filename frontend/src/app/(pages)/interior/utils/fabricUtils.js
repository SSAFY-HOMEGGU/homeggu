import { fabric } from "fabric";

export const initializeFabricCanvas = (canvas) => {
  // Canvas settings
  canvas.selection = true;
  canvas.preserveObjectStacking = true;

  // Enable object controls
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: "#2196F3",
    cornerColor: "#2196F3",
    cornerStyle: "circle",
    cornerSize: 10,
    padding: 10,
  });
};

export const handleCanvasEvents = (canvas, handlers) => {
  canvas.on("selection:created", handlers.onObjectSelected);
  canvas.on("selection:updated", handlers.onObjectSelected);
  canvas.on("selection:cleared", handlers.onSelectionCleared);
  canvas.on("object:modified", handlers.onObjectModified);

  return () => {
    canvas.off("selection:created", handlers.onObjectSelected);
    canvas.off("selection:updated", handlers.onObjectSelected);
    canvas.off("selection:cleared", handlers.onSelectionCleared);
    canvas.off("object:modified", handlers.onObjectModified);
  };
};

export const addShape = (canvas, type) => {
  let shape;

  switch (type) {
    case "rectangle":
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 1,
      });
      break;
    case "circle":
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 1,
      });
      break;
    default:
      return;
  }

  canvas.add(shape);
  canvas.setActiveObject(shape);
  canvas.renderAll();
};

export const addWall = (canvas, points) => {
  const line = new fabric.Line(points, {
    stroke: "#000000",
    strokeWidth: 5,
    selectable: true,
    hasControls: true,
  });

  canvas.add(line);
  canvas.renderAll();
  return line;
};

export const addDoor = (canvas) => {
  const door = new fabric.Rect({
    left: 100,
    top: 100,
    width: 60,
    height: 10,
    fill: "#8B4513",
    stroke: "#000000",
    strokeWidth: 1,
  });

  canvas.add(door);
  canvas.setActiveObject(door);
  canvas.renderAll();
};

export const addWindow = (canvas) => {
  const window = new fabric.Rect({
    left: 100,
    top: 100,
    width: 40,
    height: 10,
    fill: "#87CEEB",
    stroke: "#000000",
    strokeWidth: 1,
  });

  canvas.add(window);
  canvas.setActiveObject(window);
  canvas.renderAll();
};

export const addText = (canvas) => {
  const text = new fabric.IText("Double click to edit", {
    left: 100,
    top: 100,
    fontFamily: "Arial",
    fontSize: 20,
    fill: "#000000",
  });

  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
};

export const addImage = (canvas, url) => {
  fabric.Image.fromURL(url, (img) => {
    img.scale(0.5);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  });
};
