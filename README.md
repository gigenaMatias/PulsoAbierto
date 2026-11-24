# Pulso Abierto — Versión Final

**Pulso Abierto** es una aplicación web para consultar precios públicos en USD de criptomonedas (Bitcoin, Ethereum y Solana), filtrar por texto o categoría, inspeccionar el detalle de cada activo y administrar una lista de favoritos persistente entre recargas.

## Tecnologías Principales
- **React 18** y **TypeScript**
- **Vite** (empaquetado, servidor de desarrollo y vista previa de build)
- **React Router DOM v6** (navegación entre listado `/` y vista de detalle `/criptomonedas/:id`)
- **Zod** (validación de formulario de búsqueda y filtros)
- **Zustand** con middleware `persist` (`localStorage`) para favoritos globales
- **Vitest** y **React Testing Library** para pruebas automatizadas

## Instalación y Comandos del Proyecto
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
3. Ejecutar pruebas automatizadas:
   ```bash
   npm test
   ```
4. Generar el build productivo:
   ```bash
   npm run build
   ```
5. Comprobar el build productivo mediante vista previa local:
   ```bash
   npm run preview
   ```

## Variables de Entorno
La consulta pública a CoinGecko utilizada en la aplicación no requiere clave secreta. Opcionalmente se puede definir `VITE_APP_NAME` en un archivo `.env` local (ver `.env.example`). No se versionan archivos `.env` con credenciales.

## Enlaces de Publicación
- **Repositorio de GitHub:** `https://github.com/gigenaMatias/PulsoAbierto.git`
- **Aplicación desplegada en Vercel:** `https://pulso-abierto-ten.vercel.app`

## Mejora de Mantenibilidad Aplicada
- **Problema identificado:** El formato monetario en USD (`toLocaleString('en-US', { minimumFractionDigits: 2 })`) se repetía directamente en componentes de presentación (`CryptoCard.tsx` y `DetailPage.tsx`).
- **Cambio realizado:** Se extrajo la función auxiliar tipada `formatUsdPrice` en `src/utils/formatUsd.ts` y se reutilizó en ambas vistas sin alterar el comportamiento visual ni funcional.
- **Comprobación sin regresiones:** Se verificó la compilación TypeScript + Vite (`npm run build`), la ejecución de las pruebas (`npm test`) y los recorridos principales de la interfaz.

## Verificación final
- **Pruebas ejecutadas:** `npm test` (Vitest + Testing Library)
- **Build generado correctamente:** `npm run build` (`tsc && vite build` -> `dist/`)
- **Preview comprobado:** `npm run preview` (carga inicial, consulta de precios, navegación a detalle y regreso, favoritos persistentes y validación de formulario)
- **Despliegue realizado:** Publicado en Vercel vinculado al repositorio de GitHub (`https://pulso-abierto-ten.vercel.app`)
- **Fecha de verificación:** 24 de noviembre de 2026
