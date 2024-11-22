import { ShapeType } from '../Shape';
import { registerShapeUtil, type ShapeUtil } from '../shapeUtils';
import type { Freehand } from './Freehand';

const FreehandUtil: ShapeUtil<Freehand> = {
  area: () => 0, 
  intersects: (freehand, x, y) => {
    const { points } = freehand.geometry; 
  
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];       
      const [x2, y2] = points[i + 1];   
  
      const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
                       Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
      if (distance < 1) return true;
    }
    return false;
  }
  ,
  getPathFromPoints : (points: Array<[number, number]>) => {
    if (points.length === 0) return '';
    return `M ${points[0][0]} ${points[0][1]} ` + points.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ');
  }
};

registerShapeUtil(ShapeType.FREEHAND, FreehandUtil);
