//interior/components/Toolbar/Toolbar.js

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

const Toolbar = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const {
    canvas,
    mode,
    setMode,
    gridVisible,
    toggleGrid,
    toggleSnapToGrid,
    snapToGrid,
    selectedObject,
  } = useCanvasStore(); // selectedObject 가져오기

  const handleCatalogItemSelect = (item) => {
    if (!canvas || !item) return;

    if (item.type === "wall") {
      const wallType = {
        thickness: item.thickness,
        height: item.height,
      };
      canvas.setWallType?.(wallType);
      setMode("wall");
    }
    setIsCatalogOpen(false);
  };

  const handleModeChange = (newMode) => {
    if (newMode === "select" || mode !== "select") {
      setMode(newMode);
    }
  };

  const tools = [
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
        <span className="ml-2">Catlog</span>
      </Button>

      {/* Tools */}
      {/* Tools */}
      <TooltipProvider>
        <div className="grid grid-cols-2 gap-1">
          {/* Door Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === "door" ? "primary" : "ghost"}
                size="sm"
                className={mode === "door" ? "border-2 border-blue-500" : ""}
                onClick={() => {
                  canvas?.createDoor?.();
                  handleModeChange("select");
                }}
              >
                <DoorOpen className="h-4 w-4" />
                <span className="ml-2 text-xs">Door</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Door</TooltipContent>
          </Tooltip>

          {/* Window Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === "window" ? "primary" : "ghost"}
                size="sm"
                className={mode === "window" ? "border-2 border-blue-500" : ""}
                onClick={() => {
                  canvas?.createWindow?.();
                  handleModeChange("select");
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
                variant={gridVisible ? "primary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={toggleGrid} // actions.toggleGrid 대신
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={snapToGrid ? "primary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={toggleSnapToGrid} // actions.toggleSnap 대신
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

      {/* Object Properties Panel */}
      {selectedObject && (
        <div className="border-t mt-2 pt-2 space-y-1">
          <h3 className="font-bold">속성</h3>
          <div className="space-y-1">
            <div>
              <label className="block text-xs font-semibold">이름</label>
              <input type="text" value={selectedObject.name} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">X1 좌표</label>
              <input type="number" value={selectedObject.x1} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">Y1 좌표</label>
              <input type="number" value={selectedObject.y1} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">X2 좌표</label>
              <input type="number" value={selectedObject.x2} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">Y2 좌표</label>
              <input type="number" value={selectedObject.y2} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">길이</label>
              <input type="number" value={selectedObject.length} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">높이</label>
              <input type="number" value={selectedObject.height} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">두께</label>
              <input type="number" value={selectedObject.thickness} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">텍스처 A</label>
              <input type="text" value={selectedObject.textureA} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold">텍스처 B</label>
              <input type="text" value={selectedObject.textureB} readOnly />
            </div>
          </div>
        </div>
      )}

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
