import React from 'react';
import { UIState } from '../types/crypto';

interface StatusMessageProps {
  state: UIState;
  errorMessage?: string;
  onRetry?: () => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ state, errorMessage, onRetry }) => {
  if (state === 'success') return null;

  let className = 'status-container ';
  let content: React.ReactNode = null;

  switch (state) {
    case 'initial':
      className += 'status-initial';
      content = (
        <div className="status-content">
          <p>ℹ️ <strong>Estado Inicial:</strong> Inicie una consulta o modifique los filtros para visualizar la información pública de criptomonedas.</p>
        </div>
      );
      break;

    case 'loading':
      className += 'status-loading';
      content = (
        <div className="status-content">
          <p>⏳ <strong>Cargando...</strong> Consultando precios en tiempo real desde la API pública de CoinGecko.</p>
        </div>
      );
      break;

    case 'empty':
      className += 'status-empty';
      content = (
        <div className="status-content">
          <p>⚠️ <strong>Sin Resultados:</strong> No se encontraron criptomonedas que coincidan con los criterios actuales.</p>
        </div>
      );
      break;

    case 'error':
      className += 'status-error';
      content = (
        <div className="status-content">
          <p>❌ <strong>Error de Operación:</strong> {errorMessage || 'No se pudo completar la comunicación con la API externa.'}</p>
          {onRetry && (
            <button type="button" className="btn-primary" onClick={onRetry}>
              🔄 Volver a intentar consulta
            </button>
          )}
        </div>
      );
      break;
  }

  return (
    <section className={className} aria-live="polite" role="status">
      {content}
    </section>
  );
};
