import { useCallback, useEffect, useState } from 'react';
import { obtenerAlojamientos } from '../api/client.js';

// Hook que carga los alojamientos desde la API
export function useAlojamientos() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await obtenerAlojamientos();
      setAlojamientos(datos);
    } catch (err) {
      setError(err.message || 'Error al cargar los alojamientos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    obtenerAlojamientos()
      .then((datos) => {
        if (!activo) return;
        setAlojamientos(datos);
        setError(null);
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.message || 'Error al cargar los alojamientos');
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