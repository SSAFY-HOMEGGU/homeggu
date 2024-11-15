// interior/components/Topbar/Topbar.js
"use client";
import React from "react";
import useCanvasStore from "../../store/canvasStore";
import { MousePointer, MinusSquare } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

const Topbar = () => {
  const { mode, setMode } = useCanvasStore();

  const handleModeChange = (newMode) => {
    if (newMode === "select" || mode !== "select") {
      setMode(newMode);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <TooltipProvider>
        <div className="flex gap-2">
          {/* Select Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === "select" ? "primary" : "ghost"}
                size="sm"
                className={mode === "select" ? "border-2 border-blue-500" : ""}
                onClick={() => handleModeChange("select")}
              >
                <MousePointer className="h-4 w-8" />
                <span className="text-2xs">선택모드</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select Tool</TooltipContent>
          </Tooltip>

          {/* Wall Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === "wall" ? "primary" : "ghost"}
                size="sm"
                className={mode === "wall" ? "border-2 border-blue-500" : ""}
                onClick={() => handleModeChange("wall")}
              >
                <MinusSquare className="h-4 w-8" />
                <span className="ml-2 text-2xs">그리기모드</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Draw Wall</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Topbar;
