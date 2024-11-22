<script lang="ts">
    import type { DrawingStyleExpression } from '@annotorious/core';
    import type { Geometry, LineGeometry, ImageAnnotation } from '../../model';
  import { computeStyle } from '../utils';

  
    /** Props */
    export let annotation: ImageAnnotation;
    export let geom: Geometry;
    export let style: DrawingStyleExpression<ImageAnnotation> | undefined;
  
    $: computedStyle = computeStyle(annotation, style);
  
    const { start, end } = geom as LineGeometry;
  </script>
  
  <g class="a9s-annotation" data-id={annotation.id}>
    <line
      class="a9s-outer"
      style={computedStyle ? 'display:none;' : undefined}
      x1={start[0]}
      y1={start[1]}
      x2={end[0]}
      y2={end[1]} />
  
    <line
      class="a9s-inner"
      style={computedStyle}
      x1={start[0]}
      y1={start[1]}
      x2={end[0]}
      y2={end[1]} />
  </g>
  