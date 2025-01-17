import { useEffect } from "react";
import { useEditorRenderer } from "./useEditorRenderer";
import { ShapeManager } from "../editor/shapeManager";
import { useEditorStore } from "./useEditorStore";
import { clearGizmos } from "../editor/gizmos";

export const useEditorKeyEventListener = () => {
  const { selectedShape, setSelectedShape } = useEditorStore(
    ({ selectedShape, setSelectedShape }) => ({
      selectedShape,
      setSelectedShape,
    })
  );
  const { draw } = useEditorRenderer();

  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "z") {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          ShapeManager.undo();
          draw();
        }
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        if (selectedShape) {
          event.preventDefault();
          ShapeManager.removeShape(selectedShape.shapeId);
          setSelectedShape(undefined);
          clearGizmos();
          draw();
        }
      }
    };

    document.addEventListener("keydown", handleKeyEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
    };
  }, [draw]);
};
