import {
  Apartment,
  BeachAccess,
  Bed,
  Cottage,
  Forest,
  Groups,
  Home,
  Hotel,
  Luggage,
  Park,
  Restaurant,
} from '@mui/icons-material';
import { normalizar } from './normalizar.js';

// Nombres, íconos y colores por categoría (claves tal cual llegan de la API)
const META = {
  hotel: { nombre: 'Hoteles', icono: Hotel, color: '#00adb7' },
  aparthotel: { nombre: 'Aparthoteles', icono: Apartment, color: '#00adb7' },
  posada: { nombre: 'Posadas', icono: Bed, color: '#ff7300' },
  residencial: { nombre: 'Residenciales', icono: Home, color: '#ff7300' },
  'hostería': { nombre: 'Hosterías', icono: Restaurant, color: '#ff7300' },
  hospedaje: { nombre: 'Hospedajes', icono: Bed, color: '#ff7300' },
  hostel: { nombre: 'Hosteles', icono: Groups, color: '#ff7300' },
  departamento: { nombre: 'Departamentos', icono: Apartment, color: '#ff9b00' },
  cabaña: { nombre: 'Cabañas', icono: Park, color: '#7cc100' },
  'apart cabaña': { nombre: 'Apart Cabañas', icono: Park, color: '#7cc100' },
  'complejo de cabañas': { nombre: 'Complejos de Cabañas', icono: Park, color: '#7cc100' },
  colonia: { nombre: 'Colonias', icono: BeachAccess, color: '#b4d006' },
  camping: { nombre: 'Campings', icono: Forest, color: '#b4d006' },
  'casa de alquiler': { nombre: 'Casas', icono: Cottage, color: '#4a6fa5' },
  'agencias de viajes': { nombre: 'Agencias de Viajes', icono: Luggage, color: '#4a6fa5' },
  otros: { nombre: 'Otros alojamientos', icono: Hotel, color: '#4a6fa5' },
};

// Categorías para el select del formulario (todas excepto "otros")
export const CATEGORIAS_FORMULARIO = Object.keys(META).filter((clave) => clave !== 'otros');

// Orden oficial del menú, usado para tarjetas de la portada y listados públicos
export const ORDEN_CATEGORIAS = [
  'hotel',
  'aparthotel',
  'posada',
  'hospedaje',
  'hostería',
  'residencial',
  'hostel',
  'colonia',
  'departamento',
  'cabaña',
  'apart cabaña',
  'complejo de cabañas',
  'camping',
  'casa de alquiler',
  'agencias de viajes',
];

// Nombres en singular para el mensaje de WhatsApp
const MENSAJE = {
  hotel: 'Hotel',
  aparthotel: 'Aparthotel',
  posada: 'Posada',
  residencial: 'Residencial',
  'hostería': 'Hostería',
  hospedaje: 'Hospedaje',
  hostel: 'Hostel',
  departamento: 'Departamento',
  cabaña: 'Cabañas',
  'apart cabaña': 'Apart Cabañas',
  'complejo de cabañas': 'Complejo de Cabañas',
  colonia: 'Colonia',
  camping: 'Camping',
  'casa de alquiler': 'Casa de Alquiler',
  'agencias de viajes': 'Agencia de Viajes',
};

const META_NORMALIZADA = Object.fromEntries(
  Object.entries(META).map(([clave, valor]) => [normalizar(clave), valor]),
);

const MENSAJE_NORMALIZADO = Object.fromEntries(
  Object.entries(MENSAJE).map(([clave, valor]) => [normalizar(clave), valor]),
);

export function obtenerMetaCategoria(categoria) {
  return META_NORMALIZADA[normalizar(categoria)] || { nombre: categoria, icono: Hotel, color: '#00adb7' };
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
  return ORDEN_CATEGORIAS.find((clave) => slugCategoria(clave) === slug) || null;
}

export const ITEMS_POR_PAGINA = 12;