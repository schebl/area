<script lang="ts">
    import {onDestroy} from "svelte";
    import type {Attachment} from "svelte/attachments";
    import {type Shape, ShapeManager} from "./lib/Shape.svelte";
    import {Ruler} from "./lib/Ruler.svelte";
    import {Polygon} from "./lib/Polygon.svelte";
    import {Circle} from "./lib/Circle.svelte";

    let ruler = new Ruler();
    let shapes = new ShapeManager([new Polygon()]);

    let editingShape: Shape = $state(ruler);

    function handleClearAll() {
        ruler.clear();
        shapes.clear();
    }

    let lineColor = $state("#ff4500");

    function canvasAttachment(): Attachment {
        return (element) => {
            const canvas = element as HTMLCanvasElement;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("unable to get context from canvas");
            }

            function handleClick(e: MouseEvent) {
                editingShape.handleClick(e.offsetX, e.offsetY);
            }

            canvas.addEventListener("click", handleClick);

            $effect(() => {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.strokeStyle = lineColor;

                ruler.draw(ctx);
                for (const shape of shapes.all()) {
                    shape.draw(ctx);
                }
            });

            return () => {
                canvas.removeEventListener("click", handleClick);
            };
        };
    }

    let units = $state(1);
    let scale = $derived.by(() => {
        if (ruler.length() === 0) {
            return 1;
        }
        return units / ruler.length();
    });
    let totalArea = $derived(shapes.area() * scale ** 2);

    let files = $state<FileList | null>(null);
    let canvasImageUrl = $derived.by(() => {
        const file = files?.[0] ?? null;
        if (!file) {
            return null;
        }
        return URL.createObjectURL(file);
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
                <h3>Shapes</h3>

                <button onclick={() => {shapes.add(new Polygon())}}>Add Polygon</button>

                <button onclick={() => {shapes.add(new Circle({x: 250, y: 250}))}}>Add Circle</button>
            </div>

            {#each shapes.all() as shape, index}
                <div class="shape">
                    <div class="shape-main">
                        <button
                            onclick={() => {editingShape = shape}}
                            disabled={editingShape === shape}
                        >
                            Select
                        </button>

                        <p>Shape {index + 1}</p>

                        <button onclick={() => {shapes.remove(index)}}>Remove</button>
                    </div>

                    {#if shape instanceof Circle}
                        <div class="info-row">
                            <p>Radius</p>

                            <input type="number" min="0" bind:value={shape.radius} style="width: 10ch">
                        </div>
                    {/if}

                    <div class="info-row">
                        <p>Area</p>

                        <p>{shape.area() * scale ** 2}</p>
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

    .shape {
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        display: grid;
        gap: 0.5rem;
    }

    .shape-main {
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
