<script lang="ts">
    import type { Transform } from "src/annotation/Transform";
    import type { Circle, Shape } from "src/model";
    import { Editor, Handle } from "..";
  
    /** Props **/
    export let shape: Circle;
    export let transform: Transform;
    export let viewportScale: number = 1;
  
    $: geom = shape.geometry;
    $: handleSize = 10 / viewportScale;
  
    const editor = (circle: Shape, handle: string, delta: [number, number]) => {
      const initialBounds = circle.geometry.bounds;
  
      let [x0, y0] = [initialBounds.minX, initialBounds.minY];
      let [x1, y1] = [initialBounds.maxX, initialBounds.maxY];
  
      const [dx, dy] = delta;
  
      if (handle === 'SHAPE') {
        x0 += dx;
        x1 += dx;
        y0 += dy;
        y1 += dy;
      } else {
        switch (handle) {
          case 'TOP': {
            y0 += dy;
            x0 -= Math.abs(dy);
            x1 += Math.abs(dy);
            break;
          }
          case 'BOTTOM': {
            y1 += dy;
            x0 -= Math.abs(dy);
            x1 += Math.abs(dy);
            break;
          }
          case 'LEFT': {
            x0 += dx;
            y1 += Math.abs(dx);
            y0 -= Math.abs(dx);
            break;
          }
          case 'RIGHT': {
            x1 += dx;
            y1 += Math.abs(dx);
            y0 -= Math.abs(dx)
            break;
          }
        }
      }

      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const r = Math.min(Math.abs(x1 - x0), Math.abs(y1 - y0)) / 2; 
  
      return {
        ...circle,
        geometry: {
          ...circle.geometry,
          cx,
          cy,
          r,
          bounds: {
            minX: cx - r,
            minY: cy - r,
            maxX: cx + r,
            maxY: cy + r
          }
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
  
    <circle
      class="a9s-outer"
      on:pointerdown={grab('SHAPE')}
      cx={geom.cx} 
      cy={geom.cy} 
      r={geom.r} />
  
    <circle
      class="a9s-inner a9s-shape-handle"
      on:pointerdown={grab('SHAPE')}
      cx={geom.cx} 
      cy={geom.cy} 
      r={geom.r} />
  
    <Handle
      class="a9s-handle-top"
      on:pointerdown={grab('TOP')}
      x={geom.cx} 
      y={geom.cy - geom.r}
      scale={viewportScale} />
  
    <Handle
      class="a9s-handle-right"
      on:pointerdown={grab('RIGHT')}
      x={geom.cx + geom.r} 
      y={geom.cy}
      scale={viewportScale} />
  
    <Handle
      class="a9s-handle-bottom"
      on:pointerdown={grab('BOTTOM')}
      x={geom.cx} 
      y={geom.cy + geom.r}
      scale={viewportScale} />
  
    <Handle
      class="a9s-handle-left"
      on:pointerdown={grab('LEFT')}
      x={geom.cx - geom.r} 
      y={geom.cy}
      scale={viewportScale} />
  </Editor>
  