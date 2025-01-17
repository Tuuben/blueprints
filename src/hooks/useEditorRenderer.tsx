import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "./useEditorStore";
import { DRAW_DEBUG_GRID, drawBox } from "../editor/draw";
import { Shape } from "../types/shape";
import { ShapeManager } from "../editor/shapeManager";

export const useEditorRenderer = () => {
  const { canvasContext: ctx, canvas, canvasOffset, canvasZoom } = useEditorStore();
  const offscreenCanvas = useRef(document.createElement("canvas"));
  const offscreenContext = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if(canvas) {
      offscreenCanvas.current.width = canvas.width;
      offscreenCanvas.current.height = canvas.height;
      offscreenContext.current = offscreenCanvas.current.getContext("2d")
    }
  }, [canvas]);

  const draw = useCallback((temporaryShapes: Shape[] = []) => {
    if (!ctx || !canvas || !offscreenContext.current) {
      return;
    }

    const offCtx = offscreenContext.current;
 
    offCtx.clearRect(0, 0, canvas.width, canvas.height);
    offCtx.save();
    offCtx.translate(canvasOffset.x, canvasOffset.y);
    offCtx.scale(canvasZoom, canvasZoom);

    // Draw grid
    //DRAW_DEBUG_GRID(offCtx);

    const shapes = ShapeManager.getShapes();
    const allShapes = [...shapes, ...temporaryShapes];
   
    // Draw shapes
    for(const shape of allShapes) {
      if(shape.type === "box") {
        drawBox(offCtx, shape, canvasZoom, canvasOffset)
      }

      if(shape.type === "circle") {
        console.error("Circle shape not implemented")
      }

      if(shape.type === "line") {
        console.error("Line shape not implemented")
      }
    }
      

    // Draw other content
    offCtx.restore();

    // Draw to real canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas.current, 0, 0);

    cleanupShapes();
  }, [canvasOffset, canvasZoom, ctx, canvas, offscreenContext]);

  const cleanupShapes = () => {
  }

  return {
    draw
  }
}
