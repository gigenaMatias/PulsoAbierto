import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CryptoItem } from '../types/crypto';
import { fetchCryptoPrices } from '../services/cryptoService';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { formatUsdPrice } from '../utils/formatUsd';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<CryptoItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const isFavorite = useFavoritesStore((state) =>
    id ? state.favorites.includes(id.toLowerCase()) : false
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    fetchCryptoPrices()
      .then((data) => {
        if (!isMounted) return;
        const found = data.find((c) => c.id.toLowerCase() === id?.toLowerCase());
        if (found) {
          setItem(found);
        } else {
          setError(
            `El identificador "${id}" no se corresponde con ningún registro admitido por la plataforma.`
          );
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Error al recuperar los detalles de la criptomoneda.';
        setError(msg);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="status-container status-loading" role="status" aria-live="polite">
        <p>
          ⏳ <strong>Cargando detalles...</strong> Obteniendo la información actualizada de la
          criptomoneda.
        </p>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="status-container status-error" role="status" aria-live="polite">
        <h2>⚠️ Recurso No Encontrado</h2>
        <p>{error || 'No se pudo localizar el activo solicitado.'}</p>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            ← Volver al Listado Principal
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="detail-card">
      <header className="detail-header">
        <div>
          <h2>
            {item.name} ({item.id.toUpperCase()})
          </h2>
          <span className="brand-desc">Categoría: {item.category}</span>
        </div>

        <div className="detail-actions">
          <button
            type="button"
            className={`pin-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => toggleFavorite(item.id)}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Quitar ${item.name} de favoritos`
                : `Marcar ${item.name} como favorito`
            }
          >
            {isFavorite ? '⭐ En Favoritos' : '☆ Agregar a Favoritos'}
          </button>

          <Link to="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
            ← Volver al Listado
          </Link>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Cotización Actual (USD)</span>
          <span className="detail-value" style={{ color: 'var(--primary)' }}>
            {formatUsdPrice(item.priceUsd)}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Ranking de Capitalización</span>
          <span className="detail-value">#{item.marketCapRank}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Última Actualización</span>
          <span className="detail-value">{item.lastUpdated}</span>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', lineHeight: '1.7' }}>
        <h3>Descripción e Información del Proyecto</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-dark)' }}>{item.description}</p>
      </div>
    </article>
  );
};
