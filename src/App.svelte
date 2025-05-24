<script lang="ts">
    import {onDestroy} from "svelte";
    import {Polygon} from "./lib/Polygon.svelte";
    import {Ruler} from "./lib/Ruler.svelte";
    import type {Attachment} from "svelte/attachments";
    import type {Shape} from "./lib/Shape";

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
    let totalArea = $derived.by(() => {
        let total = 0;
        for (const polygon of polygons) {
            total += polygon.area();
        }
        return total * scale ** 2;
    });
    let editingShape: Shape = $state(ruler);

    function handleClearAll() {
        polygons = [];
        ruler.clear();
    }

    function canvasAttachment(): Attachment {
        return (element) => {
            const canvas = element as HTMLCanvasElement;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("unable to get context from canvas");
            }
            clear(ctx);

            ctx.strokeStyle = lineColor;

            for (const polygon of polygons) {
                drawShape(polygon, ctx);
            }
            drawShape(ruler, ctx);

            function handleClick(e: MouseEvent) {
                editingShape.handleClick(e.offsetX, e.offsetY);
            }

            canvas.addEventListener("click", handleClick);

            return () => {
                canvas.removeEventListener("click", handleClick);
            };
        };
    }

    function drawShape(shape: Shape, ctx: CanvasRenderingContext2D) {
        shape.draw(ctx);
    }

    function clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

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
            {@attach canvasAttachment()}
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
            <div class="controls-block-header">
                <h3>Polygons</h3>

                <button onclick={() => {polygons.push(new Polygon())}}>Add</button>
            </div>

            {#each polygons as polygon, index}
                <div class="polygon">
                    <div class="polygon-main">
                        <button
                            onclick={() => {editingShape = polygon}}
                            disabled={editingShape === polygon}
                        >
                            Set Points
                        </button>

                        <p>Polygon {index + 1}</p>

                        <button onclick={() => {polygons.splice(index, 1)}}>Remove</button>
                    </div>

                    <div class="info-row">
                        <p>Area</p>

                        <p>{polygon.area() * scale ** 2}</p>
                    </div>
                </div>
            {/each}

            <div class="info-row">
                <p>Total Area</p>

                <p>{totalArea}</p>
            </div>
        </div>

        <input type="color" bind:value={lineColor}>

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

    .controls-block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .polygon {
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        display: grid;
        gap: 0.5rem;
    }

    .polygon-main {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
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
