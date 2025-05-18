import {describe, expect, test} from "vitest";
import {Polygon} from "./Polygon.svelte";

describe.concurrent("Polygon.area", () => {
    test("given no points", () => {
        const polygon = new Polygon();

        expect(polygon.area()).toBe(0);
    });

    test("given one point", () => {
        const polygon = new Polygon();

        polygon.addPoint(0, 0);

        expect(polygon.area()).toBe(0);
    });

    test("given two points", () => {
        const polygon = new Polygon();

        polygon.addPoint(0, 0);
        polygon.addPoint(1, 1);

        expect(polygon.area()).toBe(0);
    });

    test("points are collinear", () => {
        const polygon = new Polygon();

        polygon.addPoint(0, 0);
        polygon.addPoint(0, 1);
        polygon.addPoint(0, 2);

        expect(polygon.area()).toBe(0);
    });

    test("points form a convex triangle", () => {
        const polygon = new Polygon();

        polygon.addPoint(0, 0);
        polygon.addPoint(2, 0);
        polygon.addPoint(2, 2);

        expect(polygon.area()).toBe(2);
    });

    test("points form a concave polygon", () => {
        const polygon = new Polygon();

        polygon.addPoint(0, 0);
        polygon.addPoint(2, 0);
        polygon.addPoint(1, 1);
        polygon.addPoint(2, 2);
        polygon.addPoint(0, 2);

        expect(polygon.area()).toBe(3);
    });

    test("points have negative coordinates", () => {
        const polygon = new Polygon();

        polygon.addPoint(-1, -1);
        polygon.addPoint(1, -1);
        polygon.addPoint(0, 0);
        polygon.addPoint(1, 1);
        polygon.addPoint(-1, 1);

        expect(polygon.area()).toBe(3);
    });

    test("points have large coordinates", () => {
        const polygon = new Polygon();

        polygon.addPoint(0, 3210);
        polygon.addPoint(12345, 3211);
        polygon.addPoint(12345, 10000);

        expect(polygon.area()).toBe(41905102.5);
    });
});
