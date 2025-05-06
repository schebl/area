<script lang="ts">
    import {Canvas} from "./lib/Canvas";
    import type {Point} from "./lib/Point";

    let canvas: HTMLCanvasElement;

    const polygonPoints: Point[] = $state([]);

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
</main>
