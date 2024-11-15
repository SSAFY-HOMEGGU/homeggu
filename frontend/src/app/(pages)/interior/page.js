//interior/page.js
"use client";
import React, { useState } from "react";
import Canvas from "./components/Canvas/Canvas";
import Viewer3D from "./components/Viewer3D/Viewer3D";
import Toolbar from "./components/Toolbar/Toolbar";

const InteriorPage = () => {
  const [view, setView] = useState("2d");

  return (
    <div className="flex h-screen w-full overflow-hidden mb-10">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-2 border-b bg-white">
          <h1 className="text-xl font-semibold">Floor Planner</h1>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded text-sm ${
                view === "2d" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => setView("2d")}
            >
              2D View
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${
                view === "3d" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
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
