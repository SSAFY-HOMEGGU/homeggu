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
          data: null,
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));

        return newProject;
      },

      saveProject: (projectData) => {
        set((state) => {
          const currentProject = state.currentProject;
          if (!currentProject) return state;

          const updatedProject = {
            ...currentProject,
            lastModified: new Date().toISOString(),
            data: projectData,
          };

          const updatedProjects = state.projects.map((p) =>
            p.id === currentProject.id ? updatedProject : p
          );

          return {
            projects: updatedProjects,
            currentProject: updatedProject,
          };
        });
      },

      loadProject: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
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
    }
  )
);

export default useProjectStore;
