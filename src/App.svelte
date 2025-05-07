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

    const rulerPoints: Point[] = $state([]);
    let rulerLength = $derived(getRulerLength(rulerPoints));

    function getRulerLength(ruler: Point[]): number {
        if (ruler.length != 2) {
            return 0;
        }

        return Math.sqrt(
            (ruler[1].x - ruler[0].x) ** 2
            + (ruler[1].y - ruler[0].y) ** 2,
        );
    }

    let units = $state(1);
    let scale = $derived.by(() => {
        if (rulerLength === 0) {
            return 1;
        }
        return units / rulerLength;
    });

    type PointsBuildingMode = "polygon" | "ruler"
    let isBuildingPolygon: PointsBuildingMode = $state("polygon");

    function handleAddPoint(e: MouseEvent) {
        if (isBuildingPolygon === "polygon") {
            polygonPoints.push({
                x: e.offsetX,
                y: e.offsetY,
            });
            return;
        }
        if (isBuildingPolygon === "ruler") {
            rulerPoints.push({
                x: e.offsetX,
                y: e.offsetY,
            });

            if (rulerPoints.length > 2) {
                rulerPoints.shift();
            }
        }
    }

    $effect(() => {
        const cnv = new Canvas(canvas);
        cnv.clear();

        cnv.drawPoints(polygonPoints, true);
        cnv.drawPoints(rulerPoints, false);
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

    <div>
        <div>
            Units: <input type="number" bind:value={units}>
        </div>

        <div>
            <p>Ruler Length: {rulerLength}</p>

            <p>Scale: {scale}</p>

            <p>Polygon Area: {polygonArea}</p>

            <p>Polygon Area (scaled): {polygonArea * scale ** 2}</p>
        </div>
    </div>

    <div>
        <h3>Building Mode</h3>

        <button
            onclick={() => {isBuildingPolygon = "polygon"}}
            disabled={isBuildingPolygon === "polygon"}
        >
            Polygon
        </button>

        <button
            onclick={() => {isBuildingPolygon = "ruler"}}
            disabled={isBuildingPolygon === "ruler"}
        >
            Ruler
        </button>
    </div>
</main>
