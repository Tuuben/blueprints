import { BoundingBox, Padding, Shape } from "../../types/shape";

  export const snapToGrid = (value: number, snapToGridOffset: number): number => {
      const gridOffset = value % snapToGridOffset;
      const rounded =
        Math.round(gridOffset / snapToGridOffset) * snapToGridOffset;
      return value - gridOffset + rounded;
};

export const calcBoundaries = (shape: Shape, padding?: Padding): BoundingBox => {
  if(!padding) {
      return shape.boundingBox;
  }

  const { x, y, width, height } = shape.boundingBox;
  
  if ('all' in padding) {
      return {
          x: x - padding.all,
          y: y - padding.all,
          width: width + padding.all * 2,
          height: height + padding.all * 2
      }
  }
  else if ('horizontal' in padding) {
      return {
          x: x - padding.horizontal,
          y: y - padding.vertical,
          width: width + padding.horizontal * 2,
          height: height + padding.vertical * 2
      }
  }
  else if ('top' in padding) {
      return {
          x: x - padding.left,
          y: y - padding.top,
          width: width + padding.left + padding.right,
          height: height + padding.top + padding.bottom
      }
  }

  return shape;
}