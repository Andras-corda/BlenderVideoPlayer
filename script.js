let playlists = [];
    let currentPlaylistIndex = 0;
    let currentVideoIndex = null;

    async function loadPlaylists() {
      const errorDiv = document.getElementById('errorMsg');
      errorDiv.textContent = '';  // Effacer les erreurs précédentes
      try {
        const response = await fetch('/JsonDB/videos.json');
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status} — impossible de charger videos.json à l’URL ${response.url}`);
        }
        const data = await response.json().catch(err => {
          throw new Error('Le contenu de videos.json n’est pas un JSON valide : ' + err.message);
        });
        if (!data.playlists || !Array.isArray(data.playlists)) {
          throw new Error('Format JSON incorrect : propriété "playlists" manquante ou non un tableau');
        }
        playlists = data.playlists;

        if (playlists.length === 0) {
          throw new Error('Aucune playlist trouvée dans le JSON (tableau vide)');
        }

        createPlaylistSelector();
        loadPlaylist(0);
      } catch (error) {
        console.error('Erreur lors du chargement des playlists :', error);
        errorDiv.textContent = `Erreur : ${error.message}`;
        // On peut afficher dans les éléments de titre/desc si souhaité
        document.getElementById('currentTitle').textContent = 'Erreur de chargement';
        document.getElementById('currentDesc').textContent = error.message;
      }
    }

    function createPlaylistSelector() {
      const sidebar = document.querySelector('.sidebar');
      // Supprimer les anciens onglets s’ils existent
      let old = document.getElementById('playlistTabs');
      if (old) sidebar.removeChild(old);

      const playlistTabs = document.createElement('div');
      playlistTabs.className = 'playlist-tabs';
      playlistTabs.id = 'playlistTabs';

      playlists.forEach((playlist, index) => {
        const tab = document.createElement('button');
        tab.className = 'playlist-tab';
        tab.textContent = playlist.name || `Playlist ${index + 1}`;
        tab.onclick = () => loadPlaylist(index);
        playlistTabs.appendChild(tab);
      });

      sidebar.insertBefore(playlistTabs, sidebar.firstChild);
    }

    function loadPlaylist(playlistIndex) {
      const errorDiv = document.getElementById('errorMsg');
      errorDiv.textContent = '';
      if (playlistIndex < 0 || playlistIndex >= playlists.length) {
        errorDiv.textContent = `Erreur : index de playlist invalide (${playlistIndex})`;
        return;
      }
      currentPlaylistIndex = playlistIndex;

      const playlist = playlists[playlistIndex];
      document.querySelectorAll('.playlist-tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx === playlistIndex);
      });

      document.getElementById('playlistTitle').textContent = playlist.name || `Playlist ${playlistIndex + 1}`;

      if (!playlist.videos || !Array.isArray(playlist.videos)) {
        errorDiv.textContent = `Erreur : playlist ${playlistIndex} n’a pas de propriété "videos" valide`;
        document.getElementById('videoList').innerHTML = '';
        return;
      }

      createVideoList(playlist.videos);

      if (playlist.videos.length > 0) {
        loadVideo(0);
      } else {
        errorDiv.textContent = `La playlist ${playlistIndex} ne contient aucune vidéo`;
      }
    }

    function createVideoList(videos) {
      const list = document.getElementById('videoList');
      list.innerHTML = '';
      videos.forEach((video, index) => {
        const item = document.createElement('div');
        item.className = 'video-item';
        item.onclick = () => loadVideo(index);

        const thumb = video.thumbnail || '';
        const title = video.title || `Vidéo ${index + 1}`;
        const desc = video.description || '';

        item.innerHTML = `
          <img src="${thumb}" alt="${title}" class="video-thumbnail">
          <div>
            <div class="video-item-title">${title}</div>
            <div class="video-item-desc">${desc}</div>
          </div>
        `;

        list.appendChild(item);
      });
    }

    function loadVideo(videoIndex) {
      const errorDiv = document.getElementById('errorMsg');
      errorDiv.textContent = '';
      const playlist = playlists[currentPlaylistIndex];
      if (!playlist || !playlist.videos) {
        errorDiv.textContent = `Erreur interne : playlist non définie ou sans vidéos`;
        return;
      }
      if (videoIndex < 0 || videoIndex >= playlist.videos.length) {
        errorDiv.textContent = `Erreur : index de vidéo invalide (${videoIndex})`;
        return;
      }

      currentVideoIndex = videoIndex;
      const video = playlist.videos[videoIndex];

      if (!video.id) {
        errorDiv.textContent = `Erreur : cette vidéo n’a pas d’ID YouTube défini`;
      }

      const iframe = document.getElementById('videoPlayer');
      iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;

      document.getElementById('currentTitle').textContent = video.title || '';
      document.getElementById('currentDesc').textContent = video.description || '';

      document.querySelectorAll('.video-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === videoIndex);
      });
    }

    window.addEventListener('DOMContentLoaded', loadPlaylists);