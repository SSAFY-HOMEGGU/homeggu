import React from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";

const NavigationController = ({ onMove, onZoomIn, onZoomOut, onReset }) => {
  const buttonStyle =
    "bg-white hover:bg-gray-100 p-1 rounded-full shadow-md active:shadow-inner transition-all duration-200";
  const zoomStyle =
    "bg-white hover:bg-gray-100 p-1 rounded-full shadow-md active:shadow-inner transition-all w-5 h-5";
  const iconStyle = "w-3 h-3 text-gray-700";

  const handleMove = (dx, dy) => {
    onMove(dx * 100, dy * 100);
  };

  return (
    <div className="absolute right-4 top-4 flex flex-col gap-3">
      {/* Navigation Controller */}
      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg flex flex-col items-center gap-1">
        <button className={buttonStyle} onClick={() => handleMove(0, 1)}>
          <ChevronUp className={iconStyle} />
        </button>

        <div className="flex gap-1 items-center">
          <button className={buttonStyle} onClick={() => handleMove(1, 0)}>
            <ChevronLeft className={iconStyle} />
          </button>

          <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          </div>

          <button className={buttonStyle} onClick={() => handleMove(-1, 0)}>
            <ChevronRight className={iconStyle} />
          </button>
        </div>

        <button className={buttonStyle} onClick={() => handleMove(0, -1)}>
          <ChevronDown className={iconStyle} />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex justify-around">
        <button className={zoomStyle} onClick={onZoomIn}>
          <ZoomIn className={iconStyle} />
        </button>
        <button className={zoomStyle} onClick={onZoomOut}>
          <ZoomOut className={iconStyle} />
        </button>
        <button className={zoomStyle} onClick={onReset}>
          <RotateCw className={iconStyle} />
        </button>
      </div>
    </div>
  );
};

export default NavigationController;
