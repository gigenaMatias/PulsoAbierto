import { CoinGeckoResponse, CryptoItem } from '../types/crypto';

const API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';

const METADATA: Record<
  string,
  { name: string; description: string; rank: number; category: string }
> = {
  bitcoin: {
    name: 'Bitcoin',
    description:
      'La primera criptomoneda descentralizada basada en tecnología de prueba de trabajo (PoW), orientada a servir como reserva de valor digital.',
    rank: 1,
    category: 'store-of-value',
  },
  ethereum: {
    name: 'Ethereum',
    description:
      'Plataforma descentralizada de código abierto que permite la ejecución de contratos inteligentes y aplicaciones descentralizadas (dApps).',
    rank: 2,
    category: 'layer1',
  },
  solana: {
    name: 'Solana',
    description:
      'Blockchain de capa 1 de alto rendimiento que combina Proof of History (PoH) con Proof of Stake (PoS) para lograr alta velocidad y bajas comisiones.',
    rank: 5,
    category: 'layer1',
  },
};

export async function fetchCryptoPrices(signal?: AbortSignal): Promise<CryptoItem[]> {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Error HTTP en la solicitud: ${response.status} ${response.statusText}`);
  }

  const data: CoinGeckoResponse = await response.json();
  const timestamp = new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return Object.entries(data).map(([id, values]) => {
    const meta = METADATA[id] || {
      name: id.toUpperCase(),
      description: 'Información general sobre el activo digital.',
      rank: 99,
      category: 'layer1',
    };

    return {
      id,
      name: meta.name,
      priceUsd: values.usd,
      lastUpdated: timestamp,
      description: meta.description,
      marketCapRank: meta.rank,
      category: meta.category,
    };
  });
}
