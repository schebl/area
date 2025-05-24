export interface Shape {
    draw(ctx: CanvasRenderingContext2D): void;

    handleClick(x: number, y: number): void;
}
