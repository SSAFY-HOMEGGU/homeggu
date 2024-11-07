import { create } from "zustand";

const useFloorStore = create((set) => ({
  mode: "select",
  setMode: (mode) => set({ mode }),

  selectedObjects: [],
  setSelectedObjects: (objects) => set({ selectedObjects: objects }),

  activeTools: [],
  setActiveTools: (tools) => set({ activeTools: tools }),

  wallHeight: 2.3,
  setWallHeight: (height) => set({ wallHeight: height }),

  wallDimensions: { width: 4, height: 2.3 },
  setWallDimensions: (dimensions) => set({ wallDimensions: dimensions }),

  selectedWall: null,
  setSelectedWall: (wall) => set({ selectedWall: wall }),

  rotationAngle: 0,
  setRotationAngle: (angle) => set({ rotationAngle: angle }),

  area: 12,
  setArea: (area) => set({ area }),

  deleteSelected: () => {
    set({
      selectedObjects: [],
      activeTools: [],
      selectedWall: null,
    });
  },

  addFurniture: (type) => {
    set((state) => {
      // 가구 추가 로직
    });
  },

  updateWallDimensions: () => {
    set((state) => {
      // 벽 크기 조정 로직
    });
  },

  updateArea: (canvas) => {
    if (!canvas) return;
    const walls = canvas.getObjects().filter((obj) => obj.type === "wall");

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    walls.forEach((wall) => {
      const rect = wall.getBoundingRect();
      minX = Math.min(minX, rect.left);
      maxX = Math.max(maxX, rect.left + rect.width);
      minY = Math.min(minY, rect.top);
      maxY = Math.max(maxY, rect.top + rect.height);
    });

    const width = ((maxX - minX) / 50) * 0.5;
    const length = ((maxY - minY) / 50) * 0.5;
    const areaInSqMeters = width * length;

    set({ area: areaInSqMeters.toFixed(2) });
  },
}));

export default useFloorStore;
