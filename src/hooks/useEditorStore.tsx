import { create } from "zustand";
import { Vec2 } from "../types/math";
import { ToolType } from "../types/editor";
import { Shape } from "../types/shape";

type EditorStore = {
  // Base
  canvas: HTMLCanvasElement | null,
  setCanvas: (canvas: HTMLCanvasElement) => void,
  canvasContext: CanvasRenderingContext2D | null,
  setCanvasContext: (canvasContext: CanvasRenderingContext2D) => void;
  canvasWidth: number;
  setCanvasWidth: (canvasWidth: number) => void;
  canvasHeight: number;
  setCanvasHeight: (canvasWidth: number) => void;

  // Interaction
  isPanning: boolean;
  setIsPanning: (isPanning: boolean) => void;
  canvasOffset: Vec2;
  setCanvasOffset: (canvasOffset: Vec2) => void;
  canvasZoom: number;
  setCanvasZoom: (canvasZoom: number) => void;
  // Tools 
  selectedTool: ToolType;
  setSelectedTool: (selectedTool: ToolType) => void;

  // Selection
  selectedShape?: Shape;
  setSelectedShape: (selectedShape?: Shape) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  // Base
  canvas: null,
  setCanvas: (canvas) => set({canvas}),
  canvasContext: null,
  setCanvasContext: (canvasContext) => set({ canvasContext }),
  canvasWidth: 0,
  setCanvasWidth: (canvasWidth) => set({ canvasWidth }),
  canvasHeight: 0,
  setCanvasHeight: (canvasHeight) => set({ canvasHeight }),

  // Interaction
  isPanning: false,
  setIsPanning: (isPanning) => set({ isPanning }),
  canvasOffset: { x: 0, y: 0 },
  setCanvasOffset: (canvasOffset) => set({ canvasOffset }),
  canvasZoom: 1,
  setCanvasZoom: (canvasZoom: number) => set({ canvasZoom }),

  // Tools 
  selectedTool: "shapeBox",
  setSelectedTool: (selectedTool: ToolType) => set({ selectedTool }),

  // Selection
  selectedShapeId: undefined,
  setSelectedShape: (selectedShape) => set({ selectedShape }),
}))
