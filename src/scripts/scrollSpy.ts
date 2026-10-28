export function initScrollSpy(): void {
	const topBar = document.querySelector<HTMLElement>('[data-top-bar]');
	const navOverview = document.getElementById('nav-overview');
	const navWhyJoin = document.getElementById('nav-why-join');
	const whyJoinSection = document.getElementById('why-join');
	const heroSection = document.getElementById('hero');
	const overviewSection = document.getElementById('overview');
	const brandLink = document.querySelector<HTMLElement>('[data-brand-link]');

	// Smooth click navigation
	if (navOverview && overviewSection) {
		navOverview.addEventListener('click', (e) => {
			e.preventDefault();
			overviewSection.scrollIntoView({ behavior: 'smooth' });
		});
	}

	if (navWhyJoin && whyJoinSection) {
		navWhyJoin.addEventListener('click', (e) => {
			e.preventDefault();
			whyJoinSection.scrollIntoView({ behavior: 'smooth' });
		});
	}

	if (brandLink && heroSection) {
		brandLink.addEventListener('click', (e) => {
			e.preventDefault();
			heroSection.scrollIntoView({ behavior: 'smooth' });
		});
	}

	// Scroll Observer for active tab and top-bar dark mode
	if (whyJoinSection && navOverview && navWhyJoin) {
		const updateStateOnScroll = () => {
			const rect = whyJoinSection.getBoundingClientRect();
			// If why-join top is near or above the middle of viewport
			const inWhyJoin = rect.top <= 200 && rect.bottom > 150;

			if (inWhyJoin) {
				// Why Join active state
				navOverview.removeAttribute('data-active');
				navOverview.removeAttribute('aria-current');
				navWhyJoin.setAttribute('data-active', 'yellow');
				navWhyJoin.setAttribute('aria-current', 'page');
				if (topBar) topBar.setAttribute('data-theme', 'dark');
			} else {
				// Overview / Hero active state
				navWhyJoin.removeAttribute('data-active');
				navWhyJoin.removeAttribute('aria-current');
				navOverview.setAttribute('data-active', 'blue');
				navOverview.setAttribute('aria-current', 'page');
				if (topBar) topBar.removeAttribute('data-theme');
			}
		};

		window.addEventListener('scroll', updateStateOnScroll, { passive: true });
		updateStateOnScroll();
	}
}
