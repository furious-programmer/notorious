<script lang="ts">
    import type { DrawingStyleExpression } from '@annotorious/core';
    import type { Geometry, CircleGeometry, ImageAnnotation } from '../../model';
    import { computeStyle } from '../utils/styling';
    
    /** Props */
    export let annotation: ImageAnnotation;
    export let geom: Geometry;
    export let style: DrawingStyleExpression<ImageAnnotation> | undefined;
  
    $: computedStyle = computeStyle(annotation, style);
  
    const { cx, cy, r } = geom as CircleGeometry;
  </script>
  
  <g class="a9s-annotation" data-id={annotation.id}>
    <circle
      class="a9s-outer"
      style={computedStyle ? 'display:none;' : undefined}
      cx={cx} 
      cy={cy} 
      r={r}/>
  
    <circle
      class="a9s-inner"
      style={computedStyle}
      cx={cx} 
      cy={cy} 
      r={r} />
  </g>
  