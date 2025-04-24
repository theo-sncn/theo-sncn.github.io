// Fonction principale pour ajuster la taille des médias dans leurs conteneurs
function adjustMediaSize() {
	const containers = document.querySelectorAll('.media-container');
	// console.log('Containers found:', containers.length);
	
	containers.forEach(container => {
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;
		const containerRatio = containerWidth / containerHeight;

		const mediaElements = container.querySelectorAll('img, video');

		mediaElements.forEach(media => {
			// Fonction qui applique le bon redimensionnement
			function applyFit() {
				const mediaRatio = media.tagName === 'VIDEO'
					? (media.videoWidth / media.videoHeight)
					: (media.naturalWidth / media.naturalHeight);

				// console.log('Media:', media, 'MediaRatio:', mediaRatio, 'ContainerRatio:', containerRatio);

				// Choix du redimensionnement selon le ratio
				if (containerRatio > mediaRatio) {
					media.style.width = '100%';
					media.style.height = 'auto';
				} else {
					media.style.height = '120%';
					media.style.width = 'auto';
				}

				// Optionnel : pour forcer le media à remplir son cadre harmonieusement
				media.style.objectFit = 'cover';
			}

			// Cas des images
			if (media.tagName === 'IMG') {
				if (media.complete) {
					applyFit();
				} else {
					media.onload = applyFit;
				}
			}

			// Cas des vidéos
			if (media.tagName === 'VIDEO') {
				if (media.readyState >= 1) {
					applyFit();
				} else {
					media.onloadedmetadata = applyFit;
				}
			}
		});
	});
}

// Exécution au chargement de la page et lors du redimensionnement
window.addEventListener('load', adjustMediaSize);
window.addEventListener('resize', adjustMediaSize);

// Surveillance du DOM pour détecter les médias ajoutés dynamiquement
const observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList) {
		if (mutation.addedNodes.length > 0) {
			adjustMediaSize(); // Réajuste à chaque ajout
		}
	}
});

// Démarrage de l'observation
observer.observe(document.body, {
	childList: true,
	subtree: true
});