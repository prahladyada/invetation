Add your wedding background track here as:

    wedding.mp3

index.html already references assets/music/wedding.mp3 via the <audio> tag,
and js/main.js already wires up the floating music button — so once this
file exists, playback works with no code changes.

Until a real file is added, the music button is present but silently does
nothing (the play() promise rejection is caught in js/main.js), so nothing
breaks — it just won't play audio yet.

Tip: keep the file reasonably small (a compressed ~128-192kbps MP3, ideally
well under 5MB) since it's also cached by the service worker for offline
playback.
