export const keys = {
    left: false,
    keyA: false,
    right: false,
    keyD: false,
    enter: false,
};

let gamepadIndex = undefined;

export function gamepadStart() {
    const gamepad = navigator.getGamepads()[gamepadIndex];
    return gamepad?.buttons[9]?.pressed;
}

export function gamepadLeft() {
    const gamepad = navigator.getGamepads()[gamepadIndex];
    return gamepad?.buttons[14]?.pressed || gamepad?.axes[0] < -0.25;
}

export function gamepadRight() {
    const gamepad = navigator.getGamepads()[gamepadIndex];
    return gamepad?.buttons[15]?.pressed || gamepad?.axes[0] > 0.25;
}

window.addEventListener('gamepadconnected', (event) => {
    gamepadIndex = event.gamepad.index;
});

document.addEventListener('keydown', (event) => {
    if (event.code == 'ArrowLeft') {
        keys.left = true;
        event.preventDefault();
    }
    if (event.code == 'KeyA') {
        keys.keyA = true;
        event.preventDefault();
    }
    if (event.code == 'ArrowRight') {
        keys.right = true;
        event.preventDefault();
    }
    if (event.code == 'KeyD') {
        keys.keyD = true;
        event.preventDefault();
    }
    if (event.code == 'Enter') {
        keys.enter = true;
        event.preventDefault();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code == 'ArrowLeft') {
        keys.left = false;
        event.preventDefault();
    }
    if (event.code == 'KeyA') {
        keys.keyA = false;
        event.preventDefault();
    }
    if (event.code == 'ArrowRight') {
        keys.right = false;
        event.preventDefault();
    }
    if (event.code == 'KeyD') {
        keys.keyD = false;
        event.preventDefault();
    }
    if (event.code == 'Enter') {
        keys.enter = false;
        event.preventDefault();
    }
});