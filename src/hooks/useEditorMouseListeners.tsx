import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "./useEditorStore";
import { Vec2 } from "../types/math";
import { useEditorRenderer } from "./useEditorRenderer";
import { Shape } from "../types/shape";
import { clearGizmos, gizmoUpdateControlShape, setGizmo } from "../editor/gizmos";
import { ShapeManager } from "../editor/shapeManager";

type MouseButtonClickEvent = "mouseLeft" | "mouseRight" | "notPressed";

export const useEditorMouseListeners = () => {
  const {
    canvas,
    isPanning,
    setIsPanning,
    setCanvasOffset,
    canvasOffset,
    canvasZoom,
    setCanvasZoom,
    selectedTool,
    setSelectedTool,
    selectedShape,
    setSelectedShape,
  } = useEditorStore();
  const { draw } = useEditorRenderer();
  const mouseStartPos = useRef<Vec2>({ x: 0, y: 0 });
  const currentShape = useRef<Shape>();

  const getCurrentMouseOffset = useCallback(
    (e: MouseEvent): Vec2 => {
      return {
        x: e.clientX - canvasOffset.x - mouseStartPos.current.x,
        y: e.clientY - canvasOffset.y - mouseStartPos.current.y,
      };
    },
    [canvasOffset.x, canvasOffset.y]
  );

  const mouseButtonClicked = useCallback(
    (e: MouseEvent): MouseButtonClickEvent => {
      if (e.which === 1) {
        return "mouseLeft";
      }
      if (e.which === 3) {
        return "mouseRight";
      }

      return "notPressed";
    },
    []
  );

  /**
   * ON MOUSE DOWN
   */
  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      setIsPanning(true);
      mouseStartPos.current = {
        x: e.clientX - canvasOffset.x,
        y: e.clientY - canvasOffset.y,
      };

      if (selectedTool === "select") {
        const newSelectedShape = ShapeManager.getShapeFromSelection(
          mouseStartPos.current,
          canvasZoom
        );

        // No shape selected
        if (!newSelectedShape) {
          setSelectedShape(undefined);
          clearGizmos();
          return;
        }

        setSelectedShape(newSelectedShape);

        if (!newSelectedShape.metaData?.gizmo) {
          setGizmo(newSelectedShape, canvasZoom);
        }

        draw();
        return;
      }
    },
    [canvasOffset, selectedTool, canvasZoom, setSelectedShape, setIsPanning, draw]
  );

  /**
   * ON MOUSE MOVE
   */
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning) {
        return;
      }

      const mouseButtonState = mouseButtonClicked(e);
      const mouseOffset = getCurrentMouseOffset(e);

      // Set preview shape, on left click
      if (mouseButtonState === "mouseLeft" && selectedTool !== "select") {
        // Draw outline shape
        const newShape = ShapeManager.addShape(
          selectedTool,
          mouseStartPos.current.x,
          mouseStartPos.current.y,
          mouseOffset.x,
          mouseOffset.y,
          canvasZoom,
          canvasOffset,
          true
        );

        draw([newShape]);
        return;
      }

      if (mouseButtonState === "mouseLeft") {
        if (!selectedShape) return;

        ShapeManager.updateShapePosition(
          selectedShape.shapeId,
          selectedShape.boundingBox,
          mouseOffset,
        );

        if (!!selectedShape.metaData?.gizmo) {
          gizmoUpdateControlShape(selectedShape, canvasZoom);
        } else {
          // Incase it's a graphical shape, we update the gizmo locations
          setGizmo(selectedShape, canvasZoom)
        }

        draw();
        return;
      }

      // Move canvas, on right click
      if (mouseButtonState === "mouseRight") {
        const updatedPosX = e.clientX - mouseStartPos.current.x;
        const updatedPosY = e.clientY - mouseStartPos.current.y;

        setCanvasOffset({ x: updatedPosX, y: updatedPosY });
        draw();
        return;
      }
    },
    [
      selectedTool,
      selectedShape,
      draw,
      isPanning,
      canvasOffset,
      canvasZoom,
      getCurrentMouseOffset,
      mouseButtonClicked,
      setCanvasOffset
    ]
  );

  /**
   * ON MOUSE UP
   */
  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      setIsPanning(false);

      const mouseButtonState = mouseButtonClicked(e);

      if (selectedTool === "select") {
        ShapeManager.saveHistoryState();
        return;
      }
      if (mouseButtonState === "mouseLeft") {
        const mouseOffset = getCurrentMouseOffset(e);
        currentShape.current = ShapeManager.addShape(
          selectedTool,
          mouseStartPos.current.x,
          mouseStartPos.current.y,
          mouseOffset.x,
          mouseOffset.y,
          canvasZoom,
          canvasOffset,
        );

        setSelectedTool("select");
        draw();
        ShapeManager.saveHistoryState();
      }
    },
    [
      selectedTool,
      canvasOffset,
      canvasZoom,
      getCurrentMouseOffset,
      setSelectedTool,
      setIsPanning,
      draw
    ]
  );

  /**
   * ON MOUSE OUT
   */
  const onMouseOut = useCallback(() => {
    setIsPanning(false);
  }, []);

  /**
   * ON MOUSE WHEEL
   */
  const onMouseWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const deltaY = e.deltaY;

      const zoomFactor = 1.03;
      const mouseX = e.clientX - canvasOffset.x;
      const mouseY = e.clientY - canvasOffset.y;
      const canvasOffsetUpdated = canvasOffset;
      let currentZoom = canvasZoom;

      if (deltaY < 0) {
        currentZoom *= zoomFactor;
        canvasOffsetUpdated.x -= mouseX * (zoomFactor - 1);
        canvasOffsetUpdated.y -= mouseY * (zoomFactor - 1);
      } else {
        currentZoom /= zoomFactor;
        canvasOffsetUpdated.x += mouseX * (1 - 1 / zoomFactor);
        canvasOffsetUpdated.y += mouseY * (1 - 1 / zoomFactor);
      }

      setCanvasOffset(canvasOffsetUpdated);
      setCanvasZoom(currentZoom);
      draw();
    },
    [canvasOffset, canvasZoom, draw, setCanvasOffset, setCanvasZoom]
  );

  useEffect(() => {
    draw();

    canvas?.addEventListener("mousedown", onMouseDown);
    canvas?.addEventListener("mouseup", onMouseUp);
    canvas?.addEventListener("mousemove", onMouseMove);
    canvas?.addEventListener("mouseout", onMouseOut);
    canvas?.addEventListener("wheel", onMouseWheel);

    return () => {
      canvas?.removeEventListener("mousedown", onMouseDown);
      canvas?.removeEventListener("mouseup", onMouseUp);
      canvas?.removeEventListener("mousemove", onMouseMove);
      canvas?.removeEventListener("mouseout", onMouseOut);
      canvas?.removeEventListener("wheel", onMouseWheel);
    };
  }, [
    canvas,
    canvasOffset,
    draw,
    onMouseOut,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onMouseWheel,
  ]);
};
