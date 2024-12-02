<script lang="ts" generics="I extends Annotation, E extends unknown">
  import type { SvgDisplayLayerClickEvent } from "./SvgDisplayLayerClickEvent";
  import OpenSeadragon from "openseadragon";
  import type { DrawingStyleExpression, Filter } from "@annotorious/core";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import Shapes from "./Shapes.svelte";
  import {
    isImageAnnotation,
    type Annotation,
    type ImageAnnotation,
    type SvelteImageAnnotatorState,
    type SVGAnnotationLayerPointerEvent,
  } from "@annotorious/annotorious";
  import OSDLayer from "../OSDLayer.svelte";

  export let state: SvelteImageAnnotatorState<I, E>;
  export let style: DrawingStyleExpression<ImageAnnotation> | undefined =
    undefined;
  export let viewer: OpenSeadragon.Viewer;
  export let filter: Filter<ImageAnnotation> | undefined;

  const dispatch = createEventDispatcher<{
    click: SvgDisplayLayerClickEvent;
  }>();
  let displayEl: SVGElement;
  let lastPress: { x: number; y: number } | undefined;
  const { store, selection, hover, viewport } = state;

  const MAX_CLICK_DURATION = 300;

  const onCanvasPress = (evt: OpenSeadragon.CanvasPressEvent) => {
    const { x, y } = evt.position;
    lastPress = { x, y };
  };

  const onCanvasDrag = (evt : OpenSeadragon.CanvasDragEvent) => {
    const { x, y } = evt.position;
    const hit = store.getAt(x, y);
    const isVisibleHit = hit && (!filter || filter(hit));
    if (isVisibleHit) {
      displayEl.classList.add('hover');

      if ($hover !== hit.id) {
        hover.set(hit.id);
      }
    } else {
      displayEl.classList.remove('hover');

      if ($hover) {
        hover.set(undefined);
      }
    }
  }

  const onCanvasRelease = (evt: OpenSeadragon.CanvasReleaseEvent) => {
    if (!lastPress) return;

    const originalEvent = evt.originalEvent as PointerEvent;

    const { x, y } = evt.position;
    const dx = x - lastPress.x;
    const dy = y - lastPress.y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) {
      const { x, y } = getImageXY(evt.position);
      const annotation = store.getAt(x, y);

      if (annotation) dispatch("click", { originalEvent, annotation });
      else dispatch("click", { originalEvent });
    }

    lastPress = undefined;
  };

  const getImageXY = (xy: OpenSeadragon.Point): OpenSeadragon.Point => {
    const offsetXY = new OpenSeadragon.Point(xy.x, xy.y);
    const { x, y } = viewer.viewport.pointFromPixel(offsetXY);
    return viewer.viewport.viewportToImageCoordinates(x, y);
  };

  // Add the event listeners on mount
  onMount(() => {
    viewer.element.querySelector(".openseadragon-canvas")?.appendChild(displayEl);
    // Event handlers
    viewer.addHandler('canvas-press', onCanvasPress);
    viewer.addHandler('canvas-release', onCanvasRelease);
    viewer.addHandler('canvas-drag', onCanvasDrag);
  });

  onDestroy(() => {
    viewer.removeHandler('canvas-drag', onCanvasDrag);
    viewer.removeHandler('canvas-press', onCanvasPress);
    viewer.removeHandler('canvas-release', onCanvasRelease);
  });
</script>

<OSDLayer {viewer} let:transform let:scale>
  <svg bind:this={displayEl} class="a9s-osd-displaylayer">
    <g {transform} {scale}>
      {#each $store.filter((a) => isImageAnnotation(a)) as annotation}
        {#if isImageAnnotation(annotation)}
          <Shapes {annotation} {style} />
        {/if}
      {/each}
    </g>
  </svg>
</OSDLayer>

<style>
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    outline: none;
    pointer-events: none;
  }
</style>