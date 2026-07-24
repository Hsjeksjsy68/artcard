export type Rarity = 'Base' | 'Silver Refractor' | 'Gold Autograph' | '1-of-1 Shield';

export interface PricePoint {
  date: string;
  price: number;
}

export interface FootballCard {
  id: string;
  player: string;
  team: string;
  position: string;
  year: number;
  set: string;
  edition: string;
  rarity: Rarity;
  cardNumber: string;
  imageUrl?: string;
  imageGradient: string;
  priceHistory: PricePoint[];
  currentPrice: number;
}
