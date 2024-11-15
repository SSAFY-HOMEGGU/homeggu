import React from "react";
import useCanvasStore from "../../store/canvasStore";
import { Square, Circle, Minus, Type, Image, Box } from "lucide-react";

const ObjectList = () => {
  const { canvas, objectList, setActiveObject } = useCanvasStore();

  const handleObjectClick = (objectId) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const object = objects.find((obj) => obj.id === objectId);
    if (object) {
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };

  const getIconComponent = (type) => {
    switch (type.toLowerCase()) {
      case "rect":
        return Square;
      case "circle":
        return Circle;
      case "line":
        return Minus;
      case "i-text":
        return Type;
      case "image":
        return Image;
      default:
        return Box;
    }
  };

  return (
    <div className="max-h-60 overflow-y-auto">
      {objectList.map((obj) => {
        const IconComponent = getIconComponent(obj.type);
        return (
          <div
            key={obj.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
            onClick={() => handleObjectClick(obj.id)}
          >
            <IconComponent size={16} />
            <span className="text-sm truncate">
              {obj.name || `${obj.type} ${obj.id?.slice(0, 4)}`}
            </span>
          </div>
        );
      })}
      {objectList.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-2">
          No objects added yet
        </div>
      )}
    </div>
  );
};

export default ObjectList;
