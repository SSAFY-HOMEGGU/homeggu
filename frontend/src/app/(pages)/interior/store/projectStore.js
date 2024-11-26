// interior/store/projectStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,

      createProject: (name) => {
        const newProject = {
          id: uuidv4(),
          name,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          data: {
            canvasState: {
              walls: [],
              furniture: [],
              objects: [],
              settings: {
                gridVisible: true,
                snapToGrid: true,
                gridSize: 20,
                currentWallType: {
                  thickness: 10,
                  height: 250,
                },
              },
            },
          },
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));

        return newProject;
      },

      saveProject: (projectData) => {
        const updatedData = {
          ...projectData,
          lastModified: new Date().toISOString(),
          data: {
            canvasState: {
              ...projectData.data?.canvasState,
              // 가구 데이터가 있는 경우 deep clone하여 저장
              furniture: projectData.data?.canvasState?.furniture?.map(
                (item) => ({
                  ...item,
                  metadata: {
                    ...item.metadata,
                    model3D: item.metadata?.model3D
                      ? {
                          ...item.metadata.model3D,
                        }
                      : null,
                  },
                })
              ),
            },
          },
        };

        set((state) => {
          const updatedProjects = state.projects.map((p) =>
            p.id === projectData.id ? updatedData : p
          );

          return {
            projects: updatedProjects,
            currentProject: updatedData,
          };
        });

        // 디버깅용 로그
        console.log("Saved project data:", updatedData);
      },

      loadProject: (projectId) => {
        const state = get();
        const project = state.projects.find((p) => p.id === projectId);

        if (project) {
          // 프로젝트 데이터 유효성 검사 및 복구
          const validatedProject = {
            ...project,
            data: {
              canvasState: {
                walls: project.data?.canvasState?.walls || [],
                furniture: project.data?.canvasState?.furniture || [],
                objects: project.data?.canvasState?.objects || [],
                settings: {
                  gridVisible:
                    project.data?.canvasState?.settings?.gridVisible ?? true,
                  snapToGrid:
                    project.data?.canvasState?.settings?.snapToGrid ?? true,
                  gridSize: project.data?.canvasState?.settings?.gridSize ?? 20,
                  currentWallType: project.data?.canvasState?.settings
                    ?.currentWallType ?? {
                    thickness: 10,
                    height: 250,
                  },
                },
              },
            },
          };

          set({ currentProject: validatedProject });
          console.log("Loaded project data:", validatedProject);
          return validatedProject;
        }

        return null;
      },

      deleteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          currentProject:
            state.currentProject?.id === projectId
              ? null
              : state.currentProject,
        }));
      },

      clearCurrentProject: () => {
        set({ currentProject: null });
      },
    }),
    {
      name: "project-storage",
      getStorage: () => localStorage,
      serialize: (state) => {
        try {
          return JSON.stringify(state, (key, value) => {
            // 순환 참조 방지를 위한 특수 처리
            if (key === "fabricObject") return undefined;
            return value;
          });
        } catch (error) {
          console.error("Failed to serialize project data:", error);
          return JSON.stringify({ projects: [], currentProject: null });
        }
      },
      deserialize: (str) => {
        try {
          const state = JSON.parse(str);
          // 데이터 구조 검증
          if (!state.projects) state.projects = [];
          if (state.currentProject) {
            if (!state.currentProject.data) state.currentProject.data = {};
            if (!state.currentProject.data.canvasState) {
              state.currentProject.data.canvasState = {
                walls: [],
                furniture: [],
                objects: [],
                settings: {
                  gridVisible: true,
                  snapToGrid: true,
                  gridSize: 20,
                  currentWallType: {
                    thickness: 10,
                    height: 250,
                  },
                },
              };
            }
          }
          return state;
        } catch (err) {
          console.error("Failed to parse project data:", err);
          return { projects: [], currentProject: null };
        }
      },
    }
  )
);

export default useProjectStore;
