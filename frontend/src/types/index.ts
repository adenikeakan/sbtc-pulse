export interface User {
  stxAddress: string;
  btcAddress?: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: number;
}

export interface PriceData {
  price: number;
  timestamp: number;
  change24h: number;
}