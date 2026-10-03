const appMusicVolume = 0.16;
const modeMusicVolume = 0.22;
const soundEffectVolume = 0.5;

const musicTracks = {
    app: new Audio('/assets/sonidos/music/musicApp.mp3'),
    campista: new Audio('/assets/sonidos/music/musicCampista.mp3'),
    as: new Audio('/assets/sonidos/music/musicAs.mp3'),
    campeon: new Audio('/assets/sonidos/music/musicCampeon.mp3'),
};

const winSound = new Audio('/assets/sonidos/efectoSound/win.mp3');
const loseSound = new Audio('/assets/sonidos/efectoSound/lose.mp3');
const touchSound = new Audio('/assets/sonidos/efectoSound/touchButtom.mp3');
const difficultyTracks = {
    facil: musicTracks.campista,
    normal: musicTracks.as,
    dificil: musicTracks.campeon,
};

let currentMusic = null;

for (const track of Object.values(musicTracks)) {
    track.loop = true;
}

function playAudio(audio, label) {
    audio.play().catch((error) => {
        console.warn(`Unable to play ${label}:`, error);
    });
}

function playMusic(track, volume) {
    if (currentMusic === track && !track.paused) return;

    stopMusic();
    currentMusic = track;
    track.volume = volume;
    playAudio(track, 'music');
}

function stopMusic() {
    if (!currentMusic) return;
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
}

function playSoundEffect(audio, label) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = soundEffectVolume;
    playAudio(audio, label);
}

export function playAppMusic() {
    playMusic(musicTracks.app, appMusicVolume);
}

export function playLeagueMusic(leagueId) {
    if (!Object.hasOwn(musicTracks, leagueId) || leagueId === 'app') {
        console.error(`No music track is configured for league "${leagueId}".`);
        return;
    }
    playMusic(musicTracks[leagueId], modeMusicVolume);
}

export function playDifficultyMusic(difficulty) {
    if (!Object.hasOwn(difficultyTracks, difficulty)) {
        console.error(`No music track is configured for difficulty "${difficulty}".`);
        return;
    }
    playMusic(difficultyTracks[difficulty], modeMusicVolume);
}

export function playWinSound() {
    playSoundEffect(winSound, 'the correct-answer sound');
}

export function playLoseSound() {
    playSoundEffect(loseSound, 'the incorrect-answer sound');
}

export function playTouchSound() {
    playSoundEffect(touchSound, 'the touch sound');
}

export function resumeCurrentMusic() {
    if (currentMusic?.paused) {
        playAudio(currentMusic, 'music');
    }
}
