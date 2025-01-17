import { Vec2 } from "../types/math";
import { Shape, ShapeStyle } from "../types/shape";
import { ShapeManager } from "./shapeManager";

const GIZMO_TOP_LEFT = "gizmo-top-left";
const GIZMO_TOP_RIGHT = "gizmo-top-right";
const GIZMO_BOTTOM_LEFT = "gizmo-bottom-left";
const GIZMO_BOTTOM_RIGHT = "gizmo-bottom-right";
const GIZMO_ROTATE = "gizmo-rotate";
const GIZMO_BOUNDING_BOX = "gizmo-bounding-box";

const GIZMO_STYLE: ShapeStyle = {
  fillColor: "rgba(0, 200, 255, 0.1)",
  strokeColor: "rgba(0, 200, 255, 1)",
  strokeWidth: 2,
  borderRadius: [2, 2, 2, 2],
};

const GIZMO_KNOB_SIZE = 16;

export const setGizmo = (selectedShape: Shape, canvasZoom: number) => {
  // Get the updated shape from the shapemap
  const shape = ShapeManager.getShape(selectedShape.shapeId);

  if(!shape) {
    console.error("[Gizmos]: Shape not found in shapeMap");
    return;
  }

  const createShape = ShapeManager.addShape;

  const gizmoTopLeft: Shape = {
    ...createShape(
      "shapeBox",
      shape.boundingBox.x - GIZMO_KNOB_SIZE,
      shape.boundingBox.y - GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      1,
      {x: 0, y: 0},
      true
    ),
    shapeId: GIZMO_TOP_LEFT,
    metaData: {
      gizmo: {
        controlPoint: "topLeft",
        controlShapeId: shape.shapeId,
      },
    },
    style: GIZMO_STYLE,
  };
  const gizmoTopRight: Shape = {
    ...createShape(
      "shapeBox",
      shape.boundingBox.x + shape.boundingBox.width,
      shape.boundingBox.y - GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      1,
      {x: 0, y: 0},
      true
    ),
    shapeId: GIZMO_TOP_RIGHT,
    metaData: {
      gizmo: {
        controlPoint: "topRight",
        controlShapeId: shape.shapeId,
      },
    },
    style: GIZMO_STYLE,
  };
  const gizmoBottomLeft: Shape = {
    ...createShape(
      "shapeBox",
      shape.boundingBox.x - GIZMO_KNOB_SIZE,
      shape.boundingBox.y + shape.boundingBox.height,
      GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      1,
      {x: 0, y: 0},
      true
    ),
    shapeId: GIZMO_BOTTOM_LEFT,
    metaData: {
      gizmo: {
        controlPoint: "bottomLeft",
        controlShapeId: shape.shapeId,
      },
    },
    style: GIZMO_STYLE,
  };
  const gizmoBottomRight: Shape = {
    ...createShape(
      "shapeBox",
      shape.boundingBox.x + shape.boundingBox.width,
      shape.boundingBox.y + shape.boundingBox.height,
      GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      1,
      {x: 0, y: 0},
      true
    ),
    shapeId: GIZMO_BOTTOM_RIGHT,
    metaData: {
      gizmo: {
        controlPoint: "bottomRight",
        controlShapeId: shape.shapeId,
      },
    },
    style: GIZMO_STYLE,
  };
  const gizmoRotate: Shape = {
    ...createShape(
      "shapeBox",
      shape.boundingBox.x + shape.boundingBox.width / 2 - GIZMO_KNOB_SIZE / 2,
      shape.boundingBox.y - 20 - GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      GIZMO_KNOB_SIZE,
      1,
      {x: 0, y: 0},
      true
    ),
    shapeId: GIZMO_ROTATE,
    metaData: {
      gizmo: {
        controlPoint: "rotate",
        controlShapeId: shape.shapeId,
      },
    },
    style: GIZMO_STYLE,
  };
  const gizmoBoundingBox: Shape = {
    ...createShape(
      "shapeBox",
      shape.boundingBox.x,
      shape.boundingBox.y,
      shape.boundingBox.width,
      shape.boundingBox.height,
      1,
      {x: 0, y: 0},
      true
    ),
    shapeId: GIZMO_BOUNDING_BOX,
    style: {
      ...GIZMO_STYLE,
      padding: {
        all: 2,
      }
    },
    interactionType: "static",
  };

  ShapeManager.setShape(GIZMO_TOP_LEFT, gizmoTopLeft);
  ShapeManager.setShape(GIZMO_TOP_RIGHT, gizmoTopRight);
  ShapeManager.setShape(GIZMO_BOTTOM_LEFT, gizmoBottomLeft);
  ShapeManager.setShape(GIZMO_BOTTOM_RIGHT, gizmoBottomRight);
  ShapeManager.setShape(GIZMO_ROTATE, gizmoRotate);
  ShapeManager.setShape(GIZMO_BOUNDING_BOX, gizmoBoundingBox);
};

export const clearGizmos = () => {
  ShapeManager.removeShape(GIZMO_TOP_LEFT);
  ShapeManager.removeShape(GIZMO_TOP_RIGHT);
  ShapeManager.removeShape(GIZMO_BOTTOM_LEFT);
  ShapeManager.removeShape(GIZMO_BOTTOM_RIGHT);
  ShapeManager.removeShape(GIZMO_ROTATE);
  ShapeManager.removeShape(GIZMO_BOUNDING_BOX);
};

export const gizmoUpdateControlShape = (
  selectedShape: Shape,
  canvasZoom: number
) => {
  // Get the latest gizmo shape with updated data
  const gizmoShape = ShapeManager.getShape(selectedShape.shapeId);

  if (!gizmoShape || !gizmoShape.metaData?.gizmo) {
    console.error("Not a valid gizmo shape");
    return;
  }

  const controlShapeId = gizmoShape.metaData?.gizmo?.controlShapeId;
  const controlShape = ShapeManager.getShape(controlShapeId);

  if (!controlShape) {
    console.error("Control shape not found");
    return;
  }

  const gizmoPos: Vec2 = {
    x: gizmoShape.boundingBox.x + GIZMO_KNOB_SIZE / 2,
    y: gizmoShape.boundingBox.y + GIZMO_KNOB_SIZE / 2,
  };

  const gizmoPosDiff: Vec2 = {
    x: controlShape.boundingBox.x - gizmoPos.x,
    y: controlShape.boundingBox.y - gizmoPos.y,
  };

  if (gizmoShape.metaData.gizmo.controlPoint === "topLeft") {
    const newShape: Shape = {
      ...controlShape,
      boundingBox: {
        ...controlShape.boundingBox,
        ...gizmoPos,
        width: controlShape.boundingBox.width + gizmoPosDiff.x,
        height: controlShape.boundingBox.height + gizmoPosDiff.y,
      },
    };

    ShapeManager.setShape(controlShapeId, newShape);
  }

  if (gizmoShape.metaData.gizmo.controlPoint === "topRight") {
    const newShape: Shape = {
      ...controlShape,
      boundingBox: {
        ...controlShape.boundingBox,
        y: gizmoPos.y,
        width:
          controlShape.boundingBox.width -
          (controlShape.boundingBox.width + gizmoPosDiff.x),
        height: controlShape.boundingBox.height + gizmoPosDiff.y,
      },
    };

    ShapeManager.setShape(controlShapeId, newShape);
  }

  if (gizmoShape.metaData.gizmo.controlPoint === "bottomLeft") {
    const newShape: Shape = {
      ...controlShape,
      boundingBox: {
        ...controlShape.boundingBox,
        x: gizmoPos.x,
        width: controlShape.boundingBox.width + gizmoPosDiff.x,
        height:
          controlShape.boundingBox.height -
          (controlShape.boundingBox.height + gizmoPosDiff.y),
      },
    };

    ShapeManager.setShape(controlShapeId, newShape);
  }

  if (gizmoShape.metaData.gizmo.controlPoint === "bottomRight") {
    const newShape: Shape = {
      ...controlShape,
      boundingBox: {
        ...controlShape.boundingBox,
        width:
          controlShape.boundingBox.width -
          (controlShape.boundingBox.width + gizmoPosDiff.x),
        height:
          controlShape.boundingBox.height -
          (controlShape.boundingBox.height + gizmoPosDiff.y),
      },
    };

    ShapeManager.setShape(controlShapeId, newShape);
  }

  if (gizmoShape.metaData.gizmo.controlPoint === "rotate") {
    const angle = Math.atan2(gizmoPosDiff.y, gizmoPosDiff.x);
    console.log("angle", angle);

    const newShape: Shape = {
      ...controlShape,
      rotationRad: angle,
    };

    ShapeManager.setShape(controlShapeId, newShape);
  }

  setGizmo(controlShape, canvasZoom);
};
