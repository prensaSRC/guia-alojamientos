# Plan: Fallback a JSON estático temporal (Railway expirado)

## Contexto
- Plan gratuito de Railway expirado → backend no disponible
- Se tiene backup local: `data.json` (alojamientos, 561 registros) y `data.backup.json`
- Gastronomía: solo 16 registros demo en `seed-gastronomia.js` (no hay backup JSON separado)
- Frontend React consume `/api/alojamientos` y `/api/gastronomia` via Vite proxy

## Decisiones

### 1. Ubicación y nombres de archivos
Colocar en `frontend/public/data/` (servido estáticamente por Vite/Netlify):
- `frontend/public/data/alojamientos.json` → datos de alojamientos (desde backup)
- `frontend/public/data/gastronomia.json` → datos de gastronomía (extraer del seed o crear mínimo)

### 2. Estrategia de fetch
Modificar `frontend/src/api/client.js`:
- Detectar si backend responde (health check) o forzar modo local via `VITE_USE_LOCAL_DATA=true`
- En modo local: hacer `fetch('/data/alojamientos.json')` en lugar de `fetch('/api/alojamientos')`
- Mantener misma interfaz (`obtenerAlojamientos()`, `obtenerAlojamiento(id)`)

### 3. Gastronomía
No hay backup JSON real. Opciones:
- A) Usar los 16 registros hardcodeados del `seed-gastronomia.js` y exportarlos a JSON
- B) Dejar array vacío y mostrar "próximamente"
- C) Usuario provee JSON propio

**Recomendación A**: Extraer array `LOCALES` del seed y guardarlo como `gastronomia.json`.

## Pasos de implementación

1. **Crear carpeta**: `mkdir frontend/public/data`
2. **Copiar datos alojamientos**: `copy data.backup.json frontend/public/data/alojamientos.json` (o `data.json` si es más reciente)
3. **Generar gastronomia.json**: Crear script rápido que exporte `LOCALES` del seed a JSON
4. **Modificar `client.js`**:
   - Agregar `const USE_LOCAL = import.meta.env.VITE_USE_LOCAL_DATA === 'true'`
   - En `rutaRubro()`: si `USE_LOCAL` retornar `/data/{rubro}.json`
   - En `pedir()`: si URL empieza con `/data/` usar fetch directo sin proxy
5. **Configurar variable**: En `frontend/.env` agregar `VITE_USE_LOCAL_DATA=true`
6. **Probar**: `npm run dev` en frontend (no necesita backend)

## Validación
- `npm run dev` carga alojamientos desde `/data/alojamientos.json`
- `VITE_RUBRO=gastronomia npm run dev` carga gastronomía desde `/data/gastronomia.json`
- Build de producción (`npm run build`) incluye carpeta `data/` en `dist/`

## Riesgos
- Admin panel no funcionará (requiere backend para auth y CRUD) → aceptar limitación temporal
- Datos gastronomía son solo demo (16 registros) → documentar
- CORS ya no aplica (fetch local)

## Rollback
- Quitar `VITE_USE_LOCAL_DATA` o poner `false`
- Volver a deployar backend en Railway cuando renueven plan