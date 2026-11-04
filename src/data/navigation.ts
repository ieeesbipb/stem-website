export interface NavItem {
	label: string;
	href: string;
	active?: boolean;
	id?: string;
}

export const navItems: NavItem[] = [
	{ label: "Tentang", href: "#overview", active: true, id: "nav-overview" },
	{ label: "Alasan Ikut", href: "#why-join", id: "nav-why-join" },
	{ label: "Rangkaian Acara", href: "#event-flow", id: "nav-event-flow" },
	{ label: "Pembicara", href: "#speakers", id: "nav-speakers" },
	{ label: "Mitra", href: "#partners", id: "nav-partners" },
	{ label: "FAQ", href: "#faq", id: "nav-faq" },
];
