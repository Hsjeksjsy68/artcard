import { FootballCard, PricePoint } from './types';

function generatePriceHistory(startPrice: number, volatility: number, months: number = 6): PricePoint[] {
  const history: PricePoint[] = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = months * 4; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7); // weekly data points
    
    const change = 1 + (Math.random() * volatility * 2 - volatility);
    currentPrice = Math.max(currentPrice * change, 1); // Never drop below $1
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2))
    });
  }
  
  return history;
}

export const cardsDatabase: FootballCard[] = [
  {
    id: 'art-001',
    player: 'Jude Bellingham',
    team: 'Madrid FC',
    position: 'MID',
    year: 2023,
    set: 'ARTCARD Chrome',
    edition: '1st Edition',
    rarity: 'Gold Autograph',
    cardNumber: 'AC-JB',
    imageGradient: 'from-amber-400 via-yellow-600 to-amber-900',
    priceHistory: [],
    currentPrice: 0,
  },
  {
    id: 'art-002',
    player: 'Erling Haaland',
    team: 'Manchester Blue',
    position: 'FWD',
    year: 2023,
    set: 'ARTCARD Chrome',
    edition: '1st Edition',
    rarity: '1-of-1 Shield',
    cardNumber: 'AC-EH',
    imageGradient: 'from-zinc-900 via-zinc-600 to-zinc-900',
    priceHistory: [],
    currentPrice: 0,
  },
  {
    id: 'art-003',
    player: 'Lionel Messi',
    team: 'Miami FC',
    position: 'FWD',
    year: 2023,
    set: 'ARTCARD Chrome',
    edition: '1st Edition',
    rarity: 'Silver Refractor',
    cardNumber: 'AC-LM',
    imageGradient: 'from-slate-300 via-gray-400 to-slate-300',
    priceHistory: [],
    currentPrice: 0,
  },
  {
    id: 'art-004',
    player: 'Kylian Mbappe',
    team: 'Paris SC',
    position: 'FWD',
    year: 2022,
    set: 'ARTCARD Sapphire',
    rarity: 'Base',
    cardNumber: 'AS-KM',
    imageGradient: 'from-blue-600 via-blue-800 to-blue-950',
    priceHistory: [],
    currentPrice: 0,
  },
  {
    id: 'art-005',
    player: 'Lamine Yamal',
    team: 'Barcelona FC',
    position: 'FWD',
    year: 2024,
    set: 'ARTCARD Future Stars',
    rarity: 'Gold Autograph',
    cardNumber: 'FS-LY',
    imageGradient: 'from-amber-300 via-yellow-500 to-amber-700',
    priceHistory: [],
    currentPrice: 0,
  },
  {
    id: 'art-006',
    player: 'Kevin De Bruyne',
    team: 'Manchester Blue',
    position: 'MID',
    year: 2021,
    set: 'ARTCARD Heritage',
    rarity: 'Silver Refractor',
    cardNumber: 'AH-KD',
    imageGradient: 'from-gray-300 via-slate-400 to-gray-500',
    priceHistory: [],
    currentPrice: 0,
  },
  {
    id: 'art-007',
    player: 'Vinicius Jr',
    team: 'Madrid FC',
    position: 'FWD',
    year: 2023,
    set: 'ARTCARD Chrome',
    edition: '1st Edition',
    rarity: 'Base',
    cardNumber: 'AC-VJ',
    imageGradient: 'from-zinc-100 via-zinc-300 to-zinc-400',
    priceHistory: [],
    currentPrice: 0,
  },
  {
    id: 'art-008',
    player: 'Phil Foden',
    team: 'Manchester Blue',
    position: 'MID',
    year: 2023,
    set: 'ARTCARD Chrome',
    edition: '1st Edition',
    rarity: 'Gold Autograph',
    cardNumber: 'AC-PF',
    imageGradient: 'from-yellow-400 via-amber-600 to-yellow-800',
    priceHistory: [],
    currentPrice: 0,
  }
];

// Initialize price history for mock data
cardsDatabase.forEach(card => {
  let startPrice = 10;
  let volatility = 0.05;

  if (card.rarity === '1-of-1 Shield') { startPrice = 5000; volatility = 0.1; }
  else if (card.rarity === 'Gold Autograph') { startPrice = 450; volatility = 0.08; }
  else if (card.rarity === 'Silver Refractor') { startPrice = 45; volatility = 0.06; }
  
  card.priceHistory = generatePriceHistory(startPrice, volatility);
  card.currentPrice = card.priceHistory[card.priceHistory.length - 1].price;
});
