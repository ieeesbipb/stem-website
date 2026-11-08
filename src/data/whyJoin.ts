export interface WhyJoinCardData {
	id: string;
	num: string;
	title: string;
	badgeBg: string;
	badgeColor: string;
	text: string;
}

export const whyJoinColumns: WhyJoinCardData[][] = [
	[
		{
			id: 'card-01',
			num: '01',
			title: 'Learn IoT by Doing',
			badgeBg: '#56DA9F',
			badgeColor: '#051020',
			text: 'Pelajari dasar Internet of Things (IoT) melalui pengalaman praktik langsung, mulai dari merakit sirkuit sensor hingga memprogram ESP32 untuk membangun prototipe IoT.',
		},
		{
			id: 'card-04',
			num: '04',
			title: 'Collaborate and Create Together',
			badgeBg: '#4EA5FF',
			badgeColor: '#051020',
			text: 'Kembangkan kemampuan bekerja sama, bertukar ide, dan menyelesaikan tantangan bersama peserta lain melalui workshop berbasis kelompok.',
		},
	],
	[
		{
			id: 'card-02',
			num: '02',
			title: 'Turn Ideas into Real Projects',
			badgeBg: '#FFD516',
			badgeColor: '#051020',
			text: 'Ubah konsep STEM yang kamu pelajari menjadi solusi teknologi melalui proses perancangan, perakitan, pemrograman, dan pengujian prototipe.',
		},
		{
			id: 'card-05',
			num: '05',
			title: 'Experience a Smart City Simulation',
			badgeBg: '#56DA9F',
			badgeColor: '#051020',
			text: 'Integrasikan prototipe IoT ke dalam maket miniatur kota 3D dan saksikan bagaimana sistem yang kamu bangun dapat berperan dalam simulasi Smart Disaster-Resilient City.',
		},
	],
	[
		{
			id: 'card-03',
			num: '03',
			title: 'Explore Smart Disaster Detection',
			badgeBg: '#4EA5FF',
			badgeColor: '#051020',
			text: 'Kenali bagaimana sensor dan teknologi IoT dapat dimanfaatkan untuk mendeteksi kondisi lingkungan serta mendukung sistem peringatan dini bencana.',
		},
	],
];
