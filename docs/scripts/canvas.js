export const HALF_BRIGHT = [184, 165, 167];
export const BRIGHT = [245, 238, 230];
export const PINK = [158, 95, 118];
export const BLACK = [41, 22, 33];

const canvas = document.getElementById('viewport');
export const width = canvas.width;
export const height = canvas.height;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const imageData = ctx.getImageData(0, 0, width, height);
const font = await loadImage('../images/font.png');
const bootRing = await loadImage('../images/boot_ring.png');
const brightFont = recolorCanvas(font, BRIGHT);
const halfBrightFont = recolorCanvas(font, HALF_BRIGHT);
const pinkFont = recolorCanvas(font, PINK);

export function drawText(ctx, font, text, x, y) {
    let px = x;
    let py = y;
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const charCode = char.charCodeAt(0);
        let charX = 40;
        if (charCode >= 48 && charCode <= 57) {
            charX = charCode - 48;
        } else if (charCode >= 65 && charCode <= 90) {
            charX = charCode - 65 + 10;
        } else if (charCode == 39) {
            charX = 10 + 26;
        } else if (charCode == 34) {
            charX = 10 + 26 + 1;
        } else if (charCode == 46) {
            charX = 10 + 26 + 2;
        } else if (charCode == 58) {
            charX = 10 + 26 + 3;
        } else if (charCode == 10) {
            px = x;
            py += 8;
            continue;
        }
        ctx.drawImage(font, charX * 8, 0, 8, 8, px, py, 8, 8);
        px += 8;
    }
}

export function fillRect(x, y, w, h, [r, g, b]) {
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, w, h);
}

export function drawBrightText(text, x, y) {
    drawText(ctx, brightFont, text, x, y);
}

export function drawHalfBrightText(text, x, y) {
    drawText(ctx, halfBrightFont, text, x, y);
}

export function drawPinkText(text, x, y) {
    drawText(ctx, pinkFont, text, x, y);
}

function recolorCanvas(src, [r, g, b]) {
    const canvas = document.createElement('canvas');
    canvas.width = src.width;
    canvas.height = src.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(src, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3]) {
            imageData.data[i] = r;
            imageData.data[i + 1] = g;
            imageData.data[i + 2] = b;
        }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

async function loadImage(src) {
    const image = await new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = src;
    });
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    return canvas;
}

export function rotate([x, y], angle) {
    const cx = width / 2;
    const cy = height / 2;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const px = x - cx;
    const py = y - cy;
    return [
        Math.round(px * c - py * s + cx),
        Math.round(px * s + py * c + cy)
    ];
}

export function putPixel(x, y, [r, g, b]) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const index = (x + y * imageData.width) * 4;
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = 255;
}

export function clear([r, g, b] = BLACK) {
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = 255;
    }
}

export function copyBuffer() {
    ctx.putImageData(imageData, 0, 0);
}

export async function nextFrame(frames = 1) {
    for (let i = 0; i < frames; i += 1) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}

function horizontalLine(x0, x1, y, [r, g, b]) {
    if (y < 0 || y >= height) return;
    if (x0 > x1) {
        [x0, x1] = [x1, x0];
    }
    let index = (x0 + y * imageData.width) * 4;
    for (let x = x0; x <= x1; x += 1, index += 4) {
        if (x >= width) return;
        if (x < 0) continue;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
    }
}

function fillBottomFlatTriangle(v1, v2, v3, color) {
    const invslope1 = (v2[0] - v1[0]) / (v2[1] - v1[1]);
    const invslope2 = (v3[0] - v1[0]) / (v3[1] - v1[1]);
    let curx1 = v1[0];
    let curx2 = v1[0];
    for (let scanlineY = v1[1]; scanlineY <= v2[1]; scanlineY += 1) {
        horizontalLine(Math.round(curx1), Math.round(curx2), scanlineY, color);
        curx1 += invslope1;
        curx2 += invslope2;
    }
}

function fillTopFlatTriangle(v1, v2, v3, color) {
    const invslope1 = (v3[0] - v1[0]) / (v3[1] - v1[1]);
    const invslope2 = (v3[0] - v2[0]) / (v3[1] - v2[1]);
    let curx1 = v3[0];
    let curx2 = v3[0];
    for (let scanlineY = v3[1]; scanlineY > v1[1]; scanlineY--) {
        horizontalLine(Math.round(curx1), Math.round(curx2), scanlineY, color);
        curx1 -= invslope1;
        curx2 -= invslope2;
    }
}

export function drawTriangle(v1, v2, v3, color) {
    const vertices = [v1, v2, v3].sort((a, b) => a[1] - b[1]);
    const v4 = [vertices[0][0] + (vertices[1][1] - vertices[0][1]) * (vertices[2][0] - vertices[0][0]) / (vertices[2][1] - vertices[0][1]), vertices[1][1]];
    fillBottomFlatTriangle(vertices[0], vertices[1], v4, color);
    fillTopFlatTriangle(vertices[1], v4, vertices[2], color);
}

export function drawQuad(v1, v2, v3, v4, color) {
    drawTriangle(v1, v2, v3, color);
    drawTriangle(v1, v3, v4, color);
}

function pointInBottomFlatTriangle([x1, y1], [x2, y2], v1, v2, v3) {
    const invslope1 = (v2[0] - v1[0]) / (v2[1] - v1[1]);
    const invslope2 = (v3[0] - v1[0]) / (v3[1] - v1[1]);
    let curx1 = v1[0];
    let curx2 = v1[0];
    for (let scanlineY = v1[1]; scanlineY <= v2[1]; scanlineY += 1) {
        if (scanlineY == y1 && x1 >= Math.round(curx1) && x1 <= Math.round(curx2)) return true;
        if (scanlineY == y2 && x2 >= Math.round(curx1) && x2 <= Math.round(curx2)) return true;
        curx1 += invslope1;
        curx2 += invslope2;
    }
    return false;
}

function pointInTopFlatTriangle([x1, y1], [x2, y2], v1, v2, v3) {
    const invslope1 = (v3[0] - v1[0]) / (v3[1] - v1[1]);
    const invslope2 = (v3[0] - v2[0]) / (v3[1] - v2[1]);
    let curx1 = v3[0];
    let curx2 = v3[0];
    for (let scanlineY = v3[1]; scanlineY > v1[1]; scanlineY--) {
        if (scanlineY == y1 && x1 >= Math.round(curx1) && x1 <= Math.round(curx2)) return true;
        if (scanlineY == y2 && x2 >= Math.round(curx1) && x2 <= Math.round(curx2)) return true;
        curx1 -= invslope1;
        curx2 -= invslope2;
    }
    return false;
}

export function pointsInTriangle(p1, p2, v1, v2, v3) {
    const vertices = [v1, v2, v3].sort((a, b) => a[1] - b[1]);
    const v4 = [vertices[0][0] + (vertices[1][1] - vertices[0][1]) * (vertices[2][0] - vertices[0][0]) / (vertices[2][1] - vertices[0][1]), vertices[1][1]];
    return pointInBottomFlatTriangle(p1, p2, vertices[0], vertices[1], v4) ||
        pointInTopFlatTriangle(p1, p2, vertices[1], v4, vertices[2]);
}

export function pointInQuad(p1, p2, v1, v2, v3, v4) {
    return pointsInTriangle(p1, p2, v1, v2, v3) ||
        pointsInTriangle(p1, p2, v1, v3, v4);
}

export function drawBootRing(x, y) {
    ctx.drawImage(bootRing, x, y);
}