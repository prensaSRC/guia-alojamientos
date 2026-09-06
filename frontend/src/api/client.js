const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Lee el token persistido en localStorage (si lo hay)
function obtenerToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('token');
}

async function pedir(ruta, opciones = {}) {
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

// GET /api/alojamientos -> todos los alojamientos
export function obtenerAlojamientos() {
  return pedir('/alojamientos');
}

// GET /api/alojamientos/:id -> un alojamiento por id
export function obtenerAlojamiento(id) {
  return pedir(`/alojamientos/${id}`);
}

// ---- Autenticación ----

// POST /api/auth/login
export function iniciarSesionApi(email, password) {
  return pedir('/auth/login', { method: 'POST', body: { email, password } });
}

// POST /api/auth/register (solo desarrollo)
export function registrarUsuarioApi(datos) {
  return pedir('/auth/register', { method: 'POST', body: datos });
}

// ---- Operaciones de escritura (protegidas) ----

// POST /api/alojamientos
export function crearAlojamientoApi(datos) {
  return pedirAutenticado('/alojamientos', { method: 'POST', body: datos });
}

// PUT /api/alojamientos/:id
export function actualizarAlojamientoApi(id, datos) {
  return pedirAutenticado(`/alojamientos/${id}`, { method: 'PUT', body: datos });
}

// DELETE /api/alojamientos/:id
export function eliminarAlojamientoApi(id) {
  return pedirAutenticado(`/alojamientos/${id}`, { method: 'DELETE' });
}