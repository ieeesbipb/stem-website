import Lenis from 'lenis';

export function initScrollSpy(): void {
	const lenis = new Lenis({
		autoRaf: true,
	});

	const topBar = document.querySelector<HTMLElement>('[data-top-bar]');
	const navOverview = document.getElementById('nav-overview');
	const navWhyJoin = document.getElementById('nav-why-join');
	const whyJoinSection = document.getElementById('why-join');
	const heroSection = document.getElementById('hero');
	const overviewSection = document.getElementById('overview');
	const brandLink = document.querySelector<HTMLElement>('[data-brand-link]');
	const columns = document.querySelectorAll<HTMLElement>('[data-column-index]');

	// Smooth click navigation via Lenis
	if (navOverview && overviewSection) {
		navOverview.addEventListener('click', (e) => {
			e.preventDefault();
			lenis.scrollTo(overviewSection, { offset: -56 });
		});
	}

	if (navWhyJoin && whyJoinSection) {
		navWhyJoin.addEventListener('click', (e) => {
			e.preventDefault();
			lenis.scrollTo(whyJoinSection, { offset: -56 });
		});
	}

	if (brandLink && heroSection) {
		brandLink.addEventListener('click', (e) => {
			e.preventDefault();
			lenis.scrollTo(heroSection);
		});
	}

	// Parallax Columns on Scroll for Why Join (Sui Overflow style)
	const updateParallax = () => {
		if (!whyJoinSection || columns.length < 3) return;

		if (window.innerWidth <= 1024) {
			columns.forEach((col) => (col.style.transform = ''));
			return;
		}

		const rect = whyJoinSection.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		// Calculate total scroll distance available within the section
		// Start parallax when section top enters 60% viewport
		// Finish alignment deep into the scroll (section top has scrolled far above viewport)
		const startOffset = windowHeight * 0.6;
		const endOffset = -(windowHeight * 0.45);
		const progress = Math.min(Math.max((startOffset - rect.top) / (startOffset - endOffset), 0), 1);
		const remaining = 1 - progress;

		// Staggered offsets: left leads (0), middle lags (200px), right lags most (400px)
		const offsets = [0, 200, 400];

		columns.forEach((col, idx) => {
			const currentOffset = remaining * (offsets[idx] ?? 0);
			col.style.transform = `translateY(${currentOffset}px)`;
		});
	};

	// Scroll Observer for active tab and top-bar dark mode
	if (whyJoinSection && navOverview && navWhyJoin) {
		const updateStateOnScroll = () => {
			const rect = whyJoinSection.getBoundingClientRect();
			const inWhyJoin = rect.top <= 200 && rect.bottom > 150;

			if (inWhyJoin) {
				navOverview.removeAttribute('data-active');
				navOverview.removeAttribute('aria-current');
				navWhyJoin.setAttribute('data-active', 'yellow');
				navWhyJoin.setAttribute('aria-current', 'page');
				if (topBar) topBar.setAttribute('data-theme', 'dark');
			} else {
				navWhyJoin.removeAttribute('data-active');
				navWhyJoin.removeAttribute('aria-current');
				navOverview.setAttribute('data-active', 'blue');
				navOverview.setAttribute('aria-current', 'page');
				if (topBar) topBar.removeAttribute('data-theme');
			}

			updateParallax();
		};

		lenis.on('scroll', updateStateOnScroll);
		window.addEventListener('resize', updateParallax, { passive: true });
		updateStateOnScroll();
	}
}
