import type {Point} from "./Point";

export class Polygon {
    public points = $state<Point[]>([]);

    public addPoint(x: number, y: number) {
        this.points.push({
            x: x,
            y: y,
        });
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