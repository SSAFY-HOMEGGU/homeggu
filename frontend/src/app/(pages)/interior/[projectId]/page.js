"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Canvas from "../components/Canvas/Canvas";
import Viewer3D from "../components/Viewer3D/Viewer3D";
import Topbar from "../components/Toolbar/Topbar";
import Toolbar from "../components/Toolbar/Toolbar";
import useCanvasStore from "../store/canvasStore";
import useProjectStore from "../store/projectStore";
import { toast } from "react-toastify";

const InteriorProjectPage = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const { setCurrentView } = useCanvasStore();
  const { loadProject, currentProject, saveProject } = useProjectStore();
  const [view, setView] = React.useState("2d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const project = loadProject(projectId);
        if (!project) {
          toast.error("프로젝트를 찾을 수 없습니다.");
          router.push("/interior");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load project:", error);
        toast.error("프로젝트 로드 중 오류가 발생했습니다.");
        router.push("/interior");
      }
    };

    loadProjectData();
  }, [projectId, loadProject, router]);

  const handleViewChange = (newView) => {
    setView(newView);
    setCurrentView(newView);
  };
  // Auto-save functionality
  const handleAutoSave = (canvasInstance) => {
    if (!currentProject || !canvasInstance) {
      return;
    }

    try {
      const canvasState = {
        fabricCanvas: canvasInstance.canvas.toJSON([
          "id",
          "name",
          "type",
          "metadata",
          "customProperties",
        ]),
        walls: canvasInstance.walls.map((wall) => ({
          x1: wall.x1,
          y1: wall.y1,
          x2: wall.x2,
          y2: wall.y2,
          thickness: wall.thickness || canvasInstance.currentWallType.thickness,
          height: wall.height || canvasInstance.currentWallType.height,
        })),
        objects: canvasInstance.canvas
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
        furniture: canvasInstance.canvas
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
        viewportTransform: canvasInstance.canvas.viewportTransform,
        zoom: canvasInstance.canvas.getZoom(),
        settings: {
          gridVisible: canvasInstance.gridVisible,
          snapToGrid: canvasInstance.snapToGrid,
          gridSize: canvasInstance.gridSize,
          currentWallType: canvasInstance.currentWallType,
        },
      };

      const projectData = {
        ...currentProject,
        data: { canvasState },
        lastModified: new Date().toISOString(),
      };

      saveProject(projectData);
      toast.success("프로젝트가 저장되었습니다.");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentProject) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-white shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/interior")}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 목록으로 돌아가기
            </button>
            <h1 className="text-xl font-semibold">{currentProject.name}</h1>
          </div>
          <Topbar onSave={handleAutoSave} />
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                view === "2d"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white`}
              onClick={() => handleViewChange("2d")}
            >
              2D View
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                view === "3d"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white`}
              onClick={() => handleViewChange("3d")}
            >
              3D View
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <div
            className={`absolute inset-0 ${
              view === "2d" ? "visible" : "invisible"
            }`}
          >
            <Canvas projectId={projectId} onAutoSave={handleAutoSave} />
          </div>
          <div
            className={`absolute inset-0 ${
              view === "3d" ? "visible" : "invisible"
            }`}
          >
            <Viewer3D />
          </div>
        </div>
      </div>

      <div className="w-40 border-l bg-white shadow-lg">
        <Toolbar />
      </div>
    </div>
  );
};

export default InteriorProjectPage;
