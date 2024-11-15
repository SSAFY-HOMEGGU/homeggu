import { useEffect } from "react";
import useCanvasStore from "../store/canvasStore";

const useKeyboardShortcuts = () => {
  const { canvas, history, historyIndex, addToHistory, undo, redo } =
    useCanvasStore();

  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Delete: Delete or Backspace key
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.renderAll();
          addToHistory(JSON.stringify(canvas));
        }
      }

      // Copy: Ctrl/Cmd + C
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          activeObject.clone((cloned) => {
            canvas.clipboard = cloned;
          });
        }
      }

      // Paste: Ctrl/Cmd + V
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        if (canvas.clipboard) {
          canvas.clipboard.clone((clonedObj) => {
            // Offset the pasted object slightly to make it visible
            clonedObj.set({
              left: clonedObj.left + 10,
              top: clonedObj.top + 10,
              evented: true,
            });
            canvas.add(clonedObj);
            canvas.setActiveObject(clonedObj);
            canvas.renderAll();
            addToHistory(JSON.stringify(canvas));
          });
        }
      }

      // Cut: Ctrl/Cmd + X
      if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          activeObject.clone((cloned) => {
            canvas.clipboard = cloned;
            canvas.remove(activeObject);
            canvas.renderAll();
            addToHistory(JSON.stringify(canvas));
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas, history, historyIndex]);
};

export default useKeyboardShortcuts;
