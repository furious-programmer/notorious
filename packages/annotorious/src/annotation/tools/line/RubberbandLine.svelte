<script lang="ts">
  import type { DrawingMode } from '../../../AnnotoriousOpts';
  import { boundsFromPoints, ShapeType, type Line } from '../../../model';
   import { createEventDispatcher, onMount } from 'svelte';
   import type { Transform } from '../..';
  const dispatch = createEventDispatcher<{ create: Line }>();

  /** Props **/
  export let addEventListener: (type: string, fn: EventListener, capture?: boolean) => void;
  export let drawingMode: DrawingMode;
  export let transform: Transform;

  let container: SVGGElement;

  let startPoint: [x: number, y: number] | undefined;
  let endPoint: [number, number] | undefined;

  let isShiftPressed = false;

  let lastPointerDown: number;

  const onPointerDown = (event: Event) => {
    const evt = event as PointerEvent;

    lastPointerDown = performance.now();

    if (drawingMode === 'drag' || drawingMode === 'click') {
      startPoint = transform.elementToImage(evt.offsetX, evt.offsetY);
      endPoint = startPoint;
    }
  };

  const updateShape = (maybeEvent?: Event) => {
    const evt = maybeEvent as PointerEvent;

    if (startPoint) {
      const currentPoint = transform.elementToImage(evt.offsetX, evt.offsetY);

      if (isShiftPressed) {
        // Snap to horizontal, vertical, or 45-degree angles
        const dx = currentPoint[0] - startPoint[0];
        const dy = currentPoint[1] - startPoint[1];
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx > absDy * 2) {
          endPoint = [currentPoint[0], startPoint[1]]; // Horizontal
        } else if (absDy > absDx * 2) {
          endPoint = [startPoint[0], currentPoint[1]]; // Vertical
        } else {
          // Diagonal (45 degrees)
          const diagonal = Math.min(absDx, absDy);
          endPoint = [startPoint[0] + Math.sign(dx) * diagonal, startPoint[1] + Math.sign(dy) * diagonal];
        }
      } else {
        endPoint = currentPoint;
      }
    }
  };

  const onPointerUp = (event: Event) => {
    const evt = event as PointerEvent;

    if (drawingMode === 'click') {
      const timeDifference = performance.now() - lastPointerDown;

      if (timeDifference > 300) return; // Ignore long presses

      evt.stopPropagation();

      if (startPoint && endPoint) {
        stopDrawing();
      } else {
        startPoint = transform.elementToImage(evt.offsetX, evt.offsetY);
        endPoint = startPoint;
      }
    } else if (startPoint && endPoint) {
      stopDrawing();
    }
  };

  const stopDrawing = () => {
    if (startPoint && endPoint) {
      const shape: Line = {
        type: ShapeType.LINE,
        geometry: {
          bounds: boundsFromPoints([startPoint, endPoint]),
          start: startPoint,
          end: endPoint
        }
      };

      dispatch('create', shape);
    }

    startPoint = undefined;
    endPoint = undefined;
  };

  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Shift') {
      isShiftPressed = true;
      updateShape();
    }
  };

  const onKeyUp = (evt: KeyboardEvent) => {
    if (evt.key === 'Shift') {
      isShiftPressed = false;
      updateShape();
    }
  };

  onMount(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);

    addEventListener('pointerdown', onPointerDown);
    addEventListener('pointermove', updateShape);
    addEventListener('pointerup', onPointerUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKeyDown);
    };
  });
</script>

<g 
  bind:this={container}
  class="a9s-annotation a9s-rubberband">
  
  {#if startPoint && endPoint}
    <line 
      class="a9s-inner"
      x1={startPoint[0]} 
      y1={startPoint[1]} 
      x2={endPoint[0]} 
      y2={endPoint[1]} />
      <line 
      class="a9s-outer"
      x1={startPoint[0]} 
      y1={startPoint[1]} 
      x2={endPoint[0]} 
      y2={endPoint[1]} />
  {/if}
</g>
