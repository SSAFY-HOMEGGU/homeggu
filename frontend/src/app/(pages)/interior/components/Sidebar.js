"use client";

import React from "react";
import useFloorStore from "../../../store/floorStore";
import { FURNITURE_CONFIG } from "../config";

const Sidebar = () => {
  const {
    selectedWall,
    wallDimensions,
    setWallDimensions,
    addFurniture,
    setWallHeight,
    updateWallDimensions,
  } = useFloorStore();

  return (
    <div className="w-64 bg-white border-r p-4 space-y-4">
      {selectedWall && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">벽체 수정</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                길이 (m)
              </label>
              <input
                type="number"
                value={wallDimensions.width}
                onChange={(e) =>
                  setWallDimensions((prev) => ({
                    ...prev,
                    width: parseFloat(e.target.value),
                  }))
                }
                onBlur={updateWallDimensions}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                높이 (m)
              </label>
              <input
                type="number"
                value={wallDimensions.height}
                onChange={(e) => {
                  const newHeight = parseFloat(e.target.value);
                  setWallDimensions((prev) => ({
                    ...prev,
                    height: newHeight,
                  }));
                  setWallHeight(newHeight);
                }}
                onBlur={updateWallDimensions}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                step="0.1"
                min="0.1"
              />
            </div>
          </div>
        </div>
      )}
      <div>
        <h3 className="font-medium mb-2">가구 라이브러리</h3>
        <div className="space-y-1">
          {Object.entries(FURNITURE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100"
              onClick={() => addFurniture(type)}
            >
              <config.icon size={20} />
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
