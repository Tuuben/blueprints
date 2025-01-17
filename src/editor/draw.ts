import { Vec2 } from "../types/math";
import { Shape } from "../types/shape";
import { calcBoundaries } from "./math";

// Default consts
const NO_BORDER_RADIUS = [0, 0, 0, 0];
const DEFAULT_FILL = "rgba(0,0,0,0)";
const DEFAULT_STROKE = "black";
const DEFAULT_STROKE_WIDTH = 2;

// Debug consts
const DEBUG_DRAW_GRID_SIZE = 5000;

export const drawBox = (ctx: CanvasRenderingContext2D, shape: Shape, canvasZoom: number, canvasOffset: Vec2) => {
  const options = shape.style || {};
  const borderRadius = options?.borderRadius || NO_BORDER_RADIUS;
  const fillColor = options?.fillColor || DEFAULT_FILL;
  const strokeColor = options?.strokeColor || DEFAULT_STROKE;
  const strokeWidth = options?.strokeWidth || DEFAULT_STROKE_WIDTH;
  const boundaries = calcBoundaries(shape, options?.padding);

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = fillColor;
  ctx.rotate(shape.rotationRad || 0)
  ctx.beginPath();
  ctx.roundRect(
    boundaries.x, 
    boundaries.y, 
    boundaries.width, 
    boundaries.height, 
    borderRadius
  );
  ctx.stroke();
  ctx.fill();
  //ctx.restore();
}

export const DRAW_DEBUG_GRID = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = 'rgba(50,50,50,0.1)';
  for (let x = 0; x < DEBUG_DRAW_GRID_SIZE; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, DEBUG_DRAW_GRID_SIZE);
    ctx.stroke();
  }

  for (let y = 0; y < DEBUG_DRAW_GRID_SIZE; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(DEBUG_DRAW_GRID_SIZE, y);
    ctx.stroke();
  }
}
