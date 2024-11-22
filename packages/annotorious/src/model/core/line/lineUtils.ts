import { ShapeType } from '../Shape';
import { registerShapeUtil, type ShapeUtil } from '../shapeUtils';
import type { Line } from "./Line";

const LineUtil: ShapeUtil<Line> = {
  area: () => 0, 
  intersects: (line, x, y) => {
    const { start, end } = line.geometry;
    const [x1, y1] = start;
    const [x2, y2] = end;

    const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
                     Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
    return distance < 1; 
  },
};

registerShapeUtil(ShapeType.LINE, LineUtil);
