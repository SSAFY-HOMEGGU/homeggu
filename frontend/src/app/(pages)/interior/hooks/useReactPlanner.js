import React from "react";
import { createStore } from "redux";
import { Map, List, fromJS } from "immutable";

let plannerModule = null; // 모듈을 전역적으로 한 번만 로드하기 위한 변수

// Initial state creator with proper Immutable structure
const createInitialState = () => {
  const state = Map({
    mode: "MODE_2D_PAN",
    viewer2D: Map({
      position: Map({ x: 0, y: 0 }),
      zoom: 1,
      e: 0,
      f: 0,
      SVGWidth: 3000,
      SVGHeight: 2000,
    }),
    mouse: Map({
      x: 0,
      y: 0,
    }),
    alterate: false,
    zoom: 1,
    catalog: Map({
      ready: false,
    }),
    scene: Map({
      width: 3000,
      height: 2000,
      selectedLayer: "layer-1",
      layers: Map({
        "layer-1": Map({
          id: "layer-1",
          altitude: 0,
          order: 0,
          name: "default",
          visible: true,
          vertices: Map({}),
          lines: Map({}),
          holes: Map({}),
          areas: Map({}),
          items: Map({}),
          selected: Map({
            vertices: List([]),
            lines: List([]),
            holes: List([]),
            areas: List([]),
            items: List([]),
          }),
        }),
      }),
      groups: Map({}),
      guides: Map({
        horizontal: Map(),
        vertical: Map(),
      }),
      grids: Map({
        h1: Map({
          id: "h1",
          type: "horizontal-streak",
          properties: Map({
            step: 20,
            colors: List(["#808080", "#ddd", "#ddd", "#ddd", "#ddd"]),
          }),
        }),
        v1: Map({
          id: "v1",
          type: "vertical-streak",
          properties: Map({
            step: 20,
            colors: List(["#808080", "#ddd", "#ddd", "#ddd", "#ddd"]),
          }),
        }),
      }),
    }),
    errors: List([]),
    warnings: List([]),
    snapMask: Map({
      SNAP_POINT: false,
      SNAP_LINE: false,
      SNAP_SEGMENT: false,
      SNAP_GRID: false,
      SNAP_GUIDE: false,
    }),
    snapElements: Map({}),
    toolbarOptions: Map({}),
    drawingSupport: Map({}),
    miscProperties: Map({}),
    sceneHistory: Map(),
  });

  return state;
};

// useReactPlanner.js
export function useReactPlanner() {
  const [components, setComponents] = React.useState(null);
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const initializeRef = React.useRef(false);
  const moduleRef = React.useRef(null);
  const storeRef = React.useRef(null);
  const catalogRef = React.useRef(null);

  // State extractor를 useCallback으로 메모이제이션
  const stateExtractor = React.useCallback((state) => {
    if (!state) return null;
    const immutableState = Map.isMap(state) ? state : fromJS(state);
    return immutableState; // 원본 immutable 상태를 그대로 반환
  }, []);

  React.useEffect(() => {
    if (initializeRef.current || !window) return;

    const initializePlanner = async () => {
      try {
        if (!moduleRef.current) {
          moduleRef.current = await import("../../../../../react-planner/es");
        }

        const mod = moduleRef.current;

        if (!catalogRef.current) {
          catalogRef.current = new mod.Catalog({ elements: {} });
        }

        if (!storeRef.current) {
          const initialState = createInitialState();
          storeRef.current = createStore(mod.reducer, initialState);
        }

        const translator = new mod.Translator();

        setComponents({
          catalog: catalogRef.current,
          translator,
          store: storeRef.current,
          customContents: mod.ReactPlannerComponents,
        });

        initializeRef.current = true;
      } catch (error) {
        console.error("Failed to initialize planner:", error);
      }
    };

    initializePlanner();
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    components,
    windowSize,
    stateExtractor,
    isReady: !!components,
  };
}
