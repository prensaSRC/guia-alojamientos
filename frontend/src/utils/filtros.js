import { normalizar } from './normalizar.js';
import { OTROS_GRUPO } from './categorias.js';

// Aplica los filtros de categoría y búsqueda (tolerante a tildes)
export function filtrarAlojamientos(alojamientos, categoria, busqueda) {
  let filtrados = alojamientos || [];
  const termino = normalizar(busqueda);

  if (categoria && categoria !== 'todos') {
    const otrosNormalizados = OTROS_GRUPO.map(normalizar);
    const destino = normalizar(categoria);
    filtrados = filtrados.filter((item) => {
      const categoriaItem = normalizar(item.categoria);
      if (destino === 'otros') return otrosNormalizados.includes(categoriaItem);
      return categoriaItem === destino;
    });
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