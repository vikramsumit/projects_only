console.log('Let\'s write JavaScript');

let currentSong = new Audio();
let songs = [];
let currFolder = 'songs/ncs';

// Utility function to convert seconds to MM:SS format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Lightweight throttle using requestAnimationFrame for UI-bound updates
function throttleWithRAF(fn) {
    let scheduled = false;
    let lastArgs = null;
    return function throttled(...args) {
        lastArgs = args;
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            fn.apply(this, lastArgs);
        });
    };
}

// Simple debounce utility
function debounce(fn, delay) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Persist helpers
const STORAGE_KEYS = {
    volume: 'player.volume',
    lastFolder: 'player.lastFolder',
    lastTrack: 'player.lastTrack'
};

function saveVolume(volume0to1) {
    try { localStorage.setItem(STORAGE_KEYS.volume, String(volume0to1)); } catch {}
}
function loadVolume() {
    try {
        const v = parseFloat(localStorage.getItem(STORAGE_KEYS.volume));
        return isNaN(v) ? null : Math.min(Math.max(v, 0), 1);
    } catch { return null; }
}
function saveLastTrack(folder, track) {
    try {
        localStorage.setItem(STORAGE_KEYS.lastFolder, folder);
        localStorage.setItem(STORAGE_KEYS.lastTrack, track);
    } catch {}
}
function loadLastTrack() {
    try {
        return {
            folder: localStorage.getItem(STORAGE_KEYS.lastFolder),
            track: localStorage.getItem(STORAGE_KEYS.lastTrack)
        };
    } catch { return { folder: null, track: null }; }
}

// Fetch songs from a folder
async function getSongs(folder) {
    try {
        currFolder = folder;
        const response = await fetch(`/${folder}/`, { method: 'GET' });
        if (!response.ok) throw new Error(`Failed to fetch songs from ${folder}`);
        
        const text = await response.text();
        const div = document.createElement('div');
        div.innerHTML = text;
        const anchors = div.getElementsByTagName('a');
        songs = Array.from(anchors)
            .filter(a => a.href.endsWith('.mp3'))
            .map(a => decodeURIComponent(a.href.split(`/${folder}/`)[1]));

        // Render song list
        const songUL = document.querySelector('.songList ul');
        songUL.innerHTML = songs.map(song => `
            <li>
                <img class="invert" width="34" src="img/music.svg" alt="Music icon">
                <div class="info">
                    <div>${song}</div>
                    <div>Unknown Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="Play">
                </div>
            </li>
        `).join('');

        // Attach click event listeners to songs
        Array.from(songUL.getElementsByTagName('li')).forEach((li, index) => {
            li.addEventListener('click', () => playMusic(songs[index]));
        });

        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        document.querySelector('.songList ul').innerHTML = '<li>Error loading songs. Please try again.</li>';
        return [];
    }
}

// Play a song
function playMusic(track, pause = false) {
    if (!track) return;
    currentSong.src = `/${currFolder}/${encodeURIComponent(track)}`;
    document.querySelector('.songinfo').textContent = track;
    document.querySelector('.songtime').textContent = '00:00 / 00:00';

    // Persist last played
    saveLastTrack(currFolder, track);

    if (!pause) {
        currentSong.play().catch(error => console.error('Playback error:', error));
        document.querySelector('#play').src = 'img/pause.svg';
    }
}

// Fetch and display albums
async function displayAlbums() {
    try {
        console.log('Displaying albums');
        const response = await fetch('/songs/');
        if (!response.ok) throw new Error('Failed to fetch albums');

        const text = await response.text();
        const div = document.createElement('div');
        div.innerHTML = text;
        const anchors = Array.from(div.getElementsByTagName('a'))
            .filter(a => a.href.includes('/songs') && !a.href.includes('.htaccess'));

        const cardContainer = document.querySelector('.cardContainer');
        cardContainer.innerHTML = '';

        for (const anchor of anchors) {
            const folder = anchor.href.split('/').slice(-2)[0];
            try {
                const metadataResponse = await fetch(`/songs/${folder}/info.json`);
                if (!metadataResponse.ok) throw new Error(`No info.json for ${folder}`);
                const metadata = await metadataResponse.json();

                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="${metadata.title || 'Album cover'}" onerror="this.src='img/fallback.jpg'">
                        <h2>${metadata.title || 'Unknown Album'}</h2>
                        <p>${metadata.description || 'No description'}</p>
                    </div>`;
            } catch (error) {
                console.warn(`Skipping folder ${folder}:`, error);
            }
        }

        // Attach click event listeners to album cards
        Array.from(document.getElementsByClassName('card')).forEach(card => {
            card.addEventListener('click', async () => {
                console.log('Fetching songs for', card.dataset.folder);
                const songs = await getSongs(`songs/${card.dataset.folder}`);
                if (songs.length > 0) playMusic(songs[0]);
            });
        });
    } catch (error) {
        console.error('Error displaying albums:', error);
        document.querySelector('.cardContainer').innerHTML = '<p>Error loading albums. Please try again.</p>';
    }
}

// Main function to initialize the player
async function main() {
    try {
        // Restore last state
        const { folder: savedFolder, track: savedTrack } = loadLastTrack();
        if (savedFolder) currFolder = savedFolder;

        // Initialize songs and optionally select last track
        await getSongs(currFolder);
        if (savedTrack && songs.includes(savedTrack)) {
            playMusic(savedTrack, true);
        } else if (songs.length > 0) {
            playMusic(songs[0], true);
        }

        // Display albums
        await displayAlbums();

        // Play/Pause button
        const playBtn = document.querySelector('#play');
        playBtn.addEventListener('click', () => {
            if (currentSong.paused) {
                currentSong.play().catch(error => console.error('Playback error:', error));
                playBtn.src = 'img/pause.svg';
            } else {
                currentSong.pause();
                playBtn.src = 'img/play.svg';
            }
        });

        // Update seekbar and time
        const updateTimeUI = throttleWithRAF(() => {
            if (!isNaN(currentSong.duration)) {
                document.querySelector('.songtime').textContent = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
                document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
            }
        });
        currentSong.addEventListener('timeupdate', updateTimeUI);

        // Seekbar click and touch/move support
        const seekbar = document.querySelector('.seekbar');
        const updateSeek = (clientX, rect) => {
            const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1) * 100;
            document.querySelector('.circle').style.left = percent + '%';
            currentSong.currentTime = (currentSong.duration * percent) / 100;
        };
        const throttledDragSeek = throttleWithRAF((clientX, rect) => updateSeek(clientX, rect));

        seekbar.addEventListener('click', e => updateSeek(e.clientX, e.target.getBoundingClientRect()));
        seekbar.addEventListener('touchstart', e => {
            e.preventDefault();
            throttledDragSeek(e.touches[0].clientX, e.target.getBoundingClientRect());
        });
        seekbar.addEventListener('touchmove', e => {
            e.preventDefault();
            throttledDragSeek(e.touches[0].clientX, e.target.getBoundingClientRect());
        });
        seekbar.addEventListener('mousedown', e => {
            const rect = e.target.getBoundingClientRect();
            const move = ev => throttledDragSeek(ev.clientX, rect);
            const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        // Sidebar toggle
        document.querySelector('.hamburger').addEventListener('click', () => {
            document.querySelector('.left').classList.add('show');
            document.querySelector('.hamburger').setAttribute('aria-expanded', 'true');
        });

        document.querySelector('.close').addEventListener('click', () => {
            document.querySelector('.left').classList.remove('show');
            document.querySelector('.hamburger').setAttribute('aria-expanded', 'false');
        });

        // Previous song
        document.querySelector('#previous').addEventListener('click', () => {
            const index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]));
            const newIndex = (index - 1 + songs.length) % songs.length; // Loop to last song
            playMusic(songs[newIndex]);
        });

        // Next song
        document.querySelector('#next').addEventListener('click', () => {
            const index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]));
            const newIndex = (index + 1) % songs.length; // Loop to first song
            playMusic(songs[newIndex]);
        });

        // Volume control
        const volumeInput = document.querySelector('.range input');
        const savedVolume = loadVolume();
        if (savedVolume !== null) currentSong.volume = savedVolume;
        volumeInput.value = Math.round(currentSong.volume * 100);

        const applyVolume = v => {
            const volume = Math.min(Math.max(v / 100, 0), 1);
            currentSong.volume = volume;
            document.querySelector('.volume>img').src = volume > 0 ? 'img/volume.svg' : 'img/mute.svg';
            saveVolume(volume);
        };
        const throttledVolume = throttleWithRAF(ev => applyVolume(ev.target.value));
        const debouncedVolumePersist = debounce(() => saveVolume(currentSong.volume), 250);

        volumeInput.addEventListener('input', ev => {
            throttledVolume(ev);
            debouncedVolumePersist();
        });

        // Mute/Unmute
        document.querySelector('.volume>img').addEventListener('click', e => {
            if (currentSong.volume > 0) {
                currentSong.volume = 0;
                e.target.src = 'img/mute.svg';
                volumeInput.value = 0;
            } else {
                currentSong.volume = 0.1;
                e.target.src = 'img/volume.svg';
                volumeInput.value = 10;
            }
            saveVolume(currentSong.volume);
        });

        // Auto-play next song when current song ends
        currentSong.addEventListener('ended', () => {
            const index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]));
            const newIndex = (index + 1) % songs.length;
            playMusic(songs[newIndex]);
        });

    } catch (error) {
        console.error('Error initializing player:', error);
    }
}

main();