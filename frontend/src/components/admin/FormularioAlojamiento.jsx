import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import TelefonosEditor from './TelefonosEditor.jsx';
import { CATEGORIAS_FORMULARIO, obtenerMetaCategoria } from '../../utils/categorias.js';
import { filaTelefonoVacia, serializarTelefonos, telefonosAApi } from '../../utils/telefonos.js';

// Si la web no trae esquema, lo agrega para que pase la validación del backend
function normalizarWeb(valor) {
  const v = (valor || '').trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

export default function FormularioAlojamiento({ abierto, alojamiento, guardando, onGuardar, onCancelar }) {
  const esEdicion = Boolean(alojamiento);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [direccion, setDireccion] = useState('');
  const [web, setWeb] = useState('');
  const [telefonos, setTelefonos] = useState([filaTelefonoVacia()]);
  const [error, setError] = useState(null);

  // Carga los valores cuando se abre el diálogo (crear o editar)
  // oxlint-disable react/set-state-in-effect
  useEffect(() => {
    if (!abierto) return;
    setError(null);
    if (alojamiento) {
      setNombre(alojamiento.nombre || '');
      setCategoria(alojamiento.categoria || '');
      setDireccion(alojamiento.direccion || '');
      setWeb(alojamiento.web || '');
      const filas = serializarTelefonos(alojamiento.telefonos);
      if (filas.length === 0) {
        filas.push(filaTelefonoVacia());
      } else if (!filas[0].numero && alojamiento.telefono) {
        filas[0] = { ...filas[0], numero: alojamiento.telefono };
      }
      setTelefonos(filas);
    } else {
      setNombre('');
      setCategoria('');
      setDireccion('');
      setWeb('');
      setTelefonos([filaTelefonoVacia()]);
    }
    // oxlint-enable react/set-state-in-effect
  }, [abierto, alojamiento]);

  const campoValido = useMemo(
    () =>
      nombre.trim() !== '' &&
      categoria !== '' &&
      direccion.trim() !== '' &&
      telefonos.some((f) => f.numero.trim() !== '') &&
      telefonos.every((f) => f.numero.trim() === '' || !f.error),
    [nombre, categoria, direccion, telefonos],
  );

  const guardar = async () => {
    if (!campoValido) return;
    setError(null);
    try {
      const payload = {
        nombre: nombre.trim(),
        categoria,
        direccion: direccion.trim(),
        web: normalizarWeb(web),
        telefonos: telefonosAApi(telefonos),
      };
      await onGuardar(payload);
    } catch (err) {
      setError(err.message || 'No se pudo guardar el alojamiento');
    }
  };

  return (
    <Dialog open={abierto} onClose={onCancelar} maxWidth="md" fullWidth>
      <DialogTitle>{esEdicion ? 'Editar alojamiento' : 'Nuevo alojamiento'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
          />

          <FormControl required>
            <InputLabel>Categoría</InputLabel>
            <Select label="Categoría *" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {CATEGORIAS_FORMULARIO.map((clave) => (
                <MenuItem key={clave} value={clave}>
                  {obtenerMetaCategoria(clave).nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Dirección *"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Web"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
            fullWidth
            placeholder="https://www.ejemplo.com"
            helperText="Opcional. Se agrega https:// automáticamente si no lo escribís."
          />

          <TelefonosEditor filas={telefonos} onChange={setTelefonos} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={guardar} disabled={guardando || !campoValido}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}