export interface Shape {
    area(): number;

    draw(ctx: CanvasRenderingContext2D): void;

    handleClick(x: number, y: number): void;
}

export class ShapeManager {
    private shapes: Shape[];

    constructor(shapes: Shape[] = []) {
        this.shapes = $state(shapes);
    }

    public all(): Shape[] {
        return this.shapes;
    }

    public clear() {
        this.shapes = [];
    }

    public add(shape: Shape) {
        this.shapes.push(shape);
    }

    public remove(index: number) {
        this.shapes.splice(index, 1);
    }

    public area(): number {
        let total = 0;
        for (const shape of this.shapes) {
            total += shape.area();
        }
        return total;
    }
}
