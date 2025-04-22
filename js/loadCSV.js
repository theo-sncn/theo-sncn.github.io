export let csvData = [];

/* -----------------------------
   1. Charger les données CSV
------------------------------ */
export async function loadCSV() {
	const response = await fetch('../docs/projects_data.csv');
	const text = await response.text();
	const rows = text.trim().split('\n');
	rows.shift();

	csvData = rows.map((row, i) => {
		const [folder, videoSrc, imgSrc, title, software, description] = row.split(';');
		return {
			index: i,
			folder: folder?.trim(),
			video: videoSrc?.trim(),
			image: imgSrc?.trim(),
			title: title?.trim(),
			software: software?.trim(),
			description: description?.trim()
		};
	});
}

/* -----------------------------
   2. Créer un groupe scrollable
------------------------------ */
export function createScrollGroup() {
	const group = document.createElement('section');
	group.className = 'scroll-group';

	csvData.forEach(data => {
		const article = document.createElement('article');
		article.className = 'carrousel-container';

		const a = document.createElement('a');
		if (data.link) {
			a.href = data.link;
			const externalKeywords = ['http', '.pdf', '.docx', '.pptx'];	// Liste des indicateurs de lien "externe"
			const isExternal = externalKeywords.some(keyword => data.link.includes(keyword));	// Si l'un des mots-clés est présent dans le lien, on ouvre dans un nouvel onglet
			if (isExternal) {
				a.target = '_blank';
				a.rel = 'noopener noreferrer'; // sécurité
			} else {
				a.target = '_self';
			}
		} else {a.href = '#';}

		const textDiv = document.createElement('div');
		textDiv.className = 'text-container parallax';
		textDiv.dataset.speed = '-0.3';

		const titleH1 = document.createElement('h1');
		titleH1.textContent = data.title || '';

		const discoverButton = document.createElement('button');
		discoverButton.className = 'text-button underline';
		discoverButton.textContent = 'Découvrir';

		const mediaDiv = document.createElement('div');
		mediaDiv.className = 'media-container parallax';
		mediaDiv.dataset.speed = '0.3';

		if (data.video) {
			const video = document.createElement('video');
			video.src = '../projects/' + data.folder + '/' + data.video;
			video.autoplay = true;
			video.muted = true;
			video.loop = true;
			video.preload = 'metadata';
			mediaDiv.appendChild(video);
		} else if (data.image) {
			const img = document.createElement('img');
			img.src = '../projects/' + data.folder + '/' + data.image;
			img.setAttribute('loading', 'lazy');
			mediaDiv.appendChild(img);
		}

		article.appendChild(a);
		a.appendChild(textDiv);
		textDiv.appendChild(titleH1);
		textDiv.appendChild(discoverButton);
		article.appendChild(mediaDiv);
		group.appendChild(article);
	});

	return group;
}