export interface MerchandiseBundle {
  name: string;
  contents: string;
  price: number;
  image: string;
}

export const merchandiseBundles: MerchandiseBundle[] = [
  { name: 'Paket 1', contents: 'Enamel & Badges', price: 26000, image: '/merchandise/paket-1' },
  { name: 'Paket 2', contents: 'Strap & Badges', price: 16000, image: '/merchandise/paket-2' },
  { name: 'Paket 3', contents: 'Gantungan Kunci & Stiker', price: 12000, image: '/merchandise/paket-3' },
  { name: 'Paket 4', contents: 'Enamel, Badges, Strap, Gantungan Kunci & Stiker', price: 55000, image: '/merchandise/paket-4' },
];

export const merchandiseOrderUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScJgo2XbU2SQLAQ9pP8dudYAzuhqfksr2xwMTeL1lD_rLry4g/viewform';
