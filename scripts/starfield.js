import { width, height, putPixel, BRIGHT, HALF_BRIGHT } from './canvas.js';

class Star {
    constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = 40 + (Math.random() * height) / 2;
        this.speed = Math.random() * 0.008;
        if (Math.random() < 0.5) {
            this.color = HALF_BRIGHT;
        } else {
            this.color = BRIGHT;
        }
    }

    tic() {
        this.distance *= 1 + this.speed;
    }

    ticSlow() {
        this.distance *= 1 + this.speed / 15;
    }

    draw(angle) {
        const x = Math.round(
            Math.cos(this.angle + angle) * this.distance + width / 2
        );
        const y = Math.round(
            Math.sin(this.angle + angle) * this.distance + height / 2
        );
        if (x < -50 || x >= width + 50 || y < -50 || y >= height + 50)
            return false;
        putPixel(x, y, this.color);
        return true;
    }
}

export class Starfield {
    constructor() {
        this.angle = 0;
        this.stars = [];
        for (let i = 0; i < 100; i += 1) {
            this.stars.push(new Star());
        }
    }

    rotate(angle) {
        for (const star of this.stars) {
            star.angle += angle;
        }
    }

    tic() {
        for (const star of this.stars) {
            star.tic();
        }
    }

    ticSlow() {
        for (const star of this.stars) {
            star.ticSlow();
        }
    }

    draw() {
        for (const star of this.stars) {
            if (!star.draw(this.angle)) {
                star.distance = 10 + (Math.random() * height) / 2;
            }
        }
    }

    drawWithAngle(angle) {
        this.angle = angle;
        this.draw();
    }
}
