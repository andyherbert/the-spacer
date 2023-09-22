import { drawPinkText, width, height } from './canvas.js';

export function frameToTimeString(frames) {
    const totalMillis = frames * (1000.0 / 60.0);
    const subSeconds = Math.floor(totalMillis % 1000 / 10.0);
    const totalSeconds = Math.floor(totalMillis / 1000);
    const seconds = Math.floor(totalSeconds) % 60;
    const minutes = Math.floor(totalSeconds / 60.0);
    return `${minutes}'${seconds.toString(10).padStart(2, "0")}"${subSeconds.toString(10).padStart(2, "0")}`;
}

export class Timer {
    constructor() {
        this.startFrames = 0;
        this.frames = 0;
        this.x = (width - (7 * 8)) / 2;
        this.y = (height - 8) / 2 + 32;
        this.start = false;
    }

    tick() {
        if (this.startFrames < 180) {
            this.startFrames += 1;
        } else {
            this.frames += 1;
        }
        if (this.y > 1 && this.startFrames > 80) {
            this.y -= 1;
        }
    }

    draw() {
        const string = frameToTimeString(this.frames);
        const x = (width - (string.length * 8)) / 2;
        drawPinkText(string, x, this.y);
    }
}
