import type {Point} from "./Point";
import type {Shape} from "./Canvas";

export class Polygon implements Shape {
    public points = $state<Point[]>([]);

    public addPoint(x: number, y: number) {
        this.points.push({
            x: x,
            y: y,
        });
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        for (let i = 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    handleClick(x: number, y: number): void {
        this.addPoint(x, y);
    }

    public clear() {
        this.points = [];
    }

    public area(): number {
        let area = 0;
        for (let i = 0; i < this.points.length; i++) {
            const {x: x1, y: y1} = this.points[i];
            const {x: x2, y: y2} = this.points[(i + 1) % this.points.length];

            area += x1 * y2 - x2 * y1;
        }
        return Math.abs(area) / 2;
    }
}