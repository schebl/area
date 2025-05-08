import type {Point} from "./Point";

export class Ruler {
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