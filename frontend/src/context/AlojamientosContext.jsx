import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAlojamientos } from '../hooks/useAlojamientos.js';
import { filtrarAlojamientos, paginar } from '../utils/filtros.js';
import { ITEMS_POR_PAGINA, obtenerMetaCategoria } from '../utils/categorias.js';

const AlojamientosContext = createContext(null);

export function AlojamientosProvider({ children }) {
  const { alojamientos, loading, error, recargar } = useAlojamientos();

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [pagina, setPagina] = useState(1);

  const cambiarBusqueda = useCallback((valor) => {
    setBusqueda(valor);
    setPagina(1);
  }, []);

  const cambiarCategoria = useCallback((valor) => {
    setCategoria(valor);
    setPagina(1);
  }, []);

  const cambiarPagina = useCallback((valor) => {
    setPagina(valor);
  }, []);

  const filtrados = useMemo(
    () => filtrarAlojamientos(alojamientos, categoria, busqueda),
    [alojamientos, categoria, busqueda],
  );

  const paginacion = useMemo(
    () => paginar(filtrados, pagina, ITEMS_POR_PAGINA),
    [filtrados, pagina],
  );

  const meta = useMemo(
    () => obtenerMetaCategoria(categoria),
    [categoria],
  );

  const valor = useMemo(
    () => ({
      alojamientos,
      loading,
      error,
      recargar,
      categoria,
      cambiarCategoria,
      busqueda,
      cambiarBusqueda,
      pagina,
      cambiarPagina,
      filtrados,
      paginacion,
      metaCategoria: meta,
    }),
    [
      alojamientos,
      loading,
      error,
      recargar,
      categoria,
      cambiarCategoria,
      busqueda,
      cambiarBusqueda,
      pagina,
      cambiarPagina,
      filtrados,
      paginacion,
      meta,
    ],
  );

  return <AlojamientosContext.Provider value={valor}>{children}</AlojamientosContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAlojamientosContext() {
  const contexto = useContext(AlojamientosContext);
  if (!contexto) {
    throw new Error('useAlojamientosContext debe usarse dentro de AlojamientosProvider');
  }
  return contexto;
}