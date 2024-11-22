import { ShapeType } from '../Shape';
import { registerShapeUtil, type ShapeUtil } from '../shapeUtils';
import type { Circle } from './Circle';

const CircleUtil: ShapeUtil<Circle> = {

  area: (e: Circle): number => Math.PI * e.geometry.r * e.geometry.r,

  intersects: (e: Circle, x: number, y: number): boolean => {
    const { cx, cy, r } = e.geometry;

    const dx = x - cx;
    const dy = y - cy;
  
    return dx * dx + dy * dy <= r * r;
  }
  
};

registerShapeUtil(ShapeType.CIRCLE, CircleUtil);