import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <section
      className="status-container status-error"
      style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2>Página No Encontrada</h2>
      <p style={{ margin: '1rem 0 2rem 0' }}>
        La ruta a la que intentas acceder no existe en la aplicación Pulso Abierto.
      </p>
      <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
        🏠 Ir al Inicio
      </Link>
    </section>
  );
};
