"use client";
import React, { useState } from "react";
import useCanvasStore from "../../store/canvasStore";
import {
  MousePointer,
  MinusSquare,
  DoorOpen,
  Square, // Window 대신 Square 사용
  Undo2,
  Redo2,
  Trash2,
  Grid,
  Magnet,
  ZoomIn,
  Download,
  Upload,
  Book,
} from "lucide-react";
import Catalog from "../Catalog/Catalog";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Separator } from "@/app/components/ui/separator";

const Toolbar = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { canvas, mode, setMode } = useCanvasStore();

  const handleCatalogItemSelect = (item) => {
    if (!canvas || !item) return;

    if (item.type === "wall") {
      // FloorPlanner의 setWallType 호출
      const wallType = {
        thickness: item.thickness,
        height: item.height,
      };
      canvas.setWallType?.(wallType);
      setMode("wall");
    }
    setIsCatalogOpen(false);
  };

  const tools = [
    {
      id: "select",
      icon: MousePointer,
      label: "Select Tool",
      action: () => setMode("select"),
    },
    {
      id: "wall",
      icon: MinusSquare,
      label: "Draw Wall",
      action: () => {
        if (mode === "select") return; // select 모드일 때는 wall 모드로 변경하지 않음
        setMode("wall");
      },
    },
    {
      id: "door",
      icon: DoorOpen,
      label: "Add Door",
      action: () => {
        if (mode === "select") return; // select 모드일 때는 door 추가하지 않음
        if (canvas) {
          canvas.createDoor?.();
          setMode("select");
        }
      },
    },
    {
      id: "window",
      icon: Square,
      label: "Add Window",
      action: () => {
        if (mode === "select") return; // select 모드일 때는 window 추가하지 않음
        if (canvas) {
          canvas.createWindow?.();
          setMode("select");
        }
      },
    },
  ];

  const handleUndo = () => {
    canvas?.undo?.();
  };

  const handleRedo = () => {
    canvas?.redo?.();
  };

  const handleDelete = () => {
    canvas?.deleteSelected?.();
  };

  const toggleGrid = () => {
    canvas?.toggleGrid?.();
  };

  const toggleSnap = () => {
    canvas?.toggleSnapToGrid?.();
  };

  const handleZoomToFit = () => {
    canvas?.zoomToFit?.();
  };

  const handleExport = () => {
    if (!canvas) return;

    const json = canvas.toJSON?.();
    if (!json) return;

    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "floorplan.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target?.files?.[0];
      if (!file || !canvas) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === "string") {
            const json = JSON.parse(result);
            canvas.loadFromJSON?.(json);
          }
        } catch (error) {
          console.error("Error loading file:", error);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };
  return (
    <div className="p-2 flex flex-col gap-2 w-1/10">
      {/* Catalog Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setIsCatalogOpen(true)}
      >
        <Book className="h-4 w-2" />
        <span className="ml-2">Catalog</span>
      </Button>

      {/* Tools */}
      <TooltipProvider>
        <div className="grid grid-cols-2 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === "select" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMode("select")}
              >
                <MousePointer className="h-4 w-4" />
                <span className="ml-2 text-xs">Select</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select Tool</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === "wall" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMode("wall")}
              >
                <MinusSquare className="h-4 w-4" />
                <span className="ml-2 text-xs">Wall</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Draw Wall</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  canvas?.createDoor?.();
                  setMode("select");
                }}
              >
                <DoorOpen className="h-4 w-4" />
                <span className="ml-2 text-xs">Door</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Door</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  canvas?.createWindow?.();
                  setMode("select");
                }}
              >
                <Square className="h-4 w-4" />
                <span className="ml-2 text-xs">Window</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Window</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* History & Edit Controls */}
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Selected</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* View Controls */}
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleGrid}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSnap}
              >
                <Magnet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Snap</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomToFit}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom to Fit</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* File Controls */}
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleImport}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Catalog Dialog */}
      <Catalog
        open={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectItem={handleCatalogItemSelect}
      />
    </div>
  );
};

export default Toolbar;
