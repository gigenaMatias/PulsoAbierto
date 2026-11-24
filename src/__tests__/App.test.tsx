import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { useFavoritesStore } from '../store/useFavoritesStore';
import * as cryptoService from '../services/cryptoService';

const mockItems = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    priceUsd: 64321,
    lastUpdated: '10:00:00',
    description: 'Reserva de valor digital.',
    marketCapRank: 1,
    category: 'store-of-value',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    priceUsd: 3452,
    lastUpdated: '10:00:00',
    description: 'Contratos inteligentes.',
    marketCapRank: 2,
    category: 'layer1',
  },
];

describe('Integración de comportamientos observables - Pulso Abierto', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    useFavoritesStore.setState({ favorites: [] });
  });

  it('muestra estado de carga seguido de resultados exitosos', async () => {
    let resolveFetch!: (value: typeof mockItems) => void;
    vi.spyOn(cryptoService, 'fetchCryptoPrices').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent(/Cargando/i);

    resolveFetch(mockItems);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Bitcoin' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Ethereum' })).toBeInTheDocument();
    });
  });

  it('permite marcar y desmarcar una criptomoneda reflejando el cambio en la interfaz', async () => {
    const user = userEvent.setup();
    vi.spyOn(cryptoService, 'fetchCryptoPrices').mockResolvedValueOnce(mockItems);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const favBtn = await screen.findByRole('button', {
      name: /Marcar Bitcoin como favorito/i,
    });
    expect(favBtn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/Favoritos: 0/i)).toBeInTheDocument();

    await user.click(favBtn);

    const unfavBtn = screen.getByRole('button', {
      name: /Quitar Bitcoin de favoritos/i,
    });
    expect(unfavBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Favoritos: 1/i)).toBeInTheDocument();

    await user.click(unfavBtn);
    expect(screen.getByText(/Favoritos: 0/i)).toBeInTheDocument();
  });

  it('muestra mensaje de error y permite reintentar exitosamente', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .spyOn(cryptoService, 'fetchCryptoPrices')
      .mockRejectedValueOnce(new Error('Fallo de red simulado'))
      .mockResolvedValueOnce(mockItems);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/Error de Operación/i);
      expect(screen.getByRole('status')).toHaveTextContent(/Fallo de red simulado/i);
    });

    const retryBtn = screen.getByRole('button', { name: /Volver a intentar consulta/i });
    await user.click(retryBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(screen.getByRole('heading', { name: 'Bitcoin' })).toBeInTheDocument();
    });
  });
});
