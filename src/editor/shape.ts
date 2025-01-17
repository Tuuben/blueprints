import { ToolType } from "../types/editor";
import { Vec2 } from "../types/math";
import { Shape } from "../types/shape";

export const shapeMap = new Map<string, Shape>();

export const getShapeArray = (): Shape[] => {
  return Array.from(shapeMap.values());
};

export const createShape = (
  toolType: ToolType,
  x: number,
  y: number,
  width: number,
  height: number,
  canvasZoom: number
): Shape => {
  return {
    shapeId: Date.now().toString(),
    updatedAt: Date.now(),
    interactionType: "selectable",
    type: "box",
    boundingBox: {
      x: x,
      y: y,
      width: width,
      height: height,
    },
  };
};

export const getShapeFromSelection = (
  mousePosition: Vec2,
  canvasZoom: number
): Shape | null => {
  let smallestShape: Shape | null = null;
  const shapes = getShapeArray();

  for (const shape of shapes) {
    if(shape.interactionType !== "selectable") {
      continue;
    }

    if (shape.type === "box") {
      const castShape = shape.boundingBox;
      const mouseX = mousePosition.x / canvasZoom;
      const mouseY = mousePosition.y / canvasZoom;
      const isInside =
        mouseX >= castShape.x &&
        mouseX <= castShape.x + castShape.width &&
        mouseY >= castShape.y &&
        mouseY <= castShape.y + castShape.height;

      if (isInside) {
        if (
          !smallestShape ||
          smallestShape.type !== "box" ||
          smallestShape.boundingBox.width * smallestShape.boundingBox.height >
            shape.boundingBox.width * shape.boundingBox.height
        ) {
          smallestShape = shape;
        }
      }
    }
    /*
      case "circle":
        Math.sqrt(
                  Math.pow(mousePosition.x - shape.x, 2) +
                    Math.pow(mousePosition.y - shape.y, 2)
                ) <= shape.r
              ); 
    */
  }

  return smallestShape;
};

export const updateShapeLocation = (
  shapeId: string,
  startPos: Vec2,
  offset: Vec2,
  canvasZoom: number
) => {
  const selectedShape = shapeMap.get(shapeId);

  if (selectedShape) {
    const newShape: Shape = {
      ...selectedShape,
      updatedAt: Date.now(),
      boundingBox: {
        ...selectedShape.boundingBox,
        x: startPos.x + offset.x / canvasZoom,
        y: startPos.y + offset.y / canvasZoom,
      },
    };

    shapeMap.set(shapeId, newShape);
  }
};
