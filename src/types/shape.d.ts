export type Padding = {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } | {
    vertical: number;
    horizontal: number;
  } | {
    all: number;
  }
  
  export type ShapeStyle = {
    fillColor?: string;
    borderRadius?: [number, number, number, number]; // top-left ...
    strokeColor?: string;
    strokeWidth?: number;
    padding?: Padding;
  }
  
  export type GizmoControlPoint = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "rotate";
  
  export type ShapeMetadata = {
    gizmo?: {
      controlPoint: GizmoControlPoint;
      controlShapeId: string;
    }
  }
  
  export type Selection = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
  
  export type LineDrawData = {
    x2: number;
    y2: number;
  }
  
  export type CircleDrawData = {
    r: number;
  }

  export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  type CommonShape = {
    shapeId: string;
    boundingBox: BoundingBox;
    style?: ShapeStyle;
    metaData?: ShapeMetadata;
    rotationRad?: number;
    interactionType: "selectable" | "static" | "locked"
    updatedAt: number;
  }
  
  export type Shape = {
    type: "box";
  } & CommonShape |
  {
    type: "line";
    drawData: LineDrawData;
  } & CommonShape |
  {
    type: "circle";
    drawData: CircleDrawData;
  } & CommonShape
  
  