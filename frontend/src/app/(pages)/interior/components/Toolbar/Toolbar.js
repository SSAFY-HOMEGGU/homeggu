/// src/app/interior/components/Toolbar/Toolbar.js
"use client";

import React, { useState } from "react";
import useCanvasStore from "../../store/canvasStore";
import useProjectStore from "../../store/projectStore";
import {
  MousePointer,
  MinusSquare,
  DoorOpen,
  Square,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Upload,
  Book,
  Save,
  FileDown,
  Image as ImageIcon,
} from "lucide-react";
import Catalog from "../Catalog/Catalog";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useToast } from "@/app/components/ui/use-toast";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const Toolbar = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { canvas, mode, setMode, selectedObject } = useCanvasStore();
  const { saveProject, currentProject } = useProjectStore();
  const { Toast } = useToast(); // useToast에서 addToast를 가져옵니다

  // 저장 처리 함수
  const handleSave = () => {
    if (!canvas || !currentProject) {
      toast.error("캔버스가 초기화되지 않았거나 프로젝트가 없습니다.");
      return;
    }

    try {
      // 2D 캔버스의 전체 상태 저장
      const canvasState = {
        // 캔버스 기본 상태
        fabricCanvas: canvas.canvas.toJSON([
          "id",
          "name",
          "type",
          "metadata",
          "customProperties",
        ]),

        // 벽 데이터
        walls: canvas.walls.map((wall) => ({
          x1: wall.x1,
          y1: wall.y1,
          x2: wall.x2,
          y2: wall.y2,
          thickness: wall.thickness || canvas.currentWallType.thickness,
          height: wall.height || canvas.currentWallType.height,
        })),

        // 문과 창문 데이터
        objects: canvas.canvas
          .getObjects()
          .filter((obj) => obj.type === "door" || obj.type === "window")
          .map((obj) => ({
            type: obj.type,
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            angle: obj.angle,
            wallId: obj.wallId,
          })),

        // 가구 데이터
        furniture: canvas.canvas
          .getObjects()
          .filter((obj) => obj.type === "furniture-group")
          .map((obj) => ({
            type: "furniture",
            name: obj.name,
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            angle: obj.angle,
            metadata: obj.metadata,
          })),

        // 뷰포트/줌 상태
        viewportTransform: canvas.canvas.viewportTransform,
        zoom: canvas.canvas.getZoom(),

        // 설정 상태
        settings: {
          gridVisible: canvas.gridVisible,
          snapToGrid: canvas.snapToGrid,
          gridSize: canvas.gridSize,
          currentWallType: canvas.currentWallType,
        },
      };

      // 프로젝트 데이터 구성
      const projectData = {
        id: currentProject.id,
        name: currentProject.name,
        canvasState,
        metadata: {
          lastSaved: new Date().toISOString(),
          version: "1.0",
        },
      };

      console.log("Saving project data:", projectData); // 디버깅용

      // 프로젝트 저장
      saveProject(projectData);
      toast.success("프로젝트가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("저장 중 오류가 발생했습니다: " + error.message);
    }
  };

  const handleExport = (type) => {
    if (!canvas || !canvas.canvas) return;

    const fabricCanvas = canvas.canvas;

    // 현재 캔버스 상태 저장
    const currentZoom = fabricCanvas.getZoom();
    const currentViewport = fabricCanvas.viewportTransform;

    // 캔버스를 임시로 조정
    fabricCanvas.setZoom(1);
    fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // 현재 배경색 저장
    const currentBackground = fabricCanvas.backgroundColor;
    // 배경색을 흰색으로 설정
    fabricCanvas.setBackgroundColor("#ffffff", () => {
      fabricCanvas.renderAll();

      // 캔버스의 경계 계산
      const objects = fabricCanvas.getObjects();
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      objects.forEach((obj) => {
        const bound = obj.getBoundingRect();
        minX = Math.min(minX, bound.left);
        minY = Math.min(minY, bound.top);
        maxX = Math.max(maxX, bound.left + bound.width);
        maxY = Math.max(maxY, bound.top + bound.height);
      });

      // 여백 추가
      const margin = 50;
      minX -= margin;
      minY -= margin;
      maxX += margin;
      maxY += margin;

      const width = maxX - minX;
      const height = maxY - minY;

      if (type === "jpg") {
        // JPG로 내보내기
        const dataUrl = fabricCanvas.toDataURL({
          format: "jpeg",
          quality: 1.0,
          left: minX,
          top: minY,
          width: width,
          height: height,
        });

        const link = document.createElement("a");
        link.download = "floorplan.jpg";
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (type === "pdf") {
        // PDF로 내보내기
        const pdf = new jsPDF({
          orientation: width > height ? "landscape" : "portrait",
          unit: "px",
          format: [width, height],
        });

        const dataUrl = fabricCanvas.toDataURL({
          format: "jpeg",
          quality: 1.0,
          left: minX,
          top: minY,
          width: width,
          height: height,
        });

        pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
        pdf.save("floorplan.pdf");
      }

      // 원래의 배경색으로 복구
      fabricCanvas.setBackgroundColor(currentBackground, () => {
        // 원래의 뷰포트 상태로 복구
        fabricCanvas.setZoom(currentZoom);
        fabricCanvas.setViewportTransform(currentViewport);
        fabricCanvas.renderAll();
      });
    });

    setShowExportMenu(false);
  };

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
    setMode(newMode);
  };

  const tools = [
    {
      id: "door",
      icon: DoorOpen,
      label: "Add Door",
      action: () => handleModeChange("door"), // canvas.createDoor 대신 모드 변경
    },
    {
      id: "window",
      icon: Square,
      label: "Add Window",
      action: () => handleModeChange("window"),
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

      {/* Save Button 추가 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              <span className="ml-2">저장</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>프로젝트 저장하기</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
                onClick={() => handleModeChange("door")}
              >
                <DoorOpen className="h-4 w-4" />
                <span className="ml-2 text-xs">문 추가</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>문 추가하기</TooltipContent>
          </Tooltip>

          {/* Window Tool */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === "window" ? "primary" : "ghost"}
                size="sm"
                className={mode === "window" ? "border-2 border-blue-500" : ""}
                onClick={() => handleModeChange("window")}
              >
                <Square className="h-4 w-4" />
                <span className="ml-2 text-xs">창문</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>창문 추가하기</TooltipContent>
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

      {/* File Controls */}
      <div className="flex gap-1">
        <TooltipProvider>
          {/* Export 버튼과 드롭다운 */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>2D도면 내보내기</TooltipContent>
            </Tooltip>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <button
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center"
                    onClick={() => handleExport("jpg")}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Export as JPG
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center"
                    onClick={() => handleExport("pdf")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export as PDF
                  </button>
                </div>
              </>
            )}
          </div>

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

      {/* 드롭다운 메뉴가 열려있을 때 클릭 이벤트를 감지하여 닫기 위한 오버레이 */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportMenu(false)}
        />
      )}

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
