<script lang="ts">
  import { Editor, Handle } from '..';
  import type { PolyLine, PolyLineGeometry } from 'src/model/core/polyline';
  import type { Transform } from 'src/annotation/Transform';
  import { boundsFromPoints, calculateMidpoints, calculatePerpendicularPoints, ShapeType, type Shape } from '../../../model';


    /** Props */
    export let shape: PolyLine;
    export let computedStyle: string | undefined;
    export let transform: Transform;
    export let viewportScale: number = 1;

    let perpendicularPoints : Array<Array<number>> = []
    $: geom = shape.geometry;
  
    $: {
  let midpoints =  calculateMidpoints(ShapeType.POLYLINE, [...geom.points].filter(Boolean) as [number, number][]);
  perpendicularPoints = midpoints.map(([mx, my], index) => {
    const [x1, y1] = geom.points[index];
    const [x2, y2] = geom.points[index + 1];
    const angle = Math.atan2(y2 - y1, x2 - x1);

    return {
      ...calculatePerpendicularPoints(ShapeType.POLYLINE, mx, my, angle, 10)
    };
  });
  }
  
    const editor = (polyline: Shape, handle: string, delta: [number, number]) => {
    let points: [number, number][];

    const geom = (polyline.geometry) as PolyLineGeometry;

    if (handle === 'SHAPE') {
      points = geom.points.map(([x, y]) => [x + delta[0], y + delta[1]]);
    } else {
      points = geom.points.map(([x, y], idx) =>
        handle === `HANDLE-${idx}` ? [x + delta[0], y + delta[1]] : [x, y]
      );
    }

    const bounds = boundsFromPoints(points);

    return {
      ...polyline,
      geometry: { points, bounds, perpendicularPoints }
    }
  }




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

  <Editor
  shape={shape}
  transform={transform}
  editor={editor}
  on:change 
  on:grab
  on:release
  let:grab={grab}>

  <polyline
  class="a9s-outer"
  style={computedStyle ? 'display:none;' : undefined}
  on:pointerdown={grab('SHAPE')}
  points={shape.geometry.points.map(([x, y]) => `${x},${y}`).join(' ')} />

<polyline
  class="a9s-inner a9s-shape-handle"
  style={computedStyle}
  on:pointerdown={grab('SHAPE')}
  points={shape.geometry.points.map(([x, y]) => `${x},${y}`).join(' ')} />

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

  {#each geom.points as point, idx}
  <Handle 
    on:pointerdown={grab(`HANDLE-${idx}`)}
    x={point[0]} y={point[1]} 
    scale={viewportScale} />
  {/each}
</Editor>
  