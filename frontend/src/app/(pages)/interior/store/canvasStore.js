// src/app/(pages)/interior/store/canvasStore.js

import { create } from "zustand";

const useCanvasStore = create((set) => ({
  canvas: null,
  activeObject: null,
  mode: "select",
  objectList: [],

  setCanvas: (canvas) => set({ canvas }),
  setActiveObject: (activeObject) => set({ activeObject }),
  setMode: (mode) => set({ mode }),

  addObject: (obj) =>
    set((state) => ({
      objectList: [...state.objectList, obj],
    })),

  updateObjectList: (newList) =>
    set({
      objectList: newList,
    }),
}));

export default useCanvasStore;
