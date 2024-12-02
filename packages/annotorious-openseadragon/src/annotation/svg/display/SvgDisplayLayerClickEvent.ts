import type { ImageAnnotation } from '@annotorious/annotorious/src';

export interface SvgDisplayLayerClickEvent {
  
  originalEvent: PointerEvent;
  
  annotation?: ImageAnnotation | undefined;

}