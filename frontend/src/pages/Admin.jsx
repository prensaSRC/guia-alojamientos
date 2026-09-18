import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, AppBar, Box, Button, Chip, CircularProgress, Divider, InputAdornment, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { Add, Apartment, Home as HomeIcon, Language, Logout, Person, Search, Storefront, WhatsApp } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { actualizarAlojamientoApi, crearAlojamientoApi, eliminarAlojamientoApi, obtenerAlojamientos } from '../api/client.js';
import { normalizar } from '../utils/normalizar.js';
import { GUIAS } from '../guia.js';
import TablaAlojamientos from '../components/admin/TablaAlojamientos.jsx';
import FormularioAlojamiento from '../components/admin/FormularioAlojamiento.jsx';
import ConfirmarEliminacion from '../components/admin/ConfirmarEliminacion.jsx';
import SelectorRubro from '../components/admin/SelectorRubro.jsx';

function TarjetaEstadistica({ icono, etiqueta, valor, color = 'primary.main' }) {
  const theme = useTheme();
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 180, boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}` }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}1a`,
          color,
        }}
      >
        {icono}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
          {valor}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {etiqueta}
        </Typography>
      </Box>
    </Paper>
  );
}

// Capitaliza la primera letra (usado para títulos como "Locales gastronómicos")
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function Admin() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Rubro seleccionado en el panel (alojamientos o gastronomía)
  const [rubro, setRubro] = useState('alojamientos');
  const guia = GUIAS[rubro];

  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [eliminandoA, setEliminandoA] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    setFormularioAbierto(false);
    setEnEdicion(null);
    setEliminandoA(null);
    obtenerAlojamientos(rubro)
      .then((datos) => {
        if (activo) {
          setAlojamientos(datos);
          setError(null);
        }
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.message || `Error al cargar los ${guia.sustantivo.plural}`);
        if (/token/i.test(err.message)) {
          logout();
          navigate('/login');
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [rubro, logout, navigate, guia.sustantivo.plural]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const categorias = new Set(alojamientos.map((a) => a.categoria));
    return {
      total: alojamientos.length,
      categorias: categorias.size,
      conWeb: alojamientos.filter((a) => a.web).length,
      conWhatsapp: alojamientos.filter((a) =>
        Array.isArray(a.telefonos) ? a.telefonos.some((t) => t.whatsapp) : false,
      ).length,
    };
  }, [alojamientos]);

  // Filtro en tiempo real
  const filtrados = useMemo(() => {
    const termino = normalizar(busqueda);
    if (!termino) return alojamientos;
    return alojamientos.filter((a) => {
      const telefonos = Array.isArray(a.telefonos)
        ? a.telefonos.flatMap((t) => [t.numero, t.e164, t.whatsapp]).join(' ')
        : '';
      return normalizar(`${a.nombre} ${a.categoria} ${a.direccion} ${a.telefono} ${a.web} ${telefonos}`).includes(termino);
    });
  }, [alojamientos, busqueda]);

  const abrirCrear = () => {
    setEnEdicion(null);
    setFormularioAbierto(true);
  };

  const abrirEditar = (alojamiento) => {
    setEnEdicion(alojamiento);
    setFormularioAbierto(true);
  };

  const guardar = async (payload) => {
    setGuardando(true);
    try {
      if (enEdicion) {
        await actualizarAlojamientoApi(enEdicion.id, payload, rubro);
      } else {
        await crearAlojamientoApi(payload, rubro);
      }
      const datos = await obtenerAlojamientos(rubro);
      setAlojamientos(datos);
      setFormularioAbierto(false);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!eliminandoA) return;
    setEliminando(true);
    setError(null);
    try {
      await eliminarAlojamientoApi(eliminandoA.id, rubro);
      setAlojamientos((previos) => previos.filter((a) => a.id !== eliminandoA.id));
      setEliminandoA(null);
    } catch (err) {
      setError(err.message || `No se pudo eliminar el ${guia.sustantivo.singular}`);
      if (/token/i.test(err.message)) {
        logout();
        navigate('/login');
      }
    } finally {
      setEliminando(false);
    }
  };

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  const etiquetaTotal = capitalizar(guia.sustantivo.plural);
  const etiquetaNuevo = `Nuevo ${guia.sustantivo.singular}`;

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)', boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.07)}` }}>
        <Toolbar sx={{ gap: { xs: 1, md: 2 }, flexWrap: 'nowrap' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              flexShrink: 1,
              fontSize: { xs: '1.05rem', md: '1.25rem' },
            }}
          >
            Panel de administración
          </Typography>
          <Box sx={{ flexGrow: 1, flexShrink: 1 }} />
          {usuario && (
            <Chip
              size="small"
              icon={<Person />}
              label={`${usuario.nombre} (${usuario.email})`}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            />
          )}
          <Button component={RouterLink} to="/" startIcon={<HomeIcon />} aria-label="Ver sitio">
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Ver sitio
            </Box>
          </Button>
          <Button startIcon={<Logout />} onClick={cerrarSesion} color="inherit">
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ color: 'text.primary' }}>
                {guia.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Gestioná los ${guia.sustantivo.plural} de la guía turística`}
              </Typography>
            </Box>
            <SelectorRubro rubro={rubro} onChange={setRubro} disabled={cargando} />
          </Box>

          {/* Estadísticas */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TarjetaEstadistica icono={<Storefront />} etiqueta={etiquetaTotal} valor={cargando ? '…' : estadisticas.total} color={guia.color.main} />
            <TarjetaEstadistica icono={<Apartment />} etiqueta="Categorías" valor={cargando ? '…' : estadisticas.categorias} color="#ff7300" />
            <TarjetaEstadistica icono={<Language />} etiqueta="Con sitio web" valor={cargando ? '…' : estadisticas.conWeb} color="#7cc100" />
            <TarjetaEstadistica icono={<WhatsApp />} etiqueta="Con WhatsApp" valor={cargando ? '…' : estadisticas.conWhatsapp} color="#25d366" />
          </Stack>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Buscador y botón nuevo */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscá por nombre, categoría, dirección, teléfono o web..."
              size="small"
              sx={{ flexGrow: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="contained" startIcon={<Add />} onClick={abrirCrear} sx={{ whiteSpace: 'nowrap', flexShrink: 0, color: '#fff' }}>
              {etiquetaNuevo}
            </Button>
          </Stack>

          <Divider />

          {cargando ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TablaAlojamientos alojamientos={filtrados} onEditar={abrirEditar} onEliminar={setEliminandoA} sustantivo={guia.sustantivo} />
          )}
        </Stack>
      </Box>

      <FormularioAlojamiento
        abierto={formularioAbierto}
        alojamiento={enEdicion}
        guardando={guardando}
        onGuardar={guardar}
        onCancelar={() => setFormularioAbierto(false)}
        guia={guia}
      />

      <ConfirmarEliminacion
        abierto={Boolean(eliminandoA)}
        nombre={eliminandoA?.nombre || ''}
        guardando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setEliminandoA(null)}
        etiqueta={guia.sustantivo.singular}
      />
    </>
  );
}