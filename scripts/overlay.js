const canvas = document.getElementById('overlay');
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const imageData = ctx.getImageData(0, 0, width, height);
const fade = [0, 0, 0, 43];

function putPixel(x, y, [r, g, b, a]) {
    const index = (x + y * width) * 4;
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

export function line([x0, y0], [x1, y1], color) {
    const dx = Math.abs(x1 - x0);
    const sx = (x0 < x1) ? 1 : -1;
    const dy = Math.abs(y1 - y0);
    const sy = (y0 < y1) ? 1 : -1;
    let err = ((dx > dy) ? dx : -dy) / 2;
    let e2;
    while (true) {
        putPixel(x0, y0, color);
        if (x0 == x1 && y0 == y1) return;
        e2 = err;
        if (e2 > -dx) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dy) {
            err += dx;
            y0 += sy;
        }
    }
}

export function drawOverlay() {
    for (let i = 0; i < width; i += 3) {
        line([i, 0], [i, height], fade);
    }
    for (let i = 0; i < height; i += 3) {
        line([0, i], [width, i], fade);
    }
    ctx.putImageData(imageData, 0, 0);
}
