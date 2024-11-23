<script lang="ts" generics="I extends Annotation, E extends unknown">
  import { createEventDispatcher, onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import type { Annotation, DrawingStyleExpression, StoreChangeEvent } from '@annotorious/core';
  import { isImageAnnotation, type Filter, type ImageAnnotation, type ImageAnnotatorState, type SvelteImageAnnotatorState } from '@annotorious/annotorious';
  import Shapes from './Shapes.svelte';
  import OSDLayer from '../OSDLayer.svelte';

  export let filter: Filter<ImageAnnotation> | undefined;
  export let state: SvelteImageAnnotatorState<I, E>;
  export let style: DrawingStyleExpression<ImageAnnotation> | undefined;
  export let viewer: OpenSeadragon.Viewer;
  export let visible = true;

  const { store, hover, selection, viewport } = state;
  const dispatch = createEventDispatcher<{ click: { originalEvent: Event; annotation?: ImageAnnotation } }>();

  let canvas: HTMLCanvasElement;
  let currentViewportBounds: { x: number, y: number, width: number, height: number };

  const getImageXY = (xy: OpenSeadragon.Point): OpenSeadragon.Point => {
    const offsetXY = new OpenSeadragon.Point(xy.x, xy.y);
    const { x, y } = viewer.viewport.pointFromPixel(offsetXY);
    return viewer.viewport.viewportToImageCoordinates(x, y);
  };

  const updateViewportState = () => {
    const viewportBounds = viewer.viewport.getBounds();
    currentViewportBounds = viewer.viewport.viewportToImageRectangle(viewportBounds);

    const { x, y, width, height } = currentViewportBounds;
    const intersecting = store.getIntersecting(x, y, width, height);
    viewport.set(intersecting.map(a => a.id));
  };

  const onStoreChange = () => {
    if (currentViewportBounds) {
      const { x, y, width, height } = currentViewportBounds;
      const intersecting = store.getIntersecting(x, y, width, height);
      viewport.set(intersecting.map(a => a.id));
    } else {
      viewport.set(store.all().map(a => a.id));
    }
  };

  onMount(() => {
    canvas = document.createElement('canvas');
    const { offsetWidth, offsetHeight } = viewer.canvas;
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    canvas.className = 'a9s-gl-canvas';
    viewer.element.querySelector('.openseadragon-canvas')?.appendChild(canvas);

    const updateCanvasSize = () => {
      canvas.width = viewer.canvas.offsetWidth;
      canvas.height = viewer.canvas.offsetHeight;
    };

    viewer.addHandler('update-viewport', updateViewportState);
    store.observe(onStoreChange);

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      viewer.removeHandler('update-viewport', updateViewportState);
      store.unobserve(onStoreChange);
      window.removeEventListener('resize', updateCanvasSize);
      canvas.parentNode?.removeChild(canvas);
    };
  });
</script>

<OSDLayer viewer={viewer} let:transform>
  <svg class="a9s-annotationlayer">
    <g transform={transform}>
      {#each $store.filter(a => isImageAnnotation(a)) as annotation (annotation.id)}
        {#if isImageAnnotation(annotation)}
          <Shapes annotation={annotation} style={style} />
        {/if}
      {/each}
    </g>
  </svg>
</OSDLayer>

<style>
svg {
  pointer-events: none;
}
svg .a9s-annotation {
  pointer-events: auto;
}
</style>
