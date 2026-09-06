import { useEffect, useRef, useState } from 'react';
import { SearchOff } from '@mui/icons-material';
import { Alert, Box, Button, Container, Drawer, Skeleton, Stack, Typography } from '@mui/material';
import Buscador from '../components/Buscador.jsx';
import FiltroCategoria from '../components/FiltroCategoria.jsx';
import AlojamientoList from '../components/AlojamientoList.jsx';
import Paginacion from '../components/Paginacion.jsx';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import { useAlojamientosContext } from '../context/AlojamientosContext.jsx';

// Esqueletos con la misma forma de la tarjeta mientras carga la API
function EsqueletoTarjetas() {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Skeleton variant="rounded" width="40%" height={26} />
          <Skeleton variant="text" width="75%" height={30} />
          <Skeleton variant="text" width="90%" height={16} />
          <Skeleton variant="text" width="55%" height={16} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rounded" width={110} height={40} />
            <Skeleton variant="rounded" width={110} height={40} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// Estado vacío cuando no hay resultados
function EstadoVacio({ limpiar }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6 } }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          mx: 'auto',
          mb: 2,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: 'rgba(0, 173, 183, 0.1)',
        }}
      >
        <SearchOff sx={{ fontSize: 32, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        No encontramos alojamientos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Probá con otra categoría o cambiá tu búsqueda para ver resultados.
      </Typography>
      <Button variant="contained" color="primary" onClick={limpiar} sx={{ minWidth: 200 }}>
        Limpiar filtros
      </Button>
    </Box>
  );
}

export default function Home() {
  const { loading, error, recargar, busqueda, cambiarBusqueda, cambiarCategoria, paginacion, metaCategoria } =
    useAlojamientosContext();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const resultadosRef = useRef(null);
  const paginaAnterior = useRef(1);

  // Al cambiar de página o categoría, sube hasta la sección de resultados
  useEffect(() => {
    if (paginaAnterior.current === paginacion.paginaActual) return;
    paginaAnterior.current = paginacion.paginaActual;
    if (resultadosRef.current) {
      resultadosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [paginacion.paginaActual]);

  const etiqueta = busqueda.trim()
    ? `${metaCategoria.nombre} (búsqueda: "${busqueda.trim()}")`
    : metaCategoria.nombre;

  return (
    <>
      <Header onMenuClick={() => setMenuAbierto(true)} />
      <Hero />

      {/* Buscador móvil: debajo del hero, fuera del menú */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, mt: -3, position: 'relative', zIndex: 1 }}>
        <Buscador />
      </Box>

      {/* Drawer móvil: solo categorías */}
      <Drawer
        anchor="left"
        open={menuAbierto}
        onClose={() => setMenuAbierto(false)}
        slotProps={{
          paper: { sx: { borderRight: '1px solid rgba(0, 0, 0, 0.06)' } },
        }}
      >
        <Box sx={{ width: 304, p: 2, pt: 3 }} role="presentation">
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Categorías
          </Typography>
          <FiltroCategoria onCategoryChange={() => setMenuAbierto(false)} />
        </Box>
      </Drawer>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* Sidebar desktop */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              width: 260,
              flexShrink: 0,
              position: 'sticky',
              top: 88,
            }}
          >
            <FiltroCategoria />
          </Box>

          {/* Área principal */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }} ref={resultadosRef}>
            <Stack
              direction="row"
              gap={1}
              sx={{ mb: 3, alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
              <Typography variant="h5" sx={{ color: 'text.primary' }}>
                {loading ? 'Cargando...' : `${paginacion.totalItems} alojamientos encontrados`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {etiqueta}
              </Typography>
            </Stack>

            {loading && <EsqueletoTarjetas />}

            {!loading && error && (
              <Alert severity="error" action={<Button onClick={recargar}>Reintentar</Button>} sx={{ borderRadius: 2 }}>
                No se pudieron cargar los alojamientos. Verificá que el backend esté corriendo en la API configurada.
              </Alert>
            )}

            {!loading && !error && paginacion.items.length === 0 && (
              <EstadoVacio
                limpiar={() => {
                  cambiarBusqueda('');
                  cambiarCategoria('todos');
                }}
              />
            )}

            {!loading && !error && paginacion.items.length > 0 && (
              <>
                <AlojamientoList />
                <Paginacion />
              </>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}