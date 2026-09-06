import { Box, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, IconButton } from '@mui/material';
import { Add, Delete, Phone } from '@mui/icons-material';
import { filaTelefonoVacia, normalizarTelefono } from '../../utils/telefonos.js';

const TIPOS = [
  { valor: 'fijo', etiqueta: 'Fijo' },
  { valor: 'celular', etiqueta: 'Celular' },
];

// Recalcula e164/wa/error a partir del número visible y del tipo
function recalcular(fila) {
  const n = (fila.numero || '').trim();
  if (!n) return { ...fila, e164: '', wa: '', error: null };
  const r = normalizarTelefono(n, fila.tipoSel);
  return { ...fila, e164: r.e164, wa: r.whatsapp || '', error: r.error };
}

// Editor dinámico de teléfonos del formulario
export default function TelefonosEditor({ filas, onChange }) {
  const actualizar = (indice, cambios, recomputar = false) => {
    const siguiente = { ...filas[indice], ...cambios };
    onChange(filas.map((fila, i) => (i === indice ? (recomputar ? recalcular(siguiente) : siguiente) : fila)));
  };

  const agregar = () => onChange([...filas, filaTelefonoVacia()]);
  const eliminar = (indice) => onChange(filas.filter((_, i) => i !== indice));

  const cambiarTipo = (indice, tipoSel) => {
    // Al elegir Celular el WhatsApp queda activo por defecto (se puede desmarcar)
    actualizar(indice, { tipoSel, whatsapp: tipoSel === 'celular' }, true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Teléfonos
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          color="primary"
          onClick={agregar}
          title="Agregar otro teléfono"
          aria-label="Agregar otro teléfono"
          sx={{ border: '1px dashed', borderRadius: 2 }}
        >
          <Add />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filas.map((fila, indice) => (
          <Box
            key={indice}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 150px auto 40px' },
                alignItems: 'center',
              }}
            >
              <TextField
                label="Número de Teléfono"
                size="small"
                value={fila.numero}
                onChange={(e) => actualizar(indice, { numero: e.target.value })}
                onBlur={() => actualizar(indice, {}, true)}
                placeholder="(03546) 452067"
                error={Boolean(fila.error)}
                helperText={
                  fila.error ||
                  (fila.e164
                    ? `Llamar ${fila.e164}${fila.wa ? ` · WhatsApp ${fila.wa}` : ''}`
                    : 'Se completa Llamar y WhatsApp automáticamente.')
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormControl size="small">
                <InputLabel>Tipo</InputLabel>
                <Select label="Tipo" value={fila.tipoSel} onChange={(e) => cambiarTipo(indice, e.target.value)}>
                  {TIPOS.map((t) => (
                    <MenuItem key={t.valor} value={t.valor}>
                      {t.etiqueta}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {fila.tipoSel === 'celular' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fila.whatsapp}
                      onChange={(e) => actualizar(indice, { whatsapp: e.target.checked })}
                      size="small"
                    />
                  }
                  label="WhatsApp"
                />
              ) : (
                <Box />
              )}
              <IconButton
                color="error"
                onClick={() => eliminar(indice)}
                aria-label={`Eliminar teléfono ${indice + 1}`}
                disabled={filas.length <= 1}
                sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' }, justifySelf: { xs: 'start', sm: 'auto' } }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}