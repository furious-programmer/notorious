import { ShapeType } from '../Shape';
import { registerShapeUtil, type ShapeUtil } from '../shapeUtils';
import type { PolyLine } from './Polyline';


const PolylineUtil: ShapeUtil<PolyLine> = {

  area: () => 0, 

  intersects: (polyline: PolyLine, x: number, y: number) : boolean => {
    const { points } = polyline.geometry;
    for (let i = 0, j = i+1; i < points.length; j = i++) {
      const x1 = points[i][0],
        y1 = points[i][1];
      const x2 = points[j][0],
        y2 = points[j][1];

      const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
        Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
     
    if(distance < 1)
      return true; 
    }
    return false;
  },
  
  calculatePerpendicularPoints  : (x:number, y:number, angle:number, offset:number) => {
    const dx = -Math.sin(angle);
    const dy = Math.cos(angle);

    const above = [x + offset * dx, y + offset * dy];
    const below = [x - offset * dx, y - offset * dy];

  return [...above, ...below];
  },

  calculateMidpoints : (points: [number, number][]) : Array<Array<number>> => {
    if (points.length < 2) return [];

    const midpoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      midpoints.push([(x1 + x2) / 2, (y1 + y2) / 2]);
    }
    return midpoints;
  }
  
};

registerShapeUtil(ShapeType.POLYLINE, PolylineUtil);