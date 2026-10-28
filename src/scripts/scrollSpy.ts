export function initScrollSpy(): void {
	const topBar = document.querySelector<HTMLElement>('[data-top-bar]');
	const navOverview = document.getElementById('nav-overview');
	const navWhyJoin = document.getElementById('nav-why-join');
	const whyJoinSection = document.getElementById('why-join');
	const heroSection = document.getElementById('hero');
	const overviewSection = document.getElementById('overview');
	const brandLink = document.querySelector<HTMLElement>('[data-brand-link]');
	const columns = document.querySelectorAll<HTMLElement>('[data-column-index]');

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

	// Parallax Columns on Scroll for Why Join (Sui Overflow style)
	const updateParallax = () => {
		if (!whyJoinSection || columns.length < 3) return;

		if (window.innerWidth <= 1024) {
			columns.forEach((col) => (col.style.transform = ''));
			return;
		}

		const rect = whyJoinSection.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		// Progress from 0 (section enters viewport) to 1 (section centered/in view)
		const startOffset = windowHeight;
		const endOffset = 120;
		const progress = Math.min(Math.max((startOffset - rect.top) / (startOffset - endOffset), 0), 1);
		const remaining = 1 - progress;

		// Staggered offsets: left leads, middle lags behind, right lags most
		// At progress = 1, all reach translateY(0) and align perfectly
		const offsets = [20, 90, 170];

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

		window.addEventListener('scroll', updateStateOnScroll, { passive: true });
		window.addEventListener('resize', updateParallax, { passive: true });
		updateStateOnScroll();
	}
}
