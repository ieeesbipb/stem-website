export interface NavItem {
	label: string;
	href: string;
	active?: boolean;
	id?: string;
}

export const navItems: NavItem[] = [
	{ label: "Overview", href: "#overview", active: true, id: "nav-overview" },
	{ label: "Why Join", href: "#why-join", id: "nav-why-join" },
	{ label: "Event Flow", href: "#event-flow", id: "nav-event-flow" },
	{ label: "Speakers", href: "#speakers", id: "nav-speakers" },
	{ label: "Partners", href: "#partners", id: "nav-partners" },
	{ label: "FAQ", href: "#faq", id: "nav-faq" },
];
