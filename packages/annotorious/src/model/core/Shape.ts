import type { AbstractSelector } from '@annotorious/core';

export interface Shape extends AbstractSelector {

  type: ShapeType;

  geometry: Geometry;

}

export enum ShapeType {

  ELLIPSE = 'ELLIPSE',

  POLYGON = 'POLYGON',

  RECTANGLE = 'RECTANGLE',
  
  CIRCLE = 'CIRCLE',

  POLYLINE = 'POLYLINE',

  POINT = 'POINT',

  LINE = 'LINE',

  FREEHAND = 'FREEHAND'

}

export interface Geometry {

  bounds: Bounds;

}

export interface Bounds {

  minX: number;

  minY: number;

  maxX: number;

  maxY: number;

}