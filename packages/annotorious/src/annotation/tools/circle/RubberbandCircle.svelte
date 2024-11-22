<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { DrawingMode } from '../../../AnnotoriousOpts';
    import { ShapeType, type Circle } from '../../../model';
    import type { Transform } from '../..';
  
    const dispatch = createEventDispatcher<{ create: Circle }>();
  
    /** Props **/
    export let addEventListener: (type: string, fn: EventListener, capture?: boolean) => void;
    export let drawingMode: DrawingMode;
    export let transform: Transform;
  
    let container: SVGGElement;
  
    let origin: [x: number, y: number] | undefined;
    let anchor: [number, number] | undefined;
  
    let cx: number, cy: number, r: number;
    let isShiftPressed = false;
    let isCtrlPressed = false;
  
    let lastPointerDown: number;
    let lastMoveEvent: PointerEvent | undefined;
  
    const onPointerDown = (event: Event) => {
      const evt = event as PointerEvent;
  
      lastPointerDown = performance.now();
  
      if (drawingMode === 'drag') {
        origin = transform.elementToImage(evt.offsetX, evt.offsetY);
        anchor = origin;
  
        cx = origin[0];
        cy = origin[1];
        r = 1;
      }
    };
  
    const updateShape = (maybeEvent?: Event) => {
      const evt = (maybeEvent as PointerEvent) || lastMoveEvent;
  
      if (origin) {
        anchor = transform.elementToImage(evt!.offsetX, evt!.offsetY);
  
        const dx = Math.abs(anchor[0] - origin[0]);
        const dy = Math.abs(anchor[1] - origin[1]);
  
        const diameter = isShiftPressed ? Math.max(dx, dy) : Math.min(dx, dy);
        r = diameter / 2;
  
        cx = (origin[0] + anchor[0]) / 2;
        cy = (origin[1] + anchor[1]) / 2;
      }
  
      if (maybeEvent) lastMoveEvent = maybeEvent as PointerEvent;
    };
  
    const onPointerUp = (event: Event) => {
      const evt = event as PointerEvent;
  
      if (drawingMode === 'click') evt.stopImmediatePropagation();
  
      const timeDifference = performance.now() - lastPointerDown;
  
      if (drawingMode === 'click') {
        if (timeDifference > 300) return;
  
        evt.stopPropagation();
  
        if (origin) {
          stopDrawing();
        } else {
          origin = transform.elementToImage(evt.offsetX, evt.offsetY);
          anchor = origin;
  
          cx = origin[0];
          cy = origin[1];
          r = 1;
        }
      } else if (origin) {
        if (timeDifference > 300 || r * 2 > 15) {
          evt.stopPropagation();
          stopDrawing();
        } else {
          origin = undefined;
          anchor = undefined;
          lastMoveEvent = undefined;
        }
      }
    };
  
    const stopDrawing = () => {
      // Require at least 4-pixel diameter
      if (r * 2 > 4) {
        const shape: Circle = {
          type: ShapeType.CIRCLE,
          geometry: {
            bounds: {
          minX: cx - r,
          minY: cy - r,
          maxX: cx + r,
          maxY: cy + r
            },
            cx,
            cy,
            r
          }
        };
  
        dispatch('create', shape);
      }
  
      origin = undefined;
      anchor = undefined;
      lastMoveEvent = undefined;
    };
  
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Shift') {
        isShiftPressed = true;
        updateShape();
      }
  
      if (evt.key === 'Control') {
        isCtrlPressed = true;
        updateShape();
      }
    };
  
    const onKeyUp = (evt: KeyboardEvent) => {
      if (evt.key === 'Shift') {
        isShiftPressed = false;
        updateShape();
      }
  
      if (evt.key === 'Control') {
        isCtrlPressed = false;
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
    
    {#if origin}
      <circle 
        class="a9s-outer"
        cx={cx} 
        cy={cy} 
        r={r} />
      
      <circle 
        class="a9s-inner"
        cx={cx} 
        cy={cy} 
        r={r} />
    {/if}
  </g>
  