import { useEffect } from "react";
import useCanvasStore from "../store/canvasStore";

export const useHistory = () => {
  const { canvas, history, historyIndex, addToHistory } = useCanvasStore();

  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      if (e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          if (historyIndex < history.length - 1) {
            canvas.loadFromJSON(history[historyIndex + 1], () => {
              canvas.renderAll();
              useCanvasStore.setState({ historyIndex: historyIndex + 1 });
            });
          }
        } else {
          // Undo
          if (historyIndex > 0) {
            canvas.loadFromJSON(history[historyIndex - 1], () => {
              canvas.renderAll();
              useCanvasStore.setState({ historyIndex: historyIndex - 1 });
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Save initial state
    if (history.length === 0) {
      addToHistory(JSON.stringify(canvas));
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas, history, historyIndex]);
};

export default useHistory;
