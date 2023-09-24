import {
    rotate,
    drawQuad,
    width,
    height,
    drawTriangle,
    HALF_BRIGHT,
    BRIGHT,
    pointInQuad,
} from './canvas.js';
import { easyGaps, hardGaps, medGaps } from './gaps.js';

const fullGap = '88888888';

let color = HALF_BRIGHT;

function stringToBoolArray(str, shift = 0) {
    const boolGaps = str.split('').map((c) => c != ' ');
    for (let i = 0; i < shift; i += 1) {
        boolGaps.unshift(boolGaps.pop());
    }
    return boolGaps;
}

function randomGap(gaps, runUp) {
    const newGaps = [];
    const chosen = gaps[Math.floor(Math.random() * gaps.length)];
    const repeat = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < repeat; i += 1) {
        for (let j = 0; j < runUp; j += 1) {
            newGaps.push(stringToBoolArray(fullGap));
        }
        const shift = Math.floor(Math.random() * 8);
        const reverse = Math.random() < 0.5;
        for (const string of chosen) {
            let boolArray = stringToBoolArray(string, shift);
            if (reverse) {
                boolArray = boolArray.reverse();
            }
            newGaps.push(boolArray);
        }
    }
    return newGaps;
}

class GapGenerator {
    constructor() {
        this.counter = 0;
        this.angle = 0;
    }

    generate() {
        this.counter += 1;
        if (this.counter < 8) {
            return randomGap(easyGaps, 4);
        } else if (this.counter < 16) {
            const dice = Math.random();
            if (dice < 0.7) {
                return randomGap(medGaps, 4);
            } else {
                return randomGap(easyGaps, 4);
            }
        } else {
            const dice = Math.random();
            if (dice < 0.7) {
                return randomGap(hardGaps, 3);
            } else if (dice < 0.9) {
                return randomGap(medGaps, 3);
            } else {
                return randomGap(easyGaps, 3);
            }
        }
    }
}

class Shape {
    constructor(length, radius, gaps) {
        this.length = length;
        this.radius = radius;
        this.gaps = gaps;
        this.color = color;
        if (color === HALF_BRIGHT) {
            color = BRIGHT;
        } else {
            color = HALF_BRIGHT;
        }
    }

    scale(scale) {
        this.radius *= scale;
    }

    generatePoints(angle) {
        const points = [];
        for (let i = 0; i < this.length; i += 1) {
            const shapeAngle = (i * Math.PI) / (this.length / 2);
            points.push(
                rotate(
                    [width / 2 + this.radius, height / 2],
                    angle + shapeAngle
                )
            );
        }
        return points;
    }
}

export class Tunnel {
    constructor(length) {
        this.length = length;
        this.counter = 0;
        this.gapGenerator = new GapGenerator();
        this.gapQueue = this.gapGenerator.generate();
        this.shapes = [];
        this.shapes.push(new Shape(this.length, 0.5, this.gapQueue.shift()));
    }

    scale(scale) {
        if (this.counter == 12) {
            this.counter = 0;
            if (this.gapQueue.length == 0) {
                this.gapQueue = this.gapGenerator.generate();
            }
            this.shapes.unshift(
                new Shape(this.length, 0.5, this.gapQueue.shift())
            );
        } else {
            this.counter += 1;
        }
        const lastShape = this.shapes[this.shapes.length - 1];
        if (lastShape.radius > 180) {
            this.shapes.pop();
        }
        for (const shape of this.shapes) {
            shape.scale(scale);
        }
    }

    draw(p1, p2) {
        let collision = false;
        const points = this.shapes.map((shape) =>
            shape.generatePoints(this.angle)
        );
        for (let i = 0; i < points[0].length - 1; i += 1) {
            drawTriangle(
                points[0][i],
                points[0][(i + 1) % points[0].length],
                [width / 2, height / 2],
                this.shapes[0].color
            );
        }
        for (let i = 1; i < points.length; i += 1) {
            const currentPoints = points[i];
            const nextPoints = points[i - 1];
            let color = this.shapes[i].color;
            for (let j = 0; j <= currentPoints.length - 1; j += 1) {
                if (!this.shapes[i].gaps[j]) {
                    if (
                        p1 != undefined &&
                        p2 != undefined &&
                        pointInQuad(
                            p1,
                            p2,
                            currentPoints[j],
                            currentPoints[(j + 1) % currentPoints.length],
                            nextPoints[(j + 1) % nextPoints.length],
                            nextPoints[j]
                        )
                    ) {
                        collision = true;
                    }
                    continue;
                }
                drawQuad(
                    currentPoints[j],
                    currentPoints[(j + 1) % nextPoints.length],
                    nextPoints[(j + 1) % nextPoints.length],
                    nextPoints[j],
                    color
                );
            }
        }
        return collision;
    }
}
