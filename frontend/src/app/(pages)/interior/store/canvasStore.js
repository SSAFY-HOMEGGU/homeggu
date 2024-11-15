//interior/store/canvasStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCanvasStore = create(
  persist(
    (set, get) => ({
      // Canvas 관련 상태
      canvas: null,
      mode: "select",
      activeObject: null,
      objectList: [],
      selectedObject: null,

      // 히스토리 관련 상태
      history: {
        undoStack: [],
        redoStack: [],
      },
      canUndo: false,
      canRedo: false,

      // 그리드 관련 상태
      gridVisible: true,
      snapToGrid: true,
      currentView: "2d",

      // Canvas 설정 메서드
      setCanvas: (floorPlanner) => {
        if (!floorPlanner) return;

        set({ canvas: floorPlanner });

        // 히스토리 추가 메서드 등록
        floorPlanner.setOnHistoryAdd((json) => {
          set((state) => ({
            history: {
              undoStack: [...state.history.undoStack, json],
              redoStack: [],
            },
            canUndo: true,
            canRedo: false,
          }));
        });

        // 히스토리 이벤트 설정
        floorPlanner.canvas.on("object:modified", () => {
          floorPlanner.addToHistory();
          set((state) => ({
            canUndo: state.history.undoStack.length > 0,
            canRedo: state.history.redoStack.length > 0,
          }));
        });

        floorPlanner.canvas.on("object:added", () => {
          if (!floorPlanner.isLoadingFromJSON) {
            floorPlanner.addToHistory();
            set((state) => ({
              canUndo: state.history.undoStack.length > 0,
              canRedo: false,
            }));
          }
        });

        floorPlanner.canvas.on("object:removed", () => {
          if (!floorPlanner.isLoadingFromJSON) {
            floorPlanner.addToHistory();
            set((state) => ({
              canUndo: state.history.undoStack.length > 0,
              canRedo: false,
            }));
          }
        });

        // 객체 선택 이벤트
        floorPlanner.canvas.on("selection:created", (e) => {
          const obj = e.selected[0];
          if (obj) {
            set({
              selectedObject: {
                name: obj.name || obj.type || "Unknown",
                x1: obj.left,
                y1: obj.top,
                x2: obj.left + (obj.width || 0),
                y2: obj.top + (obj.height || 0),
                width: obj.width,
                height: obj.height,
                angle: obj.angle,
                thickness: obj.strokeWidth,
                textureA: obj.textureA || "Default",
                textureB: obj.textureB || "Default",
              },
            });
          }
        });

        floorPlanner.canvas.on("selection:cleared", () => {
          set({ selectedObject: null });
        });
      },

      setActiveObject: (activeObject) => set({ activeObject }),
      setMode: (mode) => {
        set({ mode });
        const { canvas } = get();
        if (canvas) {
          canvas.setMode(mode);
        }
      },
      setSelectedObject: (object) => set({ selectedObject: object }),
      clearSelectedObject: () => set({ selectedObject: null }),
      setCurrentView: (view) => {
        const { canvas } = get();
        set({ currentView: view });

        // 뷰 전환시 자동 저장
        if (canvas && view === "3d") {
          canvas.saveState();
        }
      },
      // 객체 리스트 관련 메서드
      addObject: (obj) =>
        set((state) => ({
          objectList: [...state.objectList, obj],
        })),
      updateObjectList: (newList) => set({ objectList: newList }),

      // 히스토리 관련 메서드
      addToHistory: () => {
        const { canvas } = get();
        if (!canvas) return;

        const json = canvas.toJSON();
        set((state) => ({
          history: {
            undoStack: [...state.history.undoStack, json],
            redoStack: [],
          },
          canUndo: true,
          canRedo: false,
        }));
      },

      undo: () => {
        const { canvas } = get();
        if (canvas) {
          canvas.undo();
          set((state) => ({
            canUndo: state.history.undoStack.length > 1,
            canRedo: true,
          }));
        }
      },

      redo: () => {
        const { canvas } = get();
        if (canvas) {
          canvas.redo();
          set((state) => ({
            canUndo: true,
            canRedo: state.history.redoStack.length > 1,
          }));
        }
      },

      // 그리드 관련 메서드
      toggleGrid: () => {
        const { canvas } = get();
        if (canvas) {
          canvas.toggleGrid();
          set((state) => ({ gridVisible: !state.gridVisible }));
        }
      },

      toggleSnapToGrid: () => {
        const { canvas } = get();
        if (canvas) {
          canvas.toggleSnapToGrid();
          set((state) => ({ snapToGrid: !state.snapToGrid }));
        }
      },

      // 상태 저장/불러오기 메서드
      saveCanvasState: () => {
        const { canvas } = get();
        if (canvas) {
          const state = canvas.canvas.toJSON([
            "type",
            "name",
            "customProperties",
          ]);
          localStorage.setItem("canvasState", JSON.stringify(state));
        }
      },

      loadCanvasState: () => {
        const { canvas } = get();
        if (canvas) {
          const state = localStorage.getItem("canvasState");
          if (state) {
            canvas.canvas.loadFromJSON(JSON.parse(state), () => {
              canvas.canvas.renderAll();
              canvas.updateVerticesState();
              canvas.checkAndCreateRoom();
            });
          }
        }
      },

      // 가구 추가 메서드 정의
      addFurniture: (furniture) => {
        const { canvas } = get();
        if (canvas) {
          canvas.createFurniture(furniture); // createFurniture는 FloorPlanner의 메서드
        }
      },

      // 커스텀 속성 관련 메서드
      setCustomProperty: (objectId, key, value) => {
        const { canvas } = get();
        if (canvas) {
          canvas.setCustomProperty(objectId, key, value);
        }
      },

      getCustomProperty: (objectId, key) => {
        const { canvas } = get();
        if (canvas) {
          return canvas.getCustomProperty(objectId, key);
        }
        return null;
      },

      // 캔버스 JSON 변환 메서드
      toJSON: () => {
        const { canvas } = get();
        if (canvas) {
          return canvas.canvas.toJSON(["type", "name", "customProperties"]);
        }
        return null;
      },

      loadFromJSON: (json) => {
        const { canvas } = get();
        if (canvas && json) {
          canvas.canvas.loadFromJSON(json, () => {
            canvas.canvas.renderAll();
            canvas.updateVerticesState();
            canvas.checkAndCreateRoom();
          });
        }
      },
    }),
    {
      name: "canvas-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCanvasStore;
