let videos = [];
let currentVideoIndex = null;

// Charger les vidéos depuis le fichier JSON => Sert de bdd
async function loadVideos() {
    try {
        const response = await fetch('videos.json');
        if (!response.ok) {
            throw new Error('Impossible de charger les vidéos');
        }

        videos = await response.json();
        createVideoList();
        
        if (videos.length > 0) {
            loadVideo(0);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des vidéos:', error);
        document.getElementById('currentTitle').textContent = 'Erreur de chargement';
        document.getElementById('currentDesc').textContent = 'Impossible de charger la liste des vidéos. Vérifiez que le fichier videos.json existe.';
    }
}

// Créer la liste des vidéos dans la sidebar
function createVideoList() {
    const list = document.getElementById('videoList');
    list.innerHTML = '';
    
    videos.forEach((video, index) => {
        const item = document.createElement('div');
        item.className = 'video-item';
        item.onclick = () => loadVideo(index);
        
        item.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
            <div class="video-item-title">${video.title}</div>
            <div class="video-item-desc">${video.description}</div>
        `;
        
        list.appendChild(item);
    });
}

// Charger une vidéo spécifique
function loadVideo(index) {
    const video = videos[index];
    const videoPlayer = document.getElementById('videoPlayer');
    const currentTitle = document.getElementById('currentTitle');
    const currentDesc = document.getElementById('currentDesc');
    
    // Mise à jour du lecteur
    videoPlayer.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
    currentTitle.textContent = video.title;
    currentDesc.textContent = video.description;

    document.querySelectorAll('.video-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    currentVideoIndex = index;
}

// Chargement de la page
window.addEventListener('DOMContentLoaded', loadVideos);