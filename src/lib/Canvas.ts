export interface Shape {
    draw(ctx: CanvasRenderingContext2D): void;

    handleClick(x: number, y: number): void;
}

export class Canvas {
    private readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, color: string) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("unable to get context from canvas");
        }
        this.ctx = ctx;

        this.ctx.strokeStyle = color;
    }

    public drawShape(shape: Shape) {
        shape.draw(this.ctx);
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}