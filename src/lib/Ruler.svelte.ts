import type {Point} from "./Point";
import type {Shape} from "./Shape";

export class Ruler implements Shape {
    public points = $state<Point[]>([]);

    public addPoint(x: number, y: number) {
        this.points.push({
            x: x,
            y: y,
        });

        if (this.points.length > 2) {
            this.points.shift();
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        for (let i = 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
    }

    handleClick(x: number, y: number): void {
        this.addPoint(x, y);
    }

    public clear() {
        this.points = [];
    }

    public length(): number {
        if (this.points.length != 2) {
            return 0;
        }

        return Math.hypot(
            this.points[1].x - this.points[0].x,
            this.points[1].y - this.points[0].y,
        );
    }
}