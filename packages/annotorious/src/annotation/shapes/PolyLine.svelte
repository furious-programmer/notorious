<script lang="ts">
    import type { DrawingStyleExpression } from '@annotorious/core';
    import type { Geometry, ImageAnnotation, PolyLineGeometry } from '../../model';
    import { computeStyle } from '../utils/styling';
    
    /** Props **/
    export let annotation: ImageAnnotation;
    export let geom: Geometry;
    export let style: DrawingStyleExpression<ImageAnnotation> | undefined;
  
    $: computedStyle = computeStyle(annotation, style);

    const { points, perpendicularPoints } = geom as PolyLineGeometry;
  </script>
<defs>
  <marker
    id="arrow"
    viewBox="0 0 10 10"
    refX="5"
    refY="5"
    markerWidth="6"
    markerHeight="6"
    orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" />
  </marker>

</defs>
<g class="a9s-annotation" data-id={annotation.id}>
    <polyline 
      class="a9s-outer"
      style={computedStyle ? 'display:none;' : undefined}
      points={points.map(xy => xy.join(',')).join(' ')} />
  
    <polyline 
      class="a9s-inner"
      style={computedStyle}
      points={points.map(xy => xy.join(',')).join(' ')} />
      {#each perpendicularPoints as [x1, y1, x2, y2] }
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        style="stroke: black;" 
        marker-start="url(#arrow)" 
      />
    {/each}
    
  </g>


