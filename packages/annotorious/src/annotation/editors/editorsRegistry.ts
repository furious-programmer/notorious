import { ShapeType, type Shape } from '../../model';
import type { SvelteComponent } from 'svelte';
import { PolygonEditor } from './polygon';
import { RectangleEditor } from './rectangle';
import { EllipseEditor } from './ellipse';
import { LineEditor } from './line';
import { PolylineEditor } from './polyline';
import {FreehandEditor} from './freehand';
import { CircleEditor } from './circle';

const REGISTERED = new Map<ShapeType, typeof SvelteComponent>([
  [ShapeType.RECTANGLE, RectangleEditor as typeof SvelteComponent],
  [ShapeType.POLYGON, PolygonEditor as typeof SvelteComponent],
  [ShapeType.ELLIPSE, EllipseEditor as typeof SvelteComponent],
  [ShapeType.LINE, LineEditor as typeof SvelteComponent],
  [ShapeType.POLYLINE, PolylineEditor as typeof SvelteComponent],
  [ShapeType.FREEHAND, FreehandEditor as typeof SvelteComponent],
  [ShapeType.CIRCLE, CircleEditor as typeof SvelteComponent],
]);

export const getEditor = (shape: Shape) => REGISTERED.get(shape.type);

export const registerEditor = (shapeType: ShapeType, editor: typeof SvelteComponent) =>
  REGISTERED.set(shapeType, editor);