// src/app/3ds/components/room/EditorToolbar/ToolButton.jsx
"use client";

import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

const ToolButton = ({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
  className,
}) => {
  if (!Icon) return null; // 아이콘이 없을 경우 null 반환

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "default" : "outline"}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 w-24 ${className || ""}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolButton;
