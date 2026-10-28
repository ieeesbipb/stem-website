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
			badgeBg: "#00E599",
			badgeColor: "#051020",
			text: "Gain new knowledge and experience",
		},
		{
			id: "card-04",
			num: "04",
			badgeBg: "#B87BFF",
			badgeColor: "#051020",
			text: "Meet students from other schools",
		},
	],
	// Column 2 (Middle - lags slightly)
	[
		{
			id: "card-02",
			num: "02",
			badgeBg: "#FF5500",
			badgeColor: "#FFFFFF",
			text: "Join seminars and a hands-on workshop",
		},
		{
			id: "card-05",
			num: "05",
			badgeBg: "#FFB800",
			badgeColor: "#051020",
			text: "Network with IEEE SB IPB officers",
		},
	],
	// Column 3 (Right - lags most)
	[
		{
			id: "card-03",
			num: "03",
			badgeBg: "#6E56FF",
			badgeColor: "#FFFFFF",
			text: "Earn an e-certificate",
		},
		{
			id: "card-06",
			num: "06",
			badgeBg: "#29B6F6",
			badgeColor: "#051020",
			text: "Possible internship opportunity",
		},
	],
];
