import { obtenerNombreMensaje } from './categorias.js';

function mensajeWhatsApp(item) {
  const categoria = obtenerNombreMensaje(item.categoria);
  return `Hola, lo contacto desde la Guía de Alojamientos de Santa Rosa de Calamuchita para consultar disponibilidad en ${categoria} ${item.nombre}.`;
}

// Áreas telefónicas de Argentina detectadas en la guía (Buenos Aires,
// Córdoba, Rosario, Mendoza, Neuquén, etc.). Se ordenan de mayor a menor
// longitud para casar primero las de 5 dígitos (03546, 02954...).
const AREAS_ARGENTINA = [
  '03546', '03547', '02954', '02473', '02477', '02478', '02302',
  '03385', '03406', '03413', '03416', '03437', '03447', '03462',
  '03464', '03468', '03471', '03472', '03476', '03489', '03492',
  '03525', '03532', '03533', '03535', '03536', '03537', '03543',
  '03564', '03571', '03585', '0223', '0236', '0247', '0260', '0280',
  '0295', '0297', '03382', '0341', '0342', '0347', '0351', '0353',
  '0358', '011'
].sort((a, b) => b.length - a.length);

// Construye las tres salidas a partir de una área (con 0 inicial) y el
// número local (sin área). Aplica los prefijos celulares "15"/"9".
function armarTelefono(area, localCrudo, esCelular) {
  let local = (localCrudo || '').replace(/\D+/g, '');
  if (esCelular) {
    if (local.startsWith('15')) local = local.slice(2); // prefijo histórico
    else if (local.startsWith('9')) local = local.slice(1);
    return { e164: `+549${area.slice(1)}${local}`, wa: `549${area.slice(1)}${local}`, numero: `(${area}) 15${local}` };
  }
  return { e164: `+54${area.slice(1)}${local}`, wa: '', numero: `(${area}) ${local}` };
}

// Normaliza un área digitada: acepta la conocida o repone el "0" inicial
// que suele olvidarse ("3546" -> "03546").
function normalizarArea(area) {
  if (AREAS_ARGENTINA.includes(area)) return area;
  if (area && !area.startsWith('0') && AREAS_ARGENTINA.includes(`0${area}`)) return `0${area}`;
  return null;
}

// Casar un área sin paréntesis por prefijo (el más largo deja la parte
// local más plausible; se prefiere que queden 6-8 dígitos locales).
function casarArea(digitos, sinCeroInicial = false) {
  const candidatos = AREAS_ARGENTINA.filter((a) => digitos.startsWith(a.slice(sinCeroInicial ? 1 : 0)))
    .sort((a, b) => b.length - a.length);
  if (candidatos.length === 0) return null;
  const area = candidatos[0];
  return { area, local: digitos.slice(area.length - (sinCeroInicial ? 1 : 0)) };
}

// Normaliza un teléfono para las tres finalidades:
//   mostrar      -> numero  con formato "(área) número"
//   botón Llamar -> e164    con formato "+54..."
//   botón WhatsApp -> whatsapp sin el "+" (wa.me)
// Tipo: "fijo" | "celular". Acepta "(03546) 452067", "(3546) 452067",
// "03546452067", entradas internacionales "+5493546452067". El área entre
// paréntesis manda: evita ambigüedades como "0347" vs "03471".
export function normalizarTelefono(numero, tipo) {
  const texto = (numero || '').trim();
  const n = texto.replace(/\D+/g, '');
  const esCelular = tipo === 'celular';
  const resultado = { numero: texto, e164: '', whatsapp: '', error: null };

  if (!n) {
    resultado.error = 'Ingresá un número para autocompletar.';
    return resultado;
  }

  const mArea = texto.match(/\(([^)]+)\)/);
  if (mArea) {
    const area = normalizarArea(mArea[1].replace(/\D+/g, ''));
    if (!area) {
      resultado.error = 'No se reconoció el área. Escribilo como "(03546) 452067".';
      return resultado;
    }
    const armado = armarTelefono(area, n.slice(area.length), esCelular);
    resultado.numero = armado.numero;
    resultado.e164 = armado.e164;
    resultado.whatsapp = armado.wa;
    return resultado;
  }

  // Ya viene como internacional (54 = Argentina): se normaliza tal cual.
  if (n.startsWith('54') && n.length >= 11) {
    let cuerpo = n.slice(2);
    if (esCelular && cuerpo.startsWith('9')) cuerpo = cuerpo.slice(1);
    const casado = casarArea(cuerpo, true);
    if (casado) {
      resultado.numero = armarTelefono(casado.area, casado.local, esCelular).numero;
    }
    resultado.e164 = `+${n}`;
    if (esCelular) resultado.whatsapp = n;
    return resultado;
  }

  // Esquema local sin paréntesis: 0 + área + [15|9] + número local.
  const casado = casarArea(n);
  if (!casado) {
    resultado.error = 'No se reconoció el área. Escribilo como "(03546) 452067" o "+5493546452067".';
    return resultado;
  }
  const armado = armarTelefono(casado.area, casado.local, esCelular);
  resultado.numero = armado.numero;
  resultado.e164 = armado.e164;
  resultado.whatsapp = armado.wa;
  return resultado;
}

// Devuelve los enlaces tel: y wa.me a partir del array normalizado "telefonos"
// (con fallback para registros que solo tienen el campo "telefono")
export function obtenerEnlacesTelefono(item) {
  const enlaces = { telHref: null, waHref: null };

  if (Array.isArray(item.telefonos) && item.telefonos.length > 0) {
    const fijo = item.telefonos.find((t) => t.tipo === 'fijo' && t.e164);
    const cel = item.telefonos.find((t) => t.tipo === 'celular' && t.e164);
    if (fijo) enlaces.telHref = `tel:${fijo.e164}`;
    else if (cel) enlaces.telHref = `tel:${cel.e164}`;
    if (cel && cel.whatsapp) {
      enlaces.waHref = `https://wa.me/${cel.whatsapp}?text=${encodeURIComponent(mensajeWhatsApp(item))}`;
    }
    return enlaces;
  }

  if (item.telefono) {
    const limpio = item.telefono.replace(/\s/g, '').replace(/[-()]/g, '');
    enlaces.telHref = `tel:+${limpio}`;
    let whatsapp = limpio;
    if (whatsapp.startsWith('0')) whatsapp = '54' + whatsapp.substring(1);
    else if (!whatsapp.startsWith('54')) whatsapp = '54' + whatsapp;
    enlaces.waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensajeWhatsApp(item))}`;
  }

  return enlaces;
}

// Devuelve una fila por cada teléfono del array "telefonos[]" para mostrar
// en la tarjeta pública: label Fijo/Celular, número visible y enlaces.
// Fallback a "telefono" para registros sin array.
export function obtenerTelefonosVisibles(item) {
  if (Array.isArray(item.telefonos) && item.telefonos.length > 0) {
    return item.telefonos
      .map((t) => {
        const fila = { tipo: t.tipo === 'celular' ? 'celular' : 'fijo', numero: t.numero || '' };
        if (t.e164) fila.telHref = `tel:${t.e164}`;
        if (t.tipo === 'celular' && t.whatsapp) {
          fila.waHref = `https://wa.me/${t.whatsapp}?text=${encodeURIComponent(mensajeWhatsApp(item))}`;
        }
        return fila;
      })
      .filter((f) => f.numero || f.telHref);
  }

  if (item.telefono) {
    const enlaces = obtenerEnlacesTelefono(item);
    return [{ tipo: 'fijo', numero: item.telefono, telHref: enlaces.telHref, waHref: enlaces.waHref }];
  }

  return [];
}

// ---- Helpers para el formulario de administración ----

// Fila del editor: número visible + tipo (fijo/celular) + si recibe WhatsApp.
// Los campos e164/wa/error se rellenan con normalizarTelefono().
export function filaTelefonoVacia() {
  return { numero: '', tipoSel: 'fijo', whatsapp: false, e164: '', wa: '', error: null };
}

// Convierte los telefonos[] de la API a filas del formulario
export function serializarTelefonos(telefonos) {
  return (telefonos || []).map((t) => {
    const esCelular = t.tipo === 'celular';
    return {
      numero: t.numero || '',
      tipoSel: esCelular ? 'celular' : 'fijo',
      whatsapp: esCelular ? Boolean(t.whatsapp) : false,
      e164: t.e164 || '',
      wa: t.whatsapp || '',
      error: null
    };
  });
}

// Convierte las filas del formulario al formato JSON de la API.
// Normaliza cada teléfono (mostrar / Llamar / WhatsApp) y lanza un error
// descriptivo si alguna fila no se puede interpretar.
export function telefonosAApi(filas) {
  const resultado = [];

  filas.forEach((fila, i) => {
    if (!(fila.numero || '').trim()) return;
    const r = normalizarTelefono(fila.numero, fila.tipoSel);
    if (r.error) {
      throw new Error(`Teléfono ${i + 1}: ${r.error}`);
    }
    const base = { numero: r.numero, tipo: fila.tipoSel === 'celular' ? 'celular' : 'fijo', e164: r.e164 };
    if (base.tipo === 'celular' && fila.whatsapp) base.whatsapp = r.whatsapp;
    resultado.push(base);
  });

  if (resultado.length === 0) {
    throw new Error('Cargá al menos un teléfono con número.');
  }
  return resultado;
}