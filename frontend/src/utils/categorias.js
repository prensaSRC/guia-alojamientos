import { Hotel } from '@mui/icons-material';
import { normalizar } from './normalizar.js';
import { GUIA_ACTIVA } from '../guia.js';

// Categorías del rubro activo (definidas en guia.js)
const { META, ORDEN, MENSAJE } = GUIA_ACTIVA.categorias;

// Orden oficial de la guía activa, usado para tarjetas de la portada y listados públicos
export const ORDEN_CATEGORIAS = ORDEN;

// Categorías para el select del formulario (todas excepto "otros")
export const CATEGORIAS_FORMULARIO = Object.keys(META).filter((clave) => clave !== 'otros');

const META_NORMALIZADA = Object.fromEntries(
  Object.entries(META).map(([clave, valor]) => [normalizar(clave), valor]),
);

const MENSAJE_NORMALIZADO = Object.fromEntries(
  Object.entries(MENSAJE).map(([clave, valor]) => [normalizar(clave), valor]),
);

export function obtenerMetaCategoria(categoria) {
  return (
    META_NORMALIZADA[normalizar(categoria)] || {
      nombre: categoria,
      icono: Hotel,
      color: GUIA_ACTIVA.color.main,
    }
  );
}

export function obtenerNombreMensaje(categoria) {
  return MENSAJE_NORMALIZADO[normalizar(categoria)] || categoria;
}

// Slug único por categoría para las URLs (sin tildes, espacios como guiones)
export function slugCategoria(clave) {
  return normalizar(clave).replace(/\s+/g, '-');
}

// Dado un slug de la URL, devuelve la clave de categoría (o null si no existe)
export function claveDesdeSlug(slug) {
  return ORDEN.find((clave) => slugCategoria(clave) === slug) || null;
}

export const ITEMS_POR_PAGINA = 12;