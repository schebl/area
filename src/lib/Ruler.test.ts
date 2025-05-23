import {describe, expect, it, test} from "vitest";
import {Ruler} from "./Ruler.svelte";

describe.concurrent("Ruler.length", () => {
    test("given no points", () => {
        const ruler = new Ruler();

        expect(ruler.length()).toBe(0);
    });

    test("given one point", () => {
        const ruler = new Ruler();

        ruler.addPoint(0, 0);

        expect(ruler.length()).toBe(0);
    });

    test("given two points", () => {
        const ruler = new Ruler();

        ruler.addPoint(0, 0);
        ruler.addPoint(3, 4);

        expect(ruler.length()).toBe(5);
    });

    describe("more than two points are provided", () => {
        it("uses only the last two points", () => {
            const ruler = new Ruler();

            ruler.addPoint(10000, 10000);
            ruler.addPoint(20000, 20000);
            ruler.addPoint(30000, 30000);
            ruler.addPoint(0, 0);
            ruler.addPoint(3, 4);

            expect(ruler.length()).toBe(5);
        });
    });
});
