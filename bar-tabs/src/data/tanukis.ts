export type DrunkLevel = 'sober' | 'tipsy' | 'merry' | 'drunk' | 'plastered' | 'blacked-out';

export interface Tanuki {
  id: string;
  name: string;
  nameJp: string;
  personality: string;
  favoriteSake: string;
  avatar: string; // emoji for now
  drunkThresholds: {
    tipsy: number;
    merry: number;
    drunk: number;
    plastered: number;
    blackedOut: number;
  };
}

export const tanukis: Tanuki[] = [
  {
    id: 'pon',
    name: 'Ponkichi',
    nameJp: 'ポン吉',
    personality: 'The jolly elder. Loves telling stories and drum performances.',
    favoriteSake: 'palace-daiginjo',
    avatar: '🦝',
    drunkThresholds: { tipsy: 3, merry: 6, drunk: 10, plastered: 15, blackedOut: 20 },
  },
  {
    id: 'tama',
    name: 'Tama',
    nameJp: 'タマ',
    personality: 'Young and mischievous. Always trying to shapeshift into teapots.',
    favoriteSake: 'belly-drum-sparkling',
    avatar: '🦝',
    drunkThresholds: { tipsy: 2, merry: 4, drunk: 7, plastered: 10, blackedOut: 14 },
  },
  {
    id: 'sake-master',
    name: 'Sake Master Goro',
    nameJp: '五郎親方',
    personality: 'The palace sommelier. Has an iron liver and refined taste.',
    favoriteSake: 'legendary-aged',
    avatar: '🦝',
    drunkThresholds: { tipsy: 8, merry: 15, drunk: 25, plastered: 40, blackedOut: 60 },
  },
  {
    id: 'hana',
    name: 'Hana',
    nameJp: '花',
    personality: 'Elegant and poetic. Composes haiku when tipsy.',
    favoriteSake: 'moonlight-special',
    avatar: '🦝',
    drunkThresholds: { tipsy: 2, merry: 5, drunk: 8, plastered: 12, blackedOut: 16 },
  },
  {
    id: 'big-belly',
    name: 'Big Belly Roku',
    nameJp: '六腹',
    personality: 'Legendary drum performer. His belly is famous across the land.',
    favoriteSake: 'cloudy-nigori',
    avatar: '🦝',
    drunkThresholds: { tipsy: 5, merry: 10, drunk: 18, plastered: 28, blackedOut: 40 },
  },
];

export const getDrunkLevel = (tanuki: Tanuki, drunkPoints: number): DrunkLevel => {
  if (drunkPoints >= tanuki.drunkThresholds.blackedOut) return 'blacked-out';
  if (drunkPoints >= tanuki.drunkThresholds.plastered) return 'plastered';
  if (drunkPoints >= tanuki.drunkThresholds.drunk) return 'drunk';
  if (drunkPoints >= tanuki.drunkThresholds.merry) return 'merry';
  if (drunkPoints >= tanuki.drunkThresholds.tipsy) return 'tipsy';
  return 'sober';
};

export const drunkLevelEmoji: Record<DrunkLevel, string> = {
  'sober': '🍵',
  'tipsy': '😊',
  'merry': '😄',
  'drunk': '🥴',
  'plastered': '🤪',
  'blacked-out': '💀',
};

export const drunkLevelLabels: Record<DrunkLevel, string> = {
  'sober': 'Sober',
  'tipsy': 'Tipsy',
  'merry': 'Merry',
  'drunk': 'Drunk',
  'plastered': 'Plastered',
  'blacked-out': 'Blacked Out',
};

export const getTanukiById = (id: string): Tanuki | undefined => {
  return tanukis.find((t) => t.id === id);
};
