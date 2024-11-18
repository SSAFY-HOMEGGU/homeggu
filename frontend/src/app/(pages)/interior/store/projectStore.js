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
            canvasState: null,
          },
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));

        return newProject;
      },

      saveProject: (projectData) => {
        set((state) => {
          const updatedProject = {
            ...projectData,
            lastModified: new Date().toISOString(),
          };

          const updatedProjects = state.projects.map((p) =>
            p.id === projectData.id ? updatedProject : p
          );

          return {
            projects: updatedProjects,
            currentProject: updatedProject,
          };
        });
      },

      loadProject: (projectId) => {
        const state = get();
        const project = state.projects.find((p) => p.id === projectId);

        if (project) {
          set({ currentProject: project });
          return project;
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
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (err) {
          console.error("Failed to parse project data:", err);
          return { projects: [], currentProject: null };
        }
      },
    }
  )
);

export default useProjectStore;
