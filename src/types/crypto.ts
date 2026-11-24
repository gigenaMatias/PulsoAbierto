export interface CryptoItem {
  id: string;
  name: string;
  priceUsd: number;
  lastUpdated: string;
  description: string;
  marketCapRank: number;
  category: string;
}

export interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
  };
}

export type UIState = 'initial' | 'loading' | 'success' | 'empty' | 'error';
