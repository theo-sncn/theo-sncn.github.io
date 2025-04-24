import { enableScrollDebug } from '../js/debugScroll.js';
import { csvData, loadCSV, createScrollGroup } from '../js/loadCSV.js';

const container = document.querySelector('main');
const DEBUG_MODE = false;
const SNAP_THRESHOLD = 200;			 // temps en ms
const ease = 0.1;                    // vitesse d’interpolation
const articleSpacingRatio = 0.84;	 // hauteur d’un article (84vh)

let scrollTarget = 0;                // position idéale (vers laquelle on tend)
let scrollCurrent = 0;               // position réelle affichée
let articleSpacing = 0;              // hauteur d’un article (calculée dynamiquement)
let groupHeight = 0;
let lastScrollTime = Date.now();     // pour détecter l'arrêt de scroll
let scrollGroups = [];

/* -----------------------------
   3. Injecte les deux groupes (loop)
------------------------------ */
function populateGroups() {
	const template = container.querySelector('.template');
	if (template) template.remove();
	const group1 = createScrollGroup();
	const group2 = createScrollGroup();

	container.appendChild(group1);
	container.appendChild(group2);

	scrollGroups = [group1, group2];

	groupHeight = group1.scrollHeight;
	articleSpacing = Math.round(getArticleSpacing());
	
	// Placement initial
	group1.style.transform = `translateY(0px)`;
	group2.style.transform = `translateY(${-groupHeight}px)`;

	scrollTarget = scrollCurrent = 0;
}

/* -----------------------------
   4. Scroll fluide et snapping
------------------------------ */
function smoothScroll() {
	const now = Date.now();
	const sinceLastScroll = now - lastScrollTime;

	scrollCurrent += (scrollTarget - scrollCurrent) * ease;
	container.style.transform = `translateY(${-scrollCurrent}px)`;

	if (sinceLastScroll > SNAP_THRESHOLD) {
		const snapIndex = Math.round(scrollCurrent / articleSpacing);
		scrollTarget = snapIndex * articleSpacing;
		// console.log("snapIndex : ", snapIndex, "scrollTarget : ", scrollTarget);
	}
	
	loopGroups();
	updateActiveArticle();
	requestAnimationFrame(smoothScroll);
}

/* -----------------------------
5. Calcule la hauteur d’un bloc + Calcule la hauteur d'un .scroll-group
------------------------------ */
function getArticleSpacing() {
	const first = container.querySelector('.carrousel-container');
	if (!first) return window.innerHeight;
	const style = window.getComputedStyle(first);
	return first.offsetHeight + parseFloat(style.marginTop);
}

function getGroupHeight() {
	return Math.round(window.innerHeight * articleSpacingRatio * csvData.length);
}

/* -----------------------------
6. Loop des groupes
------------------------------ */
function loopGroups() {
	groupHeight = getGroupHeight();
	const totalScrollHeight = groupHeight * scrollGroups.length;
	const hysteresis = groupHeight * 0.1;	// seuil de tolérance

	scrollGroups.forEach(group => {
		const groupY = parseFloat(group.style.transform.replace('translateY(', '').replace('px)', ''));

		// Trop haut, on l'envoie en bas
		if (scrollCurrent > groupY + groupHeight + hysteresis) {
			group.style.transform = `translateY(${groupY + totalScrollHeight}px)`;
		}

		// Trop bas, on l'envoie en haut
		if (scrollCurrent < groupY - groupHeight + hysteresis) {
			group.style.transform = `translateY(${groupY - totalScrollHeight}px)`;
		}
	});
}

/* -----------------------------
   7. Active la slide au centre
------------------------------ */
function updateActiveArticle() {
	const articles = container.querySelectorAll('.carrousel-container');
	let closest = null;
	let closestDist = Infinity;

	articles.forEach(article => {
		const rect = article.getBoundingClientRect();
		const center = rect.top + rect.height / 2;
		const dist = Math.abs(center - window.innerHeight / 2);
		if (dist < closestDist) {
			closestDist = dist;
			closest = article;
		}
	});

	articles.forEach(article => {
		const isActive = article === closest;
		article.classList.toggle('active', isActive);

		// Gestion des vidéos
		const video = article.querySelector('video');
		if (video) {
			if (isActive) video.play();
			else video.pause();
		}
	});
}

/* -----------------------------
   8. Molette
------------------------------ */
function handleWheel(e) {
	scrollTarget += e.deltaY;
	lastScrollTime = Date.now();
}

/* -----------------------------
   9. Recalcule au resize
------------------------------ */
async function handleResize() {
	groupHeight = getGroupHeight();
	articleSpacing = Math.round(getArticleSpacing());


	// Repositionner proprement les groupes
	scrollGroups.forEach((group, i) => {
		group.style.transform = `translateY(${i * groupHeight}px)`;
	});

	// Ne pas snap brutalement
	scrollTarget = scrollCurrent;
	container.style.transform = `translateY(${-scrollCurrent}px)`;
}

/* -----------------------------
   10. Initialisation
------------------------------ */
async function initScrollSystem() {
	await loadCSV();
	populateGroups();

	if (DEBUG_MODE) enableScrollDebug();

	document.body.style.overflow = 'hidden';
	container.style.willChange = 'transform';

	requestAnimationFrame(smoothScroll);
	window.addEventListener('wheel', handleWheel, { passive: false });
	window.addEventListener('resize', handleResize);
}

initScrollSystem();