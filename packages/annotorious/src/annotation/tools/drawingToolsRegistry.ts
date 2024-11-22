import type { SvelteComponent } from 'svelte';
import { RubberbandRectangle } from './rectangle';
import { RubberbandPolygon } from './polygon';
import type { DrawingMode } from '../../AnnotoriousOpts';
import { RubberbandLine } from './line';
import { RubberbandEllipse } from './ellipse';
import { RubberbandPolyline } from './polyline';
import { RubberbandFreehand } from './freehand';
import { RubberbandCircle } from './circle';


export type DrawingTool = 'rectangle' | 'polygon' | string;

export type DrawingToolOpts = {

  drawingMode?: DrawingMode;

  [key: string]: any;

}

// @ts-ignore
const REGISTERED = new Map<DrawingTool, { tool: typeof SvelteComponent, opts?: DrawingToolOpts }>([
  ['rectangle', { tool: RubberbandRectangle }],
  ['polygon', { tool: RubberbandPolygon }],
  ['line', {tool: RubberbandLine}],
  ['ellipse', {tool : RubberbandEllipse}],
  ['polyline', {tool : RubberbandPolyline}],
  ['freehand', {tool : RubberbandFreehand}],
  ['circle', {tool : RubberbandCircle}]
]);

export const listDrawingTools = () => [...REGISTERED.keys()];

export const getTool = (name: string) => REGISTERED.get(name);
  
export const registerTool = (name: string, tool: typeof SvelteComponent, opts?: DrawingToolOpts) =>
  REGISTERED.set(name, { tool, opts });
