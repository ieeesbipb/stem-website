export interface WhyJoinCardData {
	id: string;
	num: string;
	badgeBg: string;
	badgeColor: string;
	text: string;
	stagger?: boolean;
}

export const whyJoinCards: WhyJoinCardData[] = [
	{
		id: "card-01",
		num: "01",
		badgeBg: "#48D597",
		badgeColor: "#08111E",
		text: "Gain new knowledge and experience",
	},
	{
		id: "card-02",
		num: "02",
		badgeBg: "#FF5500",
		badgeColor: "#FFFFFF",
		text: "Join seminars and a hands-on workshop",
		stagger: true,
	},
	{
		id: "card-03",
		num: "03",
		badgeBg: "#2B00FF",
		badgeColor: "#FFFFFF",
		text: "Earn an e-certificate",
	},
	{
		id: "card-04",
		num: "04",
		badgeBg: "#E0B8F6",
		badgeColor: "#08111E",
		text: "Meet students from other schools",
	},
	{
		id: "card-05",
		num: "05",
		badgeBg: "#FFD000",
		badgeColor: "#08111E",
		text: "Network with IEEE SB IPB officers",
		stagger: true,
	},
	{
		id: "card-06",
		num: "06",
		badgeBg: "#55A8FF",
		badgeColor: "#08111E",
		text: "Possible internship opportunity",
	},
];
