import React from 'react';
import { Link } from 'react-router-dom';
import { CryptoItem } from '../types/crypto';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { formatUsdPrice } from '../utils/formatUsd';

interface CryptoCardProps {
  item: CryptoItem;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ item }) => {
  const isFavorite = useFavoritesStore((state) => state.favorites.includes(item.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <article className={`crypto-card ${isFavorite ? 'pinned' : ''}`}>
      <div className="card-top">
        <h3>{item.name}</h3>
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
          {isFavorite ? '⭐ Favorito' : '☆ Favorito'}
        </button>
      </div>

      <p className="crypto-price">{formatUsdPrice(item.priceUsd)} USD</p>

      <div className="card-actions">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Actualizado: {item.lastUpdated}
        </span>
        <Link to={`/criptomonedas/${item.id}`} className="detail-link">
          Ver detalle →
        </Link>
      </div>
    </article>
  );
};
