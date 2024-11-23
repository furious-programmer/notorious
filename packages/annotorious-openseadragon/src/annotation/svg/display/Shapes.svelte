<script>
  import { ShapeType } from "@annotorious/annotorious";
  import { CircleComponent, EllipseComponent, FreehandComponent, LineComponent, PolygonComponent, PolyLineComponent, RectangleComponent } from "@annotorious/annotorious/src";

    export let annotation;
    export let style;
  
    const selector = annotation.target.selector;
  </script>
  
  {#if selector?.type === ShapeType.ELLIPSE}
    <EllipseComponent annotation={annotation} geom={selector.geometry} style={style} />
  {:else if selector?.type === ShapeType.RECTANGLE}
    <RectangleComponent annotation={annotation} geom={selector.geometry} style={style} />
  {:else if selector?.type === ShapeType.POLYGON}
    <PolygonComponent annotation={annotation} geom={selector.geometry} style={style} />
  {:else if selector?.type === ShapeType.LINE}
    <LineComponent annotation={annotation} geom={selector.geometry} style={style} />
  {:else if selector?.type === ShapeType.POLYLINE}
    <PolyLineComponent annotation={annotation} geom={selector.geometry} style={style} />
  {:else if selector?.type === ShapeType.FREEHAND}
    <FreehandComponent annotation={annotation} geom={selector.geometry} style={style} />
  {:else if selector?.type === ShapeType.CIRCLE}
    <CircleComponent annotation={annotation} geom={selector.geometry} style={style} />
  {/if}
  