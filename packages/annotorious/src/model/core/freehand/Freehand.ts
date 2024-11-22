import type { Geometry, Shape } from '../Shape';

export interface Freehand extends Shape {

  geometry: FreehandGeometry;

}

export interface FreehandGeometry extends Geometry {
    points : Array<[number,number]>;
}