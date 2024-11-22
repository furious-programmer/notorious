import type { Bounds, Geometry, Shape } from '../Shape';

export interface PolyLine extends Shape {

  geometry: PolyLineGeometry;

}

export interface PolyLineGeometry extends Geometry {

  points: Array<Array<number>>;
  perpendicularPoints : Array<Array<number>>; // [[above, below], [x1, y1, x2, y2]]
  bounds: Bounds;
  
}