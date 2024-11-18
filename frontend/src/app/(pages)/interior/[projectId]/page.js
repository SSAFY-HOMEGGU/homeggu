"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Canvas from "../components/Canvas/Canvas";
import Viewer3D from "../components/Viewer3D/Viewer3D";
import Topbar from "../components/Toolbar/Topbar";
import Toolbar from "../components/Toolbar/Toolbar";
import useCanvasStore from "../store/canvasStore";
import useProjectStore from "../store/projectStore";

const InteriorProjectPage = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const { setCurrentView } = useCanvasStore();
  const { loadProject, currentProject, saveProject } = useProjectStore();
  const [view, setView] = React.useState("2d");

  useEffect(() => {
    const project = loadProject(projectId);
    if (!project) {
      router.push("/interior");
      return;
    }
  }, [projectId, loadProject, router]);

  const handleViewChange = (newView) => {
    setView(newView);
    setCurrentView(newView);
  };

  // Auto-save functionality
  const handleAutoSave = (canvasData) => {
    if (currentProject) {
      saveProject(canvasData);
    }
  };

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
              ← Back to Projects
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
