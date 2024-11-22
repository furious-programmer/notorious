<script lang="ts">
  import type { Line, LineGeometry, Shape } from '../../../model';
  import type { Transform } from '../../Transform';
  import { Editor, Handle } from '..';
  
    export let shape: Line; // The Line shape to edit
    export let transform: Transform; // Transformation functions
    export let viewportScale: number = 1; // Scale to adjust handle size dynamically
  
    $: geom = shape.geometry; // Geometry of the Line shape
    $: handleSize = 10 / viewportScale; // Adjust handle size based on viewport scale
  
    // Editor function to handle drag and resize events
    const editor = (line: Shape, handle: string, delta: [number, number]) => {
      const { start, end } = line.geometry as LineGeometry;
  
      const [dx, dy] = delta;
  
      let newStart = [...start];
      let newEnd = [...end];
  
      // Handle dragging or resizing based on the selected handle
      switch (handle) {
        case 'LINE': {
          newStart = [start[0] + dx, start[1] + dy];
          newEnd = [end[0] + dx, end[1] + dy];
          break;
        }
        case 'START': {
          newStart = [start[0] + dx, start[1] + dy];
          break;
        }
        case 'END': {
          newEnd = [end[0] + dx, end[1] + dy];
          break;
        }
      }
  
      return {
        ...line,
        geometry: {
          ...line.geometry,
          start: newStart,
          end: newEnd
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
    <line
      class="a9s-outer"
      on:pointerdown={grab('LINE')}
      x1={geom.start[0]} 
      y1={geom.start[1]} 
      x2={geom.end[0]} 
      y2={geom.end[1]} />
  
    <line
      class="a9s-inner a9s-shape-handle"
      on:pointerdown={grab('LINE')}
      x1={geom.start[0]} 
      y1={geom.start[1]} 
      x2={geom.end[0]} 
      y2={geom.end[1]} />
  
    <!-- Handle for Start Point -->
    <Handle 
      class="a9s-handle-start"
      on:pointerdown={grab('START')}
      x={geom.start[0]} 
      y={geom.start[1]} 
      scale={viewportScale} />
  
    <!-- Handle for End Point -->
    <Handle 
      class="a9s-handle-end"
      on:pointerdown={grab('END')}
      x={geom.end[0]} 
      y={geom.end[1]} 
      scale={viewportScale} />
  </Editor>
  