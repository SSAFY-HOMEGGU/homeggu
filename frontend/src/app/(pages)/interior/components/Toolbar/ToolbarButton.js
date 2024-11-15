import React from "react";
import {
  Cursor,
  Minus,
  Square,
  Circle,
  DoorOpen,
  Window,
  Type,
  Box,
  Image,
  Upload,
} from "lucide-react";

const iconComponents = {
  cursor: Cursor,
  minus: Minus,
  square: Square,
  circle: Circle,
  "door-open": DoorOpen,
  window: Window,
  type: Type,
  box: Box,
  image: Image,
  upload: Upload,
};

const ToolbarButton = ({ icon, label, active, onClick }) => {
  const IconComponent = iconComponents[icon.toLowerCase()];

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found`);
    return null;
  }

  return (
    <button
      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
        active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
      title={label}
    >
      <IconComponent size={20} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default ToolbarButton;
