export interface WhyJoinCardData {
	id: string;
	num: string;
	badgeBg: string;
	badgeColor: string;
	text: string;
}

export const whyJoinColumns: WhyJoinCardData[][] = [
	// Column 1 (Left - leads scroll)
	[
		{
			id: "card-01",
			num: "01",
			badgeBg: "#56DA9F",
			badgeColor: "#051020",
			text: "Gain new knowledge and experience",
		},
		{
			id: "card-04",
			num: "04",
			badgeBg: "#4EA5FF",
			badgeColor: "#051020",
			text: "Meet students from other schools",
		},
	],
	// Column 2 (Middle - lags slightly)
	[
		{
			id: "card-02",
			num: "02",
			badgeBg: "#FFD516",
			badgeColor: "#051020",
			text: "Join seminars and a hands-on workshop",
		},
		{
			id: "card-05",
			num: "05",
			badgeBg: "#56DA9F",
			badgeColor: "#051020",
			text: "Network with IEEE SB IPB officers",
		},
	],
	// Column 3 (Right - lags most)
	[
		{
			id: "card-03",
			num: "03",
			badgeBg: "#4EA5FF",
			badgeColor: "#051020",
			text: "Earn an e-certificate",
		},
		{
			id: "card-06",
			num: "06",
			badgeBg: "#FFD516",
			badgeColor: "#051020",
			text: "Possible internship opportunity",
		},
	],
];
