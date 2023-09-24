import { drawTriangle, PINK, width, height } from './canvas.js';

function calcXY(angle, distance) {
    const x = Math.floor(Math.sin(angle) * distance + width / 2);
    const y = Math.floor(Math.cos(angle) * distance + height / 2);
    return [x, y];
}

export class Ship {
    constructor() {
        this.angle = 0;
        this.distance = 50;
    }

    points() {
        return [
            calcXY(this.angle - 0.07, this.distance - 3),
            calcXY(this.angle + 0.07, this.distance - 3),
            calcXY(this.angle, this.distance - 3),
        ];
    }

    draw() {
        const peak = calcXY(this.angle, this.distance - 8);
        const left = calcXY(this.angle - 0.11, this.distance + 1);
        const right = calcXY(this.angle + 0.11, this.distance + 1);
        drawTriangle(peak, left, right, PINK);
    }
}
