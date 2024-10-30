"use client";

import React from "react";
import useFloorStore from "../../../store/floorStore";

const RoomDetails = () => {
  const { rotationAngle, area } = useFloorStore();

  return (
    <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-3 space-y-1">
      <p className="text-sm font-medium">회전: {rotationAngle}°</p>
      <p className="text-sm font-medium">면적: {area}m²</p>
    </div>
  );
};

export default RoomDetails;
