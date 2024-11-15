import React from "react";
import useCanvasStore from "../../store/canvasStore";

const ColorPicker = () => {
  const { canvas, activeObject } = useCanvasStore();

  const updateColor = (property, color) => {
    if (!canvas || !activeObject) return;

    activeObject.set(property, color);
    canvas.renderAll();
  };

  const colors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#808080",
    "#800000",
    "#808000",
    "#008000",
    "#800080",
    "#008080",
    "#000080",
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Fill Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={`fill-${color}`}
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => updateColor("fill", color)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Stroke Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={`stroke-${color}`}
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => updateColor("stroke", color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
