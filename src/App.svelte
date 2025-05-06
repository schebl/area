<script lang="ts">
    import {Canvas} from "./lib/Canvas";
    import type {Point} from "./lib/Point";

    let canvas: HTMLCanvasElement;

    const polygonPoints: Point[] = $state([]);
    let polygonArea = $derived(getPolygonArea(polygonPoints));

    function getPolygonArea(polygon: Point[]): number {
        let area = 0;
        for (let i = 0; i < polygon.length; i++) {
            const {x: x1, y: y1} = polygon[i];
            const {x: x2, y: y2} = polygon[(i + 1) % polygon.length];

            area += x1 * y2 - x2 * y1;
        }
        return Math.abs(area) / 2;
    }

    function handleAddPoint(e: MouseEvent) {
        polygonPoints.push({
            x: e.offsetX,
            y: e.offsetY,
        });
    }

    $effect(() => {
        const cnv = new Canvas(canvas);
        cnv.drawPoints(polygonPoints, true);
    });
</script>

<main>
    <canvas
        bind:this={canvas}
        onclick={handleAddPoint}
        width="500"
        height="500"
        style="border: 1px solid #535bf2"
    ></canvas>

    <p>Area: {polygonArea}</p>
</main>
