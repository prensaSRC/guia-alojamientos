// ============================================
// BACKFILL DE "NUMERO" VISIBLE EN telefonos[]  - Guía de Alojamientos
// Uso: node tools/backfill-numero.js
// Cada entrada de "telefonos" tiene tipo/e164/whatsapp pero no el número
// visible. Este script reconstruye "numero" a partir del texto de
// "telefono" (partes separadas por " / "), reutilizando el área del
// primer teléfono para las siguientes partes. Regenera data.json.
// ============================================
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data.json');

// Extrae "(03546)" de una parte -> "03546" (o null si no hay prefijo)
function areaDeParte(parte) {
  const m = parte.match(/^\(([^)]*)\)/);
  return m ? m[1].replace(/\D+/g, '') : null;
}

// Formato "(03546) 452067" a partir de un E.164 (solo fallback)
function formatearNumero(e164) {
  const limpio = (e164 || '').replace(/\D+/g, '');
  if (limpio.startsWith('54')) {
    let resto = limpio.slice(2);
    if (resto.startsWith('9')) resto = resto.slice(1); // celular: quita el 9
    const area = resto.slice(0, 4); // áreas de 4 dígitos típicas de Córdoba
    const local = resto.slice(4);
    if (local) return `(${area.padStart(5, '0')}) ${local}`;
  }
  return e164 || '';
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  let conNumero = 0;

  for (const item of data) {
    const telefonos = Array.isArray(item.telefonos) ? item.telefonos : [];
    if (telefonos.length === 0) continue;

    const partes = (item.telefono || '').split('/').map((s) => s.trim()).filter(Boolean);
    const primerArea = partes.length ? areaDeParte(partes[0]) : null;

    telefonos.forEach((t, i) => {
      if (t.numero) return; // ya tiene número visible
      if (i < partes.length) {
        const parte = partes[i];
        // La parte ya trae su prefijo "(área)" -> se usa completa;
        // si no lo trae, se reutiliza el área de la primera parte.
        t.numero = areaDeParte(parte) ? parte : (primerArea ? `(${primerArea}) ${parte}` : parte);
      } else {
        t.numero = formatearNumero(t.e164);
      }
      conNumero++;
    });
  }

  const json = JSON.stringify(data, null, 4).replace(/\n/g, '\r\n') + '\r\n';
  fs.writeFileSync(DATA_PATH, json, 'utf8');

  console.log(`Entradas con numero completado: ${conNumero}`);
  console.log('data.json actualizado.');
}

main();