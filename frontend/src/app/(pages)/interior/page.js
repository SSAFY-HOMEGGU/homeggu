"use client";

import React from "react";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import RoomDetails from "./components/RoomDetails";

const RoomDesigner = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Toolbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 p-4 relative">
          <Canvas />
          <RoomDetails />
        </div>
      </div>
    </div>
  );
};

export default RoomDesigner;
