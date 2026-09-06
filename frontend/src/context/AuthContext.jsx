import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { iniciarSesionApi, registrarUsuarioApi } from '../api/client.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuario';

// oxlint-disable-next-line react/only-export-components
function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(USUARIO_KEY) || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [usuario, setUsuario] = useState(() => leerUsuario());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const datos = await iniciarSesionApi(email, password);
      localStorage.setItem(TOKEN_KEY, datos.token);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(datos.usuario));
      setToken(datos.token);
      setUsuario(datos.usuario);
      return datos.usuario;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (datos) => {
    setLoading(true);
    setError(null);
    try {
      const datosRegistrados = await registrarUsuarioApi(datos);
      return datosRegistrados.usuario;
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    setToken(null);
    setUsuario(null);
    setError(null);
  }, []);

  const valor = useMemo(
    () => ({ token, usuario, loading, error, login, register, logout }),
    [token, usuario, loading, error, login, register, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return contexto;
}