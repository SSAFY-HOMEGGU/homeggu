"use client";

import React from "react";
import {
  MousePointer2,
  Square,
  Trash2,
  RotateCw,
  Maximize2,
  Save,
} from "lucide-react";
import useFloorStore from "../../../store/floorStore";

const Toolbar = () => {
  const { mode, setMode, deleteSelected, activeTools } = useFloorStore();

  return (
    <div className="h-16 bg-white border-b flex items-center px-4 space-x-4">
      <button
        className={`p-2 rounded ${
          mode === "select" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
        }`}
        onClick={() => setMode("select")}
        title="선택"
      >
        <MousePointer2 size={20} />
      </button>
      <button
        className={`p-2 rounded ${
          mode === "wall" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
        }`}
        onClick={() => setMode("wall")}
        title="벽 그리기"
      >
        <Square size={20} />
      </button>
      <div className="h-6 w-px bg-gray-300" />
      <button
        className={`p-2 rounded hover:bg-gray-100 ${
          activeTools.includes("delete") ? "" : "opacity-50 cursor-not-allowed"
        }`}
        onClick={deleteSelected}
        disabled={!activeTools.includes("delete")}
        title="삭제"
      >
        <Trash2 size={20} />
      </button>
      <button
        className={`p-2 rounded hover:bg-gray-100 ${
          activeTools.includes("rotate") ? "" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!activeTools.includes("rotate")}
        title="회전"
      >
        <RotateCw size={20} />
      </button>
      <button
        className={`p-2 rounded hover:bg-gray-100 ${
          activeTools.includes("resize") ? "" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!activeTools.includes("resize")}
        title="크기 조절"
      >
        <Maximize2 size={20} />
      </button>
      <div className="h-6 w-px bg-gray-300" />
      <button className="p-2 rounded hover:bg-gray-100" title="저장">
        <Save size={20} />
      </button>
    </div>
  );
};

export default Toolbar;
