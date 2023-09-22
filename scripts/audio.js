async function loadAudio(url) {
    const audio = document.createElement('audio');
    audio.src = url;
    audio.preload = 'auto';
    return new Promise(resolve => {
        audio.addEventListener('canplay', () => resolve(audio));
    });
}

async function loadLoopedAudio(url) {
    const audio = await loadAudio(url);
    audio.loop = true;
    return audio;
}

export const bootSfx = await loadAudio('../audio/boot.wav');
export const explosionSfx = await loadAudio('../audio/explosion.wav');
export const startSfx = await loadAudio('../audio/startsound.wav');
export const introMusic = await loadAudio('../audio/intro.mp3');
export const inGameMusic = await loadLoopedAudio('../audio/ingame.mp3');
export const pauseSfx = await loadAudio('../audio/pause.wav');
