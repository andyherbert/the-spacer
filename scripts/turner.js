export class Turner {
    constructor() {
        this.x = 0.0;
        this.speed = 0.008;
        this.height = 0.2;
    }

    turn() {
        const sin = Math.sin(this.x);
        this.x += this.speed;
        if (this.height < Math.PI) {
            this.height += 0.0003;
        }
        if (this.speed < 0.04) {
            this.speed += 0.000003;
        }
        return sin * this.height;
    }
}
