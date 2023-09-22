import { putPixel, PINK, width, height } from "./canvas.js";

class PieceOfShip {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 10;
        this.speed = 0.05 + Math.random() * 0.2;
    }

    draw() {
        const x = Math.round(Math.cos(this.angle) * this.distance + this.x);
        const y = Math.round(Math.sin(this.angle) * this.distance + this.y);
        if (x < 0 || x >= width || y < 0 || y >= height) return;
        putPixel(x, y, PINK);
        this.distance += this.speed;
    }
}

class PieceOfRing {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 20;
        this.speed = 0.4 + Math.random() * 0.2;
    }

    draw() {
        const x = Math.round(Math.cos(this.angle) * this.distance + this.x);
        const y = Math.round(Math.sin(this.angle) * this.distance + this.y);
        if (x < 0 || x >= width || y < 0 || y >= height) return;
        putPixel(x, y, PINK);
        this.distance += this.speed;
    }
}

export class Explosion {
    constructor([x, y]) {
        this.pieces = [];
        this.ring = [];
        for (let i = 0; i < 200; i += 1) {
            this.pieces.push(new PieceOfShip(x, y));
        }
        for (let i = 0; i < 500; i += 1) {
            this.ring.push(new PieceOfRing(x, y));
        }
        this.x = x;
        this.y = y;
    }

    draw() {
        for (const piece of this.pieces) {
            piece.draw();
        }
        for (const piece of this.ring) {
            piece.draw();
        }
    }
}