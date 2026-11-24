import React from 'react';

interface ControlPanelProps {
  searchText: string;
  categoryFilter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onRefresh: () => void;
  errors: { searchText?: string; categoryFilter?: string };
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  searchText,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
  onSubmit,
  onRefresh,
  errors,
  isLoading,
}) => {
  return (
    <section className="control-section" aria-labelledby="control-heading">
      <h2 id="control-heading">Búsqueda y Filtrado de Criptomonedas</h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="search-input">Buscar por Nombre / ID:</label>
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="Ej. bitcoin..."
              value={searchText}
              onChange={onSearchChange}
              aria-invalid={!!errors.searchText}
              aria-describedby={errors.searchText ? 'search-error' : undefined}
            />
            {errors.searchText && (
              <span id="search-error" className="field-error" role="alert">
                ⚠️ {errors.searchText}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category-select">Categoría / Tipo:</label>
            <select
              id="category-select"
              className="form-control"
              value={categoryFilter}
              onChange={onCategoryChange}
              aria-invalid={!!errors.categoryFilter}
              aria-describedby={errors.categoryFilter ? 'category-error' : undefined}
            >
              <option value="all">Todas las categorías</option>
              <option value="layer1">Capa 1 (Layer 1)</option>
              <option value="store-of-value">Reserva de Valor</option>
              <option value="defi">DeFi</option>
            </select>
            {errors.categoryFilter && (
              <span id="category-error" className="field-error" role="alert">
                ⚠️ {errors.categoryFilter}
              </span>
            )}
          </div>

          <div className="form-group" style={{ flexDirection: 'row', gap: '0.5rem' }}>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ flex: 1 }}>
              {isLoading ? 'Consultando...' : 'Aplicar Filtro'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onRefresh}
              disabled={isLoading}
              title="Actualizar cotizaciones desde CoinGecko"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
