import React from 'react';
import { CryptoItem } from '../types/crypto';
import { CryptoCard } from './CryptoCard';

interface CryptoListProps {
  items: CryptoItem[];
  totalCount: number;
}

export const CryptoList: React.FC<CryptoListProps> = ({ items, totalCount }) => {
  return (
    <section className="results-section" aria-labelledby="results-heading">
      <div className="results-header">
        <h2 id="results-heading">Cotizaciones Actuales</h2>
        <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
          Mostrando {items.length} de {totalCount} activos
        </span>
      </div>

      <div className="cards-grid">
        {items.map((item) => (
          <CryptoCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
