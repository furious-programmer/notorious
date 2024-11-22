<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import type { DrawingMode } from '../../../AnnotoriousOpts';
  import type { PolyLine } from 'src/model';
  import { boundsFromPoints, calculateMidpoints, calculatePerpendicularPoints, ShapeType } from '../../../model';
  import { distance } from '../../utils';
  import type { Transform } from '../..';

  const dispatch = createEventDispatcher<{ create: PolyLine }>();

  /** Props **/
  export let addEventListener: (type: string, fn: EventListener, capture?: boolean) => void;
  export let drawingMode: DrawingMode;
  export let transform: Transform;
  export let viewportScale = 1;

  let lastPointerDown: { timeStamp: number; offsetX: number; offsetY: number };

  let points: [number, number][] = [];

  let cursor: [number, number] | undefined;

  $: handleSize = 10 / viewportScale;

  let perpendicularPoints : Array<Array<number>> = []



  $: {
  let midpoints =  calculateMidpoints(ShapeType.POLYLINE, [...points, cursor].filter(Boolean) as [number, number][]);
  perpendicularPoints = midpoints.map(([mx, my], index) => {
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1] ? points[index + 1]  : cursor as [number, number];
    const angle = Math.atan2(y2 - y1, x2 - x1);

    return {
      ...calculatePerpendicularPoints(ShapeType.POLYLINE, mx, my, angle, 10)
    };
  });
  }


  const onPointerDown = (event: Event) => {
    const evt = event as PointerEvent;

    const { timeStamp, offsetX, offsetY } = evt;
    lastPointerDown = { timeStamp, offsetX, offsetY };

    if (drawingMode === 'drag') {
      if (points.length === 0) {
        const point = transform.elementToImage(evt.offsetX, evt.offsetY);
        points.push(point);

        cursor = point;
      }
    }
  };

  const onPointerMove = (event: Event) => {
    const evt = event as PointerEvent;

    if (points.length > 0) {
      cursor = transform.elementToImage(evt.offsetX, evt.offsetY);
    }
  };

  const onPointerUp = (event: Event) => {
    const evt = event as PointerEvent;

    if (drawingMode === 'click') {
      const timeDifference = evt.timeStamp - lastPointerDown.timeStamp;

      const d = distance(
        [lastPointerDown.offsetX, lastPointerDown.offsetY],
        [evt.offsetX, evt.offsetY]
      );

      if (timeDifference > 300 || d > 15) return;

      if (points.length === 0) {
        const point = transform.elementToImage(evt.offsetX, evt.offsetY);
        points.push(point);

        cursor = point;
      } else {
        points.push(cursor!);
      }
    } else {
      if (points.length === 1) {
        const dist = distance(points[0], cursor!);
        if (dist <= 4) {
          points = [];
          cursor = undefined;
          return;
        }
      }

      evt.stopImmediatePropagation();
      points.push(cursor!);
    }
  };

  const onDblClick = () => {
    if (!cursor || points.length < 2) return;

    const shape: PolyLine = {
      type: ShapeType.POLYLINE,
      geometry: {
        bounds: boundsFromPoints(points),
        points: [...points, cursor],
        perpendicularPoints: [...perpendicularPoints]
      },
    };

    points = [];
    cursor = undefined;

    dispatch('create', shape);
  };

  onMount(() => {
    addEventListener('pointerdown', onPointerDown, true);
    addEventListener('pointermove', onPointerMove);
    addEventListener('pointerup', onPointerUp, true);
    addEventListener('dblclick', onDblClick, true);
  });
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
<g class="a9s-annotation a9s-rubberband">
  {#if cursor}
    {@const coords = [...points, cursor].map(xy => xy.join(',')).join(' ')}
    <polyline 
      class="a9s-outer" 
      points={coords} />

    <polyline 
      class="a9s-inner" 
      points={coords} />
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
  {/if}
</g>
