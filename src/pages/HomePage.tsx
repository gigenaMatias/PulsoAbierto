import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CryptoItem, UIState } from '../types/crypto';
import { fetchCryptoPrices } from '../services/cryptoService';
import { searchSchema } from '../schemas/searchSchema';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { ControlPanel } from '../components/ControlPanel';
import { StatusMessage } from '../components/StatusMessage';
import { CryptoList } from '../components/CryptoList';

export const HomePage: React.FC = () => {
  const [cryptos, setCryptos] = useState<CryptoItem[]>([]);
  const [uiState, setUiState] = useState<UIState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [searchText, setSearchText] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formErrors, setFormErrors] = useState<{ searchText?: string; categoryFilter?: string }>({});

  const [activeSearch, setActiveSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const favorites = useFavoritesStore((state) => state.favorites);
  const latestRequestId = useRef<number>(0);

  const loadData = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setUiState('loading');
    setErrorMessage('');

    try {
      const data = await fetchCryptoPrices();
      if (requestId !== latestRequestId.current) return;
      setCryptos(data);
      setUiState(data.length === 0 ? 'empty' : 'success');
    } catch (err: unknown) {
      if (requestId !== latestRequestId.current) return;
      const msg = err instanceof Error ? err.message : 'Error desconocido al consultar la API.';
      setErrorMessage(msg);
      setUiState('error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (formErrors.searchText) {
      setFormErrors((prev) => ({ ...prev, searchText: undefined }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    if (formErrors.categoryFilter) {
      setFormErrors((prev) => ({ ...prev, categoryFilter: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = searchSchema.safeParse({
      searchText,
      categoryFilter,
    });

    if (!validationResult.success) {
      const formattedErrors: { searchText?: string; categoryFilter?: string } = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path.includes('searchText')) {
          formattedErrors.searchText = issue.message;
        }
        if (issue.path.includes('categoryFilter')) {
          formattedErrors.categoryFilter = issue.message;
        }
      });
      setFormErrors(formattedErrors);
      return;
    }

    setFormErrors({});
    setActiveSearch(validationResult.data.searchText.toLowerCase());
    setActiveCategory(validationResult.data.categoryFilter);
  };

  const filteredCryptos = useMemo(() => {
    return cryptos
      .filter((item) => {
        const matchesName =
          item.name.toLowerCase().includes(activeSearch) ||
          item.id.toLowerCase().includes(activeSearch);
        const matchesCat = activeCategory === 'all' || item.category === activeCategory;
        return matchesName && matchesCat;
      })
      .sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        return bFav - aFav;
      });
  }, [cryptos, activeSearch, activeCategory, favorites]);

  const effectiveUIState: UIState = useMemo(() => {
    if (uiState === 'loading' || uiState === 'error' || uiState === 'initial') return uiState;
    if (filteredCryptos.length === 0) return 'empty';
    return 'success';
  }, [uiState, filteredCryptos.length]);

  return (
    <>
      <ControlPanel
        searchText={searchText}
        categoryFilter={categoryFilter}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSubmit={handleSubmit}
        onRefresh={loadData}
        errors={formErrors}
        isLoading={uiState === 'loading'}
      />

      <StatusMessage
        state={effectiveUIState}
        errorMessage={errorMessage}
        onRetry={loadData}
      />

      {effectiveUIState === 'success' && (
        <CryptoList items={filteredCryptos} totalCount={cryptos.length} />
      )}
    </>
  );
};
