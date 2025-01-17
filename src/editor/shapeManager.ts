import { ToolType } from "../types/editor";
import { Vec2 } from "../types/math";
import { Shape } from "../types/shape";

const MAX_HISTORY_LENGTH = 15;

class _ShapeManager {
  private shapeMap = new Map<string, Shape>([]);
  private shapeHistory: Shape[][] = [];
  private historyStateNeedsUpdating = false;

  public getShapes(): Shape[] {
    return Array.from(this.shapeMap.values());
  }
  
  public getShape(shapeId: string): Shape | undefined {
    return this.shapeMap.get(shapeId);
  }
  
  public setShape(shapeId: string, shape: Shape) {
    this.shapeMap.set(shapeId, shape);
    this.historyStateNeedsUpdating = true;
  }

  public addShape(
    toolType: ToolType,
    x: number,
    y: number,
    width: number,
    height: number,
    canvasZoom: number,
    canvasOffset: Vec2,
    isTemporary?: boolean
  ): Shape {


    const newShape: Shape = {
      shapeId: Date.now().toString(),
      type: "box",
      updatedAt: Date.now(),
      interactionType: "selectable",
      boundingBox: {
        x: x / canvasZoom,
        y: y / canvasZoom,
        width: width / canvasZoom,
        height: height / canvasZoom,
      },
    };

    if(!isTemporary) {
        this.shapeMap.set(newShape.shapeId, newShape);
        this.historyStateNeedsUpdating = true;
    }

    return newShape;
  }

  public updateShapePosition(
    shapeId: string,
    startPos: Vec2,
    offset: Vec2,
  ) {
    const selectedShape = this.shapeMap.get(shapeId);

    if (selectedShape) {
      const newShape: Shape = {
        ...selectedShape,
        updatedAt: Date.now(),
        boundingBox: {
          ...selectedShape.boundingBox,
          x: startPos.x + offset.x,
          y: startPos.y + offset.y,
        },
      };

      this.shapeMap.set(shapeId, newShape);
      this.historyStateNeedsUpdating = true;
    }
  }

  public removeShape(shapeId: string) {
    this.historyStateNeedsUpdating = true;
    this.shapeMap.delete(shapeId);
  }

  public getShapeFromSelection(
    mousePosition: Vec2,
    canvasZoom: number
  ): Shape | null {
    let smallestShape: Shape | null = null;
    const shapes = this.getShapes();

    for (const shape of shapes) {
      if (shape.interactionType !== "selectable") {
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
  }
  
  public undo() {
    if(!this.shapeHistory.length) {
        if(this.getShapes().length === 1) {
          this.shapeMap.clear();
        }

        return;
    }

    const lastState = this.shapeHistory.pop();

    if(!lastState?.length) return;

    this.shapeMap.clear();

    for (const prevShape of lastState) {
        this.shapeMap.set(prevShape.shapeId, prevShape);
    }
  }

  public saveHistoryState() {
    if(!this.historyStateNeedsUpdating) {
        return;
    }

    const currentShapes = this.getShapes();

    if(!currentShapes.length) {
        return;
    }

    const currentState = [...this.getShapes()];

    if(this.shapeHistory.length >= MAX_HISTORY_LENGTH) {
        this.shapeHistory.shift();
    }

    this.shapeHistory.push(currentState);
  }

}

export const ShapeManager = new _ShapeManager();
