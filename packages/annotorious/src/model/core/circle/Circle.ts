import type { Bounds, Geometry, Shape } from '../Shape';

export interface Circle extends Shape {

  geometry: CircleGeometry;

}

export interface CircleGeometry extends Geometry {

  cx: number;

  cy: number;

  r: number;

  bounds: Bounds;
  
}