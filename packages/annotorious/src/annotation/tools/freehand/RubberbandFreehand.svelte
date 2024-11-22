<script lang="ts">
    import type { DrawingMode } from '../../../AnnotoriousOpts';
    import { boundsFromPoints, getPathFromPoints, ShapeType, type Freehand } from '../../../model';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Transform } from '../..';
  
    const dispatch = createEventDispatcher<{ create: Freehand }>();
  
    /** Props **/
    export let addEventListener: (type: string, fn: EventListener, capture?: boolean) => void;
    export let drawingMode: DrawingMode;
    export let transform: Transform;
  
    let container: SVGGElement;
  
    let points: [number, number][] = [];
    let isDrawing = false;
  
    const onPointerDown = (event: Event) => {
      const evt = event as PointerEvent;
  
      if (drawingMode === 'drag') {
        isDrawing = true;
        points = [transform.elementToImage(evt.offsetX, evt.offsetY)];
      }
    };
  
    const updateShape = (maybeEvent?: Event) => {
      if (isDrawing) {
        const evt = maybeEvent as PointerEvent;
        const currentPoint = transform.elementToImage(evt.offsetX, evt.offsetY);
        points = [...points, currentPoint];
      }
    };
  
    const onPointerUp = (event: Event) => {
      if (isDrawing && points.length > 1) {
        stopDrawing();
      } else {
        isDrawing = false;
      }
    };
  
    const stopDrawing = () => {
      if (points.length > 1) {
        const shape: Freehand = {
          type: ShapeType.FREEHAND,
          geometry: {
            bounds: boundsFromPoints(points),
            points
          }
        };
  
        dispatch('create', shape);
      }
  
      points = [];
      isDrawing = false;
    };
  
    onMount(() => {
      addEventListener('pointerdown', onPointerDown);
      addEventListener('pointermove', updateShape);
      addEventListener('pointerup', onPointerUp);
  
      return () => {
        points = [];
      };
    });
  </script>
  
  <g 
    bind:this={container}
    class="a9s-annotation a9s-rubberband">
  
    {#if points.length > 1}
      <path 
        class="a9s-inner"
        d={getPathFromPoints(ShapeType.FREEHAND ,points)} />
      <path 
        class="a9s-outer"
        d={getPathFromPoints(ShapeType.FREEHAND ,points)} />
    {/if}
  </g>
  