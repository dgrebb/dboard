// TODO: Create SSE Server
const refreshInterval = 5000; // Interval in milliseconds to check for updates
let refreshTimer: NodeJS.Timeout; // Timer to periodically check for updates
let previousContent: string | null = null; // Previous file content
let timestamp = 0; // Initial timestamp value
let art = '/album_art.png';
let title = '';
let album = '';
let artist = '';

// TODO: pollfile function
const pollFile = async () => {
  try {
    timestamp = Date.now(); // Update the timestamp for each poll
    const response = await fetch(`/album_art.png?_=${timestamp}`);
    if (response.ok) {
      const currentContent = await response.text();
      if (currentContent !== previousContent) {
        previousContent = currentContent; // Update the previous file content
        art = `/album_art.png?_=${timestamp}`;
        const music = await fetch('/api/v1/music');
        ({ album, title, artist } = await music.json());
        const nowPlaying = {
          artist,
          title,
          album,
          art,
        };
        homeStore.nowPlaying = nowPlaying;
      }
    } else {
      art = ''; // Clear the file path if the file does not exist
      previousContent = null; // Reset previous file content
    }
  } catch (error) {
    console.error('Error polling file:', error);
  } finally {
    refreshTimer = setTimeout(pollFile, refreshInterval); // Schedule the next poll
  }
};

// TODO: music api call and seting art, album, title, and artist on album art file change

// TODO: on disconnect; kill pollfile timer
clearInterval(refreshTimer); // Clear the timer when the component is destroyed
