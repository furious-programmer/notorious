import type { Bounds, Geometry, Shape } from '../Shape';

export interface Line extends Shape {

  geometry: LineGeometry;

}

export interface LineGeometry extends Geometry {
    start: [x: number, y: number];
    end: [x: number, y: number];
}