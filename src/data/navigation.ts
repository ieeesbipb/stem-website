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
	{ label: "Kilas Balik", href: "#past-editions", id: "nav-past-editions" },
	{ label: "Merchandise", href: "#merchandise", id: "nav-merchandise" },
];
