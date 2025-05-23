<script lang="ts">
    import {Canvas} from "./lib/Canvas";
    import {onDestroy} from "svelte";
    import {Polygon} from "./lib/Polygon.svelte";
    import {Ruler} from "./lib/Ruler.svelte";

    let canvas: HTMLCanvasElement;

    let lineColor = $state("#ff4500");

    let files = $state<FileList | null>(null);
    let canvasImageUrl = $derived.by(() => {
        const file = files?.[0] ?? null;
        if (!file) {
            return null;
        }
        return URL.createObjectURL(file);
    });

    let polygons: Polygon[] = $state([new Polygon()]);
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

    let editingShape: PointAppender = $state(ruler);

    function handleAddPoint(e: MouseEvent) {
        editingShape.addPoint(e.offsetX, e.offsetY);
    }

    function handleClearAll() {
        polygons = [];
        ruler.clear();
    }

    $effect(() => {
        const cnv = new Canvas(canvas, lineColor);
        cnv.clear();

        for (const polygon of polygons) {
            cnv.drawPoints(polygon.points, true);
        }
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
    <div>
        <canvas
            bind:this={canvas}
            onclick={handleAddPoint}
            width="500"
            height="500"
            style="background-image: {canvasImageUrl ? `url(${canvasImageUrl})` : 'none'}"
        ></canvas>
    </div>

    <div class="controls">
        <div class="controls-block">
            <h3>Set background</h3>

            <input type="file" accept="image/*" bind:files={files}>
        </div>

        <div class="controls-block">
            <h3>Ruler</h3>

            <button
                onclick={() => {editingShape = ruler}}
                disabled={editingShape === ruler}
            >
                Set Points
            </button>

            <div class="field">
                <label for="units">Actual ruler length (in units)</label>

                <input id="units" type="number" bind:value={units}>
            </div>
        </div>

        <div class="controls-block">
            <button onclick={() => {polygons.push(new Polygon())}}>Add Polygon</button>

            {#each polygons as polygon, index}
                <div>
                    <h3>Polygon {index + 1}</h3>

                    <button
                        onclick={() => {editingShape = polygon}}
                        disabled={editingShape === polygon}
                    >
                        Set Points
                    </button>

                    <button onclick={() => {polygons.splice(index, 1)}}>Remove</button>

                    <div class="info-row">
                        <p>Area</p>

                        <p>{polygon.area() * scale ** 2}</p>
                    </div>
                </div>
            {/each}
        </div>

        <input type="color" bind:value={lineColor}> {lineColor}

        <button onclick={handleClearAll}>Clear All</button>
    </div>
</main>

<style>
    main {
        padding: 2rem 0;
        display: flex;
        gap: 1.5rem;
    }

    canvas {
        border: 1px solid var(--border);
        background-repeat: no-repeat;
        background-size: contain;
        background-position-y: center;
        background-position-x: center;
    }

    .controls {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .controls-block {
        display: grid;
        gap: 1rem;
    }

    .field {
        display: grid;
        gap: 0.5rem;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
    }
</style>
