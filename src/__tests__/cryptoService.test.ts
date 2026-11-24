import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCryptoPrices } from '../services/cryptoService';

describe('Servicio cryptoService (fetchCryptoPrices)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve datos tipados y transformados cuando la respuesta HTTP es exitosa (ok: true)', async () => {
    const mockPayload = {
      bitcoin: { usd: 65000 },
      ethereum: { usd: 3500 },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockPayload,
    } as Response);

    const result = await fetchCryptoPrices();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 'bitcoin',
      name: 'Bitcoin',
      priceUsd: 65000,
      category: 'store-of-value',
    });
    expect(result[1]).toMatchObject({
      id: 'ethereum',
      name: 'Ethereum',
      priceUsd: 3500,
      category: 'layer1',
    });
  });

  it('lanza un error descriptivo cuando la respuesta HTTP falla (ok: false)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    await expect(fetchCryptoPrices()).rejects.toThrow(
      'Error HTTP en la solicitud: 429 Too Many Requests'
    );
  });
});
