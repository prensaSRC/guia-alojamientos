import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, AppBar, Box, Button, Chip, CircularProgress, Divider, InputAdornment, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { Add, Apartment, Home as HomeIcon, Language, Logout, Person, Search, Storefront, WhatsApp } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { actualizarAlojamientoApi, crearAlojamientoApi, eliminarAlojamientoApi, obtenerAlojamientos } from '../api/client.js';
import { normalizar } from '../utils/normalizar.js';
import TablaAlojamientos from '../components/admin/TablaAlojamientos.jsx';
import FormularioAlojamiento from '../components/admin/FormularioAlojamiento.jsx';
import ConfirmarEliminacion from '../components/admin/ConfirmarEliminacion.jsx';

function TarjetaEstadistica({ icono, etiqueta, valor, color = 'primary.main' }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 180, boxShadow: '0 2px 12px rgba(0, 173, 183, 0.06)' }}>
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

export default function Admin() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

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
    obtenerAlojamientos()
      .then((datos) => {
        if (activo) {
          setAlojamientos(datos);
          setError(null);
        }
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.message || 'Error al cargar los alojamientos');
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
  }, [logout, navigate]);

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
        await actualizarAlojamientoApi(enEdicion.id, payload);
      } else {
        await crearAlojamientoApi(payload);
      }
      const datos = await obtenerAlojamientos();
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
      await eliminarAlojamientoApi(eliminandoA.id);
      setAlojamientos((previos) => previos.filter((a) => a.id !== eliminandoA.id));
      setEliminandoA(null);
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el alojamiento');
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

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)', boxShadow: '0 4px 16px rgba(0, 173, 183, 0.07)' }}>
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
          <Box>
            <Typography variant="h5" sx={{ color: 'text.primary' }}>
              Alojamientos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestioná los alojamientos de la guía turística
            </Typography>
          </Box>

          {/* Estadísticas */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TarjetaEstadistica icono={<Storefront />} etiqueta="Alojamientos" valor={cargando ? '…' : estadisticas.total} color="#00adb7" />
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
              Nuevo Alojamiento
            </Button>
          </Stack>

          <Divider />

          {cargando ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TablaAlojamientos alojamientos={filtrados} onEditar={abrirEditar} onEliminar={setEliminandoA} />
          )}
        </Stack>
      </Box>

      <FormularioAlojamiento
        abierto={formularioAbierto}
        alojamiento={enEdicion}
        guardando={guardando}
        onGuardar={guardar}
        onCancelar={() => setFormularioAbierto(false)}
      />

      <ConfirmarEliminacion
        abierto={Boolean(eliminandoA)}
        nombre={eliminandoA?.nombre || ''}
        guardando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setEliminandoA(null)}
      />
    </>
  );
}