function loadingFade() {
	document.getElementById('welcome').style.opacity = "0";
}

function loadingRemove() {
	document.getElementById('welcome').style.visibility = "hidden";
	document.documentElement.style.overflowY = 'auto';
}

/* -------- COOKIES -------- */

// Fonction pour lire un cookie
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

// Fonction pour écrire un cookie
function setCookie(name, value, days = 1) {
	const expires = new Date(Date.now() + days * 86400000).toUTCString();
	document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

/* -------- LOGIQUE DE VISITE -------- */

const firstVisit = getCookie('visited');

if (firstVisit === null) {
	window.setTimeout(loadingFade, 3000);
	window.setTimeout(loadingRemove, 3500);
	setCookie('visited', '1');
} else {
	loadingRemove();
}
