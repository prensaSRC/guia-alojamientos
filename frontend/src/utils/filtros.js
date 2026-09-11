import { normalizar } from './normalizar.js';
import { ORDEN_CATEGORIAS } from './categorias.js';

const INDICE_CATEGORIA = new Map(ORDEN_CATEGORIAS.map((clave, indice) => [normalizar(clave), indice]));

// Orden público: por categoría (orden del menú) y dentro alfabéticamente.
// Las categorías desconocidas se envían al final.
export function ordenarAlojamientos(alojamientos) {
  return [...(alojamientos || [])].sort((a, b) => {
    const indiceA = INDICE_CATEGORIA.get(normalizar(a.categoria)) ?? 999;
    const indiceB = INDICE_CATEGORIA.get(normalizar(b.categoria)) ?? 999;
    if (indiceA !== indiceB) return indiceA - indiceB;
    return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }) || a.id - b.id;
  });
}

// Aplica los filtros de categoría y búsqueda (tolerante a tildes)
export function filtrarAlojamientos(alojamientos, categoria, busqueda) {
  let filtrados = alojamientos || [];
  const termino = normalizar(busqueda);

  if (categoria) {
    const destino = normalizar(categoria);
    filtrados = filtrados.filter((item) => normalizar(item.categoria) === destino);
  }

  if (termino) {
    filtrados = filtrados.filter((item) => {
      const texto = normalizar(`${item.nombre} ${item.direccion} ${item.telefono} ${item.web || ''}`);
      return texto.includes(termino);
    });
  }

  return filtrados;
}

// Divide los datos filtrados según la página actual
export function paginar(datos, pagina, porPagina) {
  const totalItems = datos.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItems / porPagina));
  const paginaActual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaActual - 1) * porPagina;

  return {
    items: datos.slice(inicio, inicio + porPagina),
    totalItems,
    totalPaginas,
    paginaActual,
  };
}