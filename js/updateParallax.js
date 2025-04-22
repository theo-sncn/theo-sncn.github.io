function updateParallax() {
	const elements = document.querySelectorAll('.parallax');

	elements.forEach(el => {
		const speed = parseFloat(el.dataset.speed || 0.3);
		const rect = el.getBoundingClientRect();
		const elementCenter = rect.top + rect.height / 2;
		const screenCenter = window.innerHeight / 2;

		// Distance entre le centre de l’élément et le centre de l’écran
		const offset = elementCenter - screenCenter;

		// Calcul du décalage avec un centrage parfait à 0
		const clamp = window.innerHeight / 5;
		const move = -offset * speed;

		const translateY = Math.max(-clamp, Math.min(move, clamp));

		el.style.transform = `translateY(${translateY}px)`;
	});
}

window.addEventListener('scroll', updateParallax);
window.addEventListener('resize', updateParallax);
requestAnimationFrame(function loop() {
	updateParallax();
	requestAnimationFrame(loop);
});