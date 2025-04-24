export function enableScrollDebug() {
	const container = document.querySelector('main');
	const scrollGroups = document.querySelectorAll('.scroll-group');
	const articles = container.querySelectorAll('.carrousel-container');

	document.body.classList.add('debug-mode'); // pour les styles visuels (si présents dans le CSS)

	// Attente du chargement des médias pour mesurer précisément
	waitForMediaLoad(() => {
		const first = articles[0];
		if (!first) return;

		const offsetHeight = first.offsetHeight;
		const rectHeight = first.getBoundingClientRect().height;
		const marginTop = parseFloat(getComputedStyle(first).marginTop);
		const spacing = rectHeight + marginTop;

		console.log('%c[DEBUG HEIGHTS]', 'color: cyan; font-weight: bold;');
		console.log('> Nb articles        =', articles.length);
		console.log('> offsetHeight       =', offsetHeight);
		console.log('> boundingRect       =', rectHeight);
		console.log('> marginTop          =', marginTop);
		console.log('> spacing total      =', spacing);
		console.log('> spacing × N        =', spacing * articles.length);
		console.log('> group.scrollHeight =', scrollGroups[0]?.scrollHeight);
	});
}

function waitForMediaLoad(callback) {
	const mediaElements = document.querySelectorAll('img, video');
	let loaded = 0;

	if (mediaElements.length === 0) {
		callback();
		return;
	}

	mediaElements.forEach(media => {
		const done = () => {
			loaded++;
			if (loaded === mediaElements.length) {
				callback();
			}
		};

		if (media.tagName === 'IMG') {
			if (media.complete) done();
			else {
				media.addEventListener('load', done);
				media.addEventListener('error', done);
			}
		}

		if (media.tagName === 'VIDEO') {
			if (media.readyState >= 1) done();
			else {
				media.addEventListener('loadedmetadata', done);
				media.addEventListener('error', done);
			}
		}
	});
}