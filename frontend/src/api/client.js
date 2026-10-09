const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_LOCAL_DATA = import.meta.env.VITE_USE_LOCAL_DATA === 'true';
import { GUIA_ACTIVA, GUIAS } from '../guia.js';

// Ruta de la API según el rubro (ej. "/alojamientos", "/gastronomia").
// Si no se pasa rubro, usa el rubro activo del sitio compilado.
function rutaRubro(rubro) {
  const guia = (rubro && GUIAS[rubro]) || GUIA_ACTIVA;
  return guia.ruta;
}

// Lee el token persistido en localStorage (si lo hay)
function obtenerToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('token');
}

async function pedirLocal(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) {
    throw new Error(`Error cargando datos locales (${respuesta.status})`);
  }
  return respuesta.json();
}

async function pedir(ruta, opciones = {}) {
  // Modo local: servir desde /data/{rubro}.json
  if (USE_LOCAL_DATA) {
    const guia = GUIA_ACTIVA;
    const localPath = `/data/${guia.rubro}.json`;
    return pedirLocal(localPath);
  }

  const config = {
    method: opciones.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
    ...(opciones.body ? { body: JSON.stringify(opciones.body) } : {}),
  };

  const respuesta = await fetch(`${API_URL}${ruta}`, config);

  if (!respuesta.ok) {
    let mensaje = `Error de red (${respuesta.status})`;
    try {
      const datos = await respuesta.json();
      mensaje = datos.message || mensaje;
    } catch {
      // respuesta sin JSON
    }
    throw new Error(mensaje);
  }

  if (respuesta.status === 204) return null;
  return respuesta.json();
}

// Interceptor: agrega automáticamente el token JWT a las peticiones autenticadas
export function pedirAutenticado(ruta, opciones = {}) {
  const token = obtenerToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return pedir(ruta, {
    ...opciones,
    headers: { ...headers, ...(opciones.headers || {}) },
  });
}

// GET /api/:rubro -> todos los registros de ese rubro
export function obtenerAlojamientos(rubro) {
  return pedir(rutaRubro(rubro));
}

// GET /api/:rubro/:id -> un registro por id
export function obtenerAlojamiento(id, rubro) {
  if (USE_LOCAL_DATA) {
    const guia = (rubro && GUIAS[rubro]) || GUIA_ACTIVA;
    return pedirLocal(`/data/${guia.rubro}.json`).then(data => {
      const item = data.find(d => d.id == id);
      if (!item) throw new Error('No encontrado');
      return item;
    });
  }
  return pedir(`${rutaRubro(rubro)}/${id}`);
}

// ---- Autenticación ----

// POST /api/auth/login
export function iniciarSesionApi(email, password) {
  if (USE_LOCAL_DATA) {
    throw new Error('Autenticación no disponible en modo local');
  }
  return pedir('/auth/login', { method: 'POST', body: { email, password } });
}

// POST /api/auth/register (solo desarrollo)
export function registrarUsuarioApi(datos) {
  if (USE_LOCAL_DATA) {
    throw new Error('Registro no disponible en modo local');
  }
  return pedir('/auth/register', { method: 'POST', body: datos });
}

// ---- Operaciones de escritura (protegidas) ----

// POST /api/:rubro
export function crearAlojamientoApi(datos, rubro) {
  if (USE_LOCAL_DATA) {
    throw new Error('CRUD no disponible en modo local');
  }
  return pedirAutenticado(rutaRubro(rubro), { method: 'POST', body: datos });
}

// PUT /api/:rubro/:id
export function actualizarAlojamientoApi(id, datos, rubro) {
  if (USE_LOCAL_DATA) {
    throw new Error('CRUD no disponible en modo local');
  }
  return pedirAutenticado(`${rutaRubro(rubro)}/${id}`, { method: 'PUT', body: datos });
}

// DELETE /api/:rubro/:id
export function eliminarAlojamientoApi(id, rubro) {
  if (USE_LOCAL_DATA) {
    throw new Error('CRUD no disponible en modo local');
  }
  return pedirAutenticado(`${rutaRubro(rubro)}/${id}`, { method: 'DELETE' });
}