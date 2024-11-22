<script lang="ts">
    import { boundsFromPoints, getPathFromPoints, ShapeType, type Freehand, type FreehandGeometry, type Shape } from '../../../model';
    import type { Transform } from '../../Transform';
    import { Editor, Handle } from '..';
    
      export let shape: Freehand; 
      export let transform: Transform; 
      export let viewportScale: number = 1; 
    
      $: geom = shape.geometry; 
      $: handleSize = 10 / viewportScale; 
    
      const editor = (freehand: Shape, handle: string, delta: [number, number]) => {
        const geom = freehand.geometry as FreehandGeometry;
        let points: [number, number][];
        const [dx, dy] = delta;
    
        if(handle === 'SHAPE')
        {
            points = geom.points.map(([x, y]) => [x+dx, y+dy])
        }
        else{
            points = [];
        }
    
        const bounds = boundsFromPoints(points);
        return {
          ...freehand,
          geometry: {
            points, bounds
          }
        };
      };
    </script>
    
    <Editor
      shape={shape}
      transform={transform}
      editor={editor}
      on:grab
      on:change 
      on:release
      let:grab={grab}>
    
      <!-- Line Shape -->
      <path
        class="a9s-outer"
        on:pointerdown={grab('SHAPE')}
        d={getPathFromPoints(ShapeType.FREEHAND ,geom.points)} />
    
      <path
        class="a9s-inner a9s-shape-handle"
        on:pointerdown={grab('SHAPE')}
        d={getPathFromPoints(ShapeType.FREEHAND, geom.points)} />
    

    </Editor>
    