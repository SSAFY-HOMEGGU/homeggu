export const initializeState = () => {
  const state = {
    WALLS: [],
    OBJDATA: [],
    ROOM: [],
    HISTORY: [],
    wallSize: 20,
    partitionSize: 8,
    drag: 'off',
    action: 0,
    magnetic: 0,
    construc: 0,
    Rcirclebinder: 8,
    mode: 'select_mode',
    modeOption: undefined,
    grid: 20,
    showRib: true,
    showArea: true,
    meter: 60,
    grid_snap: 'off',
    colorbackground: "#ffffff",
    colorline: "#fff", 
    colorroom: "#f0daaf",
    colorWall: "#666",
    pox: 0,
    poy: 0,
    segment: 0,
    xpath: 0,
    ypath: 0,
    zoom: 9,
    factor: 1,
    width_viewbox: 0,
    height_viewbox: 0,
    ratio_viewbox: 0,
    originX_viewbox: 0,
    originY_viewbox: 0
  };

  // DOM 관련 초기화는 컴포넌트에 마운트된 후 실행
  if (typeof window !== 'undefined') {
    const linElement = document.getElementById('lin');
    if (linElement) {
      state.width_viewbox = linElement.clientWidth;
      state.height_viewbox = linElement.clientHeight;
      state.ratio_viewbox = state.height_viewbox / state.width_viewbox;
    }
  }

  return state;
};