import { useCallback, useEffect, useState } from 'react';
import { obtenerAlojamientos } from '../api/client.js';
import { ordenarAlojamientos } from '../utils/filtros.js';
import { GUIA_ACTIVA } from '../guia.js';

const MENSAJE_ERROR = `Error al cargar los ${GUIA_ACTIVA.sustantivo.plural}`;

// Hook que carga los registros de la guía activa desde la API, ordenados por categoría y nombre
export function useAlojamientos() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerAlojamientos();
      setAlojamientos(ordenarAlojamientos(datos));
    } catch (err) {
      setError(err.message || MENSAJE_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    obtenerAlojamientos()
      .then((datos) => {
        if (!activo) return;
        setAlojamientos(ordenarAlojamientos(datos));
        setError(null);
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.message || MENSAJE_ERROR);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { alojamientos, loading, error, recargar };
}