import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useFavoritesStore } from './store/useFavoritesStore';

export const App: React.FC = () => {
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  return (
    <>
      <header className="site-header">
        <div className="container header-content">
          <div>
            <Link to="/" className="brand-title">
              Pulso Abierto
            </Link>
            <p className="brand-desc">
              Plataforma de consulta pública de criptomonedas (Versión Final)
            </p>
          </div>
          <nav className="header-nav" aria-label="Navegación principal">
            <span className="fav-badge" aria-live="polite">
              ⭐ Favoritos: {favoritesCount}
            </span>
            <Link to="/" className="nav-link">
              Inicio / Cotizaciones
            </Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/criptomonedas/:id" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            Fuente de datos pública:{' '}
            <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">
              CoinGecko API
            </a>
          </p>
          <p>&copy; 2026 Pulso Abierto — React, TypeScript, Zustand y Vitest.</p>
        </div>
      </footer>
    </>
  );
};
