import type {Point} from "./Point";

export class Canvas {
    private readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("unable to get context from canvas");
        }
        this.ctx = ctx;

        this.ctx.strokeStyle = "#535bf2";
    }

    public drawPoints(points: Point[], closePath: boolean) {
        this.ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }

        if (closePath) {
            this.ctx.closePath();
        }

        this.ctx.stroke();
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}