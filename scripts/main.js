import { keys, gamepadStart, gamepadLeft, gamepadRight } from './keys.js';
import { clear, copyBuffer, nextFrame, drawPinkText, drawBrightText, drawHalfBrightText, BRIGHT, width, height, PINK, HALF_BRIGHT, fillRect, BLACK, drawBootRing } from './canvas.js';
import { Tunnel } from './tunnel.js';
import { Starfield } from './starfield.js';
import { Timer, frameToTimeString } from './timer.js';
import { Turner } from './turner.js';
import { Ship } from './ship.js';
import { Explosion } from './explosion.js';
import { introMusic, inGameMusic, explosionSfx, startSfx, bootSfx, pauseSfx } from './audio.js';

async function startScreen(starfield, highScore, started = false) {
    let startTimer = 0;
    let pressStartTimer = 0;
    let yCount = 8;
    while (true) {
        clear();
        starfield.ticSlow();
        starfield.draw();
        copyBuffer();
        if (highScore > 0) {
            drawPinkText(`BEST:${frameToTimeString(highScore)}`, 8 * 4, 8);
        }
        if ((keys.enter || gamepadStart()) && !started) {
            started = true;
            startTimer = 0;
            introMusic.pause();
            introMusic.currentTime = 0;
            startSfx.play();
        }
        if (started) {
            yCount = 0;
            if (startTimer == 60) {
                return true;
            }
        } else if (startTimer == 60 * 55) {
            return false;
        }
        const x = (width - 10 * 8) / 2;
        const y = (height - 8) / 2 - 16;
        drawPinkText("THE SPACER", x, y + 1 + yCount);
        drawBrightText("THE SPACER", x, y + yCount);
        if (yCount > 0) {
            if (startTimer % 13 == 12) {
                yCount -= 1;
            }
            fillRect(x, y + 1 + yCount + (8 - yCount), 10 * 8, yCount, BLACK);
        }
        if (started || startTimer > 60 * 2.5) {
            drawHalfBrightText("CODE:ANDYH", 5 * 8, 11 * 8);
            drawHalfBrightText("MUSIC:GENTHRU", 4 * 8, 12 * 8);
        }
        if (started || startTimer > 60 * 3.5) {
            if ((started && (pressStartTimer % 4) < 2) || (!started && (pressStartTimer % 60) < 30)) {
                drawBrightText("PRESS START", (width - 11 * 8) / 2, (height + 8 * 14) / 2);
            }
            pressStartTimer += 1;
        }
        await nextFrame();
        startTimer += 1;
    }
}

async function titleScreen(starfield, highScore) {
    const introText = "IT IS 202X.\n\nA MYSTERIOUS PILOT\nMUST TRAVEL OVER\nINFINITE SPACE\nFOR UNSPECIFIED\nREASONS.\n\nTHEY CALL HIM...";
    let introTextTimer = 0;
    introMusic.play();
    while (true) {
        if (keys.enter || gamepadStart()) {
            introMusic.pause();
            introMusic.currentTime = 0;
            startSfx.play();
            await startScreen(starfield, highScore, true);
            return;
        }
        clear();
        starfield.ticSlow();
        starfield.draw();
        copyBuffer();
        if (introTextTimer < 14 * 8 * 2) {
            drawBrightText(introText, 8, height - (introTextTimer / 2), 8);
        } else if (introTextTimer < 14 * 8 * 4 + 2 * 60) {
            drawBrightText(introText, 8, height - 14 * 8, 8);
        } else if (introTextTimer < 14 * 8 * 4 + 15 * 60) {
            if (await startScreen(starfield, highScore)) {
                return;
            } else {
                introTextTimer = 0;
                introMusic.currentTime = 0;
                introMusic.play();
            }
        }
        if (highScore > 0) {
            drawPinkText(`BEST:${frameToTimeString(highScore)}`, 8 * 4, 8);
        }
        await nextFrame();
        introTextTimer += 1;
    }
}

async function gameOverScreen(tunnel, starfield, timer, p3) {
    let gameOverTimer = 0;
    let explosion = new Explosion(p3);
    clear(BRIGHT);
    copyBuffer();
    await nextFrame(3);
    clear(PINK);
    copyBuffer(2);
    await nextFrame();
    clear(HALF_BRIGHT);
    copyBuffer();
    await nextFrame();
    explosionSfx.play();
    while (gameOverTimer < 60 * 10) {
        clear();
        tunnel.scale(1 + 0.03 / 15);
        starfield.ticSlow();
        starfield.draw();
        tunnel.draw();
        explosion.draw();
        copyBuffer();
        timer.draw();
        drawPinkText("GAME OVER", 44, 68);
        if (keys.enter || gamepadStart()) {
            explosionSfx.pause();
            explosionSfx.currentTime = 0;
            startSfx.play();
            if (gameOverTimer < 60 * 9) {
                gameOverTimer = 60 * 9;
            }
        }
        await nextFrame();
        gameOverTimer += 1;
    }
}

async function inGame(starfield) {
    let tunnel = new Tunnel(8);
    let timer = new Timer();
    let turner = new Turner();
    let ship = new Ship();
    let controlAngle = 0;
    let gameOver = false;
    let pause = false;
    inGameMusic.play();
    while (true) {
        clear();
        if (keys.enter) {
            if (!pause) {
                inGameMusic.pause();
                pauseSfx.play();
            } else {
                inGameMusic.play();
            }
            pause = !pause;
            while (keys.enter) {
                await nextFrame();
            }
        } else if (gamepadStart()) {
            if (!pause) {
                inGameMusic.pause();
                pauseSfx.play();
            } else {
                inGameMusic.play();
            }
            pause = !pause;
            while (gamepadStart()) {
                await nextFrame();
            }
        }
        if (!pause) {
            const angle = turner.turn();
            starfield.tic();
            starfield.drawWithAngle((controlAngle + angle) / 4);
            tunnel.scale(1.03);
            let [p1, p2, p3] = ship.points();
            tunnel.angle = controlAngle + angle;
            if (!gameOver) {
                ship.angle = -angle;
                if (keys.left || keys.keyA || gamepadLeft()) {
                    controlAngle -= 0.069;
                }
                if (keys.right || keys.keyD || gamepadRight()) {
                    controlAngle += 0.069;
                }
                tunnel.angle = controlAngle + angle;
                gameOver = tunnel.draw(p1, p2);
                timer.tick();
                ship.draw();
            } else {
                inGameMusic.pause();
                inGameMusic.currentTime = 0;
                await gameOverScreen(tunnel, starfield, timer, p3);
                return timer.frames;
            }
        } else {
            starfield.draw();
            tunnel.draw();
            ship.draw();
        }
        copyBuffer();
        timer.draw();
        await nextFrame();
    }
}

async function boot() {
    let y = -24;
    let bootTimer = 0;
    while (bootTimer < 60 * 6) {
        clear();
        if (y < (height - 8) / 2 && bootTimer % 2) {
            y += 1;
        }
        if (bootTimer == 184) {
            bootSfx.play();
        }
        copyBuffer();
        drawBootRing((width - 10 * 8) / 2, y -8);
        drawPinkText("GBJAM 11", (width - 8 * 8) / 2, y);
        await nextFrame();
        bootTimer += 1;
    }
}

export async function main() {
    await boot();
    let starfield = new Starfield();
    let highScore = 0;
    while (true) {
        await titleScreen(starfield, highScore);
        const score = await inGame(starfield);
        if (score > highScore) {
            highScore = score;
        }
    }
}
