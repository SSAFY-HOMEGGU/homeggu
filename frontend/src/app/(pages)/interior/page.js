//interior/page.js
"use client";
import React, { useState } from "react";
import Canvas from "./components/Canvas/Canvas";
import Viewer3D from "./components/Viewer3D/Viewer3D";
import Topbar from "./components/Toolbar/Topbar";
import Toolbar from "./components/Toolbar/Toolbar";

const InteriorPage = () => {
  const [view, setView] = useState("2d");

  return (
    <div className="flex h-screen w-full overflow-hidden mb-10">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-white shadow-md">
          {/* 좌측 상단바 */}
          <Topbar />
          {/* 중앙 뷰 전환 버튼 */}
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                view === "2d"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white`}
              onClick={() => setView("2d")}
            >
              2D View
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                view === "3d"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white`}
              onClick={() => setView("3d")}
            >
              3D View
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {view === "2d" ? <Canvas /> : <Viewer3D />}
        </div>
      </div>

      <div className="w-40 border-l bg-white shadow-lg">
        {" "}
        {/* 너비를 40(160px)로 줄임 */}
        <Toolbar />
      </div>
    </div>
  );
};

export default InteriorPage;
