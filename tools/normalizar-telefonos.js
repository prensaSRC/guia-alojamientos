// ============================================
// NORMALIZADOR DE TELÉFONOS - Guía de Alojamientos
// Uso: node tools/normalizar-telefonos.js
// Parsea data.json, normaliza cada teléfono a formato
// "(área) número" y agrega el array "telefonos" con
// números en E.164 para enlaces tel: y wa.me.
// Regenera data.json con indent de 4 espacios y CRLF.
// ============================================
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data.json');

// Correcciones por typos detectados en las áreas
const AREA_FIXES = {
    '3546': '03546',    // faltaba el 0
    '3385': '03385',    // faltaba el 0
    '033546': '03546',  // dígito de más
    '035471': '03547',  // typo (Alta Gracia)
    '3585': '03585'     // faltaba el 0 (Río Tercero)
};

// Sobreescrituras manuales: casos que la heurística no puede inferir
// (p. ej. celulares modernos sin prefijo "15"). La clave es el id del
// registro y el valor reemplaza por completo el array "telefonos".
const OVERRIDES = {
    2: [
        { tipo: 'fijo', e164: '+543546420214' },
        { tipo: 'celular', e164: '+543546545435', whatsapp: '543546545435' }
    ]
};

const review = [];

function parseParts(telefono) {
    return telefono.split('/').map(s => s.trim()).filter(Boolean);
}

function main() {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const stats = { fijo: 0, celular: 0, multi: 0, corregidos: 0, heredaronArea: 0, sinCambio: 0, conCambio: 0 };
    const out = [];

    for (const item of data) {
        const parts = parseParts(item.telefono || '');
        if (parts.length > 1) stats.multi++;

        const parsed = [];
        let firstArea = null;

        for (let i = 0; i < parts.length; i++) {
            const collapsed = parts[i].replace(/\s+/g, ' ').trim();
            const areaMatch = collapsed.match(/^\(([^)]*)\)/i);

            let area = areaMatch ? areaMatch[1].replace(/\D+/g, '') : null;
            let correcto = false;
            if (area && AREA_FIXES[area]) {
                review.push(`[${item.id}] ${item.nombre}: área corregida "${parts[i]}" -> (${AREA_FIXES[area]})`);
                area = AREA_FIXES[area];
                stats.corregidos++;
                correcto = true;
            }

            const rest = areaMatch ? collapsed.slice(areaMatch[0].length) : collapsed;
            const subscriber = rest.replace(/\D+/g, '');

            if (!area) {
                if (firstArea) {
                    area = firstArea;
                    stats.heredaronArea++;
                } else {
                    review.push(`[${item.id}] ${item.nombre}: parte[${i}] sin área y sin área previa: "${parts[i]}"`);
                    continue;
                }
            }

            if (!area.startsWith('0')) review.push(`[${item.id}] ${item.nombre}: área sin 0: "${collapsed}"`);
            if (!subscriber) {
                review.push(`[${item.id}] ${item.nombre}: parte sin dígitos: "${collapsed}"`);
                continue;
            }

            // En Argentina el prefijo "15" identifica un celular (formato histórico nacional)
            const isCell = subscriber.startsWith('15') && subscriber.length > 3;
            const local = isCell ? subscriber.slice(2) : subscriber;

            const e164 = isCell
                ? `+54 9 ${area.slice(1)} ${local}`
                : `+54 ${area.slice(1)} ${subscriber}`;
            const e164Clean = e164.replace(/\s+/g, '');

            const entry = { tipo: isCell ? 'celular' : 'fijo', e164: e164Clean };
            if (isCell) entry.whatsapp = e164Clean.slice(1);

            parsed.push({
                entry,
                area,
                number: isCell ? '15' + local : subscriber
            });

            if (!firstArea) firstArea = area;
        }

        // Dedupe por E.164 dentro del mismo registro
        const seen = new Set();
        const telefonos = [];
        for (const p of parsed) {
            if (seen.has(p.entry.e164)) continue;
            seen.add(p.entry.e164);
            telefonos.push(p.entry);
            stats[p.entry.tipo]++;
        }
        const telefonosFinales = OVERRIDES[item.id] || telefonos;

        // Si hubo sobreescritura manual, ajustar las estadísticas a lo final
        if (OVERRIDES[item.id]) {
            for (const t of telefonos) stats[t.tipo]--;
            for (const t of telefonosFinales) stats[t.tipo]++;
        }

        // El texto visible repite el área solo cuando difiere de la primera parte
        const display = parsed
            .map((p, i) => (i > 0 && p.area === firstArea ? p.number : `(${p.area}) ${p.number}`))
            .join(' / ');
        if (display === (item.telefono || '')) stats.sinCambio++; else stats.conCambio++;

        out.push({
            id: item.id,
            nombre: item.nombre,
            categoria: item.categoria,
            direccion: item.direccion || '',
            telefono: display,
            telefonos: telefonosFinales,
            web: item.web || ''
        });
    }

    const json = JSON.stringify(out, null, 4).replace(/\n/g, '\r\n') + '\r\n';
    fs.writeFileSync(DATA_PATH, json, 'utf8');

    console.log('Registros procesados: ' + out.length);
    console.log('Con varios números: ' + stats.multi);
    console.log('Entradas por tipo -> fijo: ' + stats.fijo + ', celular: ' + stats.celular);
    console.log('Áreas corregidas por typo: ' + stats.corregidos);
    console.log('Partes que heredaron área: ' + stats.heredaronArea);
    console.log('Texto visible sin cambios: ' + stats.sinCambio + ' | con cambios: ' + stats.conCambio);
    console.log('Puntos de revisión: ' + review.length);
    review.forEach(r => console.log('  - ' + r));
}

main();