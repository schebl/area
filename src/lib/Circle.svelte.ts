import type {Point} from "./Point";
import type {Shape} from "./Shape.svelte";

export class Circle implements Shape {
    private center: Point;
    public radius: number;

    constructor(center: Point, radius: number = 100) {
        this.center = $state(center);
        this.radius = radius;
    }

    public setCenter(x: number, y: number) {
        this.center = {
            x: x,
            y: y,
        };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    handleClick(x: number, y: number): void {
        this.setCenter(x, y);
    }

    public area(): number {
        if (this.radius < 0) {
            throw new RangeError("radius cannot be negative");
        }

        return Math.PI * this.radius ** 2;
    }
}