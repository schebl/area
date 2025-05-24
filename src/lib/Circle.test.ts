import {describe, expect, test} from "vitest";
import {Circle} from "./Circle.svelte";

describe.concurrent("Circle.area", () => {
    test("radius is zero", () => {
        const circle = new Circle({x: 50, y: 20}, 0);

        expect(circle.area()).toBe(0);
    });

    test("radius is positive integer", () => {
        const circle = new Circle({x: 10, y: 15}, 1);

        expect(circle.area()).toBe(Math.PI);
    });

    test("radius is positive float", () => {
        const circle = new Circle({x: 800, y: 0}, 1.5);

        expect(circle.area()).toBe(2.25 * Math.PI);
    });

    test("radius is large", () => {
        const circle = new Circle({x: 100, y: 10}, 10000);

        expect(circle.area()).toBe(100000000 * Math.PI);
    });

    test("radius is negative", () => {
        const circle = new Circle({x: 0, y: 0}, -2);

        expect(() => circle.area()).toThrow(RangeError);
    });
});
