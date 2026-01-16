export interface Sake {
  id: string;
  name: string;
  nameJp: string;
  type: 'junmai' | 'ginjo' | 'daiginjo' | 'nigori' | 'sparkling' | 'hot';
  price: number; // per tokkuri (flask)
  drunkPoints: number; // how much it affects the drinker
  description: string;
}

export const sakeMenu: Sake[] = [
  {
    id: 'house-junmai',
    name: 'House Junmai',
    nameJp: '純米酒',
    type: 'junmai',
    price: 800,
    drunkPoints: 1,
    description: 'Our everyday pure rice sake. Reliable and smooth.',
  },
  {
    id: 'tanuki-ginjo',
    name: 'Tanuki Ginjo',
    nameJp: '狸吟醸',
    type: 'ginjo',
    price: 1200,
    drunkPoints: 2,
    description: 'Premium sake brewed by moonlight. Fruity and fragrant.',
  },
  {
    id: 'palace-daiginjo',
    name: 'Palace Daiginjo',
    nameJp: '御殿大吟醸',
    type: 'daiginjo',
    price: 2500,
    drunkPoints: 3,
    description: 'The finest sake in the palace. Reserved for special guests.',
  },
  {
    id: 'cloudy-nigori',
    name: 'Cloudy Dreams',
    nameJp: 'にごり酒',
    type: 'nigori',
    price: 1000,
    drunkPoints: 2,
    description: 'Unfiltered and creamy. Makes tanukis extra merry.',
  },
  {
    id: 'belly-drum-sparkling',
    name: 'Belly Drum Fizz',
    nameJp: '腹鼓スパークリング',
    type: 'sparkling',
    price: 1500,
    drunkPoints: 2,
    description: 'Sparkling sake that makes bellies drum-worthy.',
  },
  {
    id: 'shapeshifter-hot',
    name: 'Shapeshifter Warm',
    nameJp: '化け狸燗',
    type: 'hot',
    price: 900,
    drunkPoints: 1,
    description: 'Served warm. Said to enhance transformation abilities.',
  },
  {
    id: 'legendary-aged',
    name: 'Legendary 100-Year',
    nameJp: '百年古酒',
    type: 'daiginjo',
    price: 10000,
    drunkPoints: 5,
    description: 'Aged for a century. One sip and you might see teapots.',
  },
  {
    id: 'moonlight-special',
    name: 'Full Moon Special',
    nameJp: '満月限定',
    type: 'ginjo',
    price: 3000,
    drunkPoints: 4,
    description: 'Only available during full moons. Extremely potent.',
  },
];

export const getSakeById = (id: string): Sake | undefined => {
  return sakeMenu.find((s) => s.id === id);
};

export const getSakePrice = (id: string, quantity: number): number => {
  const sake = getSakeById(id);
  return sake ? sake.price * quantity : 0;
};
