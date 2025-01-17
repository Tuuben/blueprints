import { useEffect, useRef } from "react"
import { useEditorStore } from "./useEditorStore";
import { useEditorCanvasSize } from "./useEditorCanvasSize";
import { useEditorMouseListeners } from "./useEditorMouseListeners";
import { useEditorKeyEventListener } from "./useEditorKeyEventListener";

export const useEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvasContext, setCanvasContext, setCanvas, canvasWidth, canvasHeight } = useEditorStore();

  useEditorCanvasSize();
  useEditorMouseListeners();
  useEditorKeyEventListener();

  useEffect(() => {
    if(!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if(!ctx) {
      return;
    }

    setCanvasContext(ctx);
    setCanvas(canvas);
  }, []);

  useEffect(() => {
    if(!canvasContext) {
      return;
    }
  }, [canvasContext])

  return {
    canvasRef,
    canvasWidth,
    canvasHeight,
  }
}
