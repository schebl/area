<script lang="ts">
    import {Canvas} from "./lib/Canvas";
    import {onDestroy} from "svelte";
    import {Polygon} from "./lib/Polygon.svelte";
    import {Ruler} from "./lib/Ruler.svelte";

    let canvas: HTMLCanvasElement;

    let files = $state<FileList | null>(null);
    let canvasImageUrl = $derived.by(() => {
        const file = files?.[0] ?? null;
        if (!file) {
            return null;
        }
        return URL.createObjectURL(file);
    });

    let polygon = new Polygon();
    let ruler = new Ruler();

    let units = $state(1);
    let scale = $derived.by(() => {
        if (ruler.length() === 0) {
            return 1;
        }
        return units / ruler.length();
    });

    interface PointAppender {
        addPoint(x: number, y: number): void;
    }

    let editingShape: PointAppender = $state(polygon);

    function handleAddPoint(e: MouseEvent) {
        editingShape.addPoint(e.offsetX, e.offsetY);
    }

    function handleClearAll() {
        polygon.clear();
        ruler.clear();
    }

    $effect(() => {
        const cnv = new Canvas(canvas);
        cnv.clear();

        cnv.drawPoints(polygon.points, true);
        cnv.drawPoints(ruler.points, false);
    });

    $effect(() => {
        // save replaced image url
        const url = canvasImageUrl;
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    });

    onDestroy(() => {
        if (canvasImageUrl) {
            URL.revokeObjectURL(canvasImageUrl);
        }
    });
</script>

<main>
    <canvas
        bind:this={canvas}
        onclick={handleAddPoint}
        width="500"
        height="500"
        style="background-image: {canvasImageUrl ? `url(${canvasImageUrl})` : 'none'}"
    ></canvas>

    <div>
        <input type="file" accept="image/*" bind:files={files}>

        <div>
            Units: <input type="number" bind:value={units}>
        </div>

        <p>Polygon Area: {polygon.area() * scale ** 2}</p>
    </div>

    <div>
        <h3>Building Mode</h3>

        <button
            onclick={() => {editingShape = polygon}}
            disabled={editingShape === polygon}
        >
            Polygon
        </button>

        <button
            onclick={() => {editingShape = ruler}}
            disabled={editingShape === ruler}
        >
            Ruler
        </button>
    </div>

    <button onclick={handleClearAll}>Clear All</button>
</main>

<style>
    canvas {
        border: 1px solid #535bf2;
        background-repeat: no-repeat;
        background-size: contain;
        background-position-y: center;
        background-position-x: center;
    }
</style>
