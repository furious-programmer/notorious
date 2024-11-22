<script lang="ts">
    import type { DrawingStyleExpression } from '@annotorious/core';
    import { type Geometry, type FreehandGeometry, type ImageAnnotation, getPathFromPoints, ShapeType } from '../../model';
    import { computeStyle } from '../utils/styling';
    
    /** Props */
    export let annotation: ImageAnnotation;
    export let geom: Geometry;
    export let style: DrawingStyleExpression<ImageAnnotation> | undefined;
  
    $: computedStyle = computeStyle(annotation, style);
  
    const { points } = geom as FreehandGeometry;

  </script>
  
  <g class="a9s-annotation" data-id={annotation.id}>
    <path     
    class="a9s-outer"
    style={computedStyle ? 'display:none;' : undefined} 
    d={getPathFromPoints(ShapeType.FREEHAND ,points)} />
    <path     
    class="a9s-inner"
    style={computedStyle}
    d={getPathFromPoints(ShapeType.FREEHAND ,points)} />
  </g>
  