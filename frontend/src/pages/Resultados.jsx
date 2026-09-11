import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Container, Drawer, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import AlojamientoList from '../components/AlojamientoList.jsx';
import Buscador from '../components/Buscador.jsx';
import EstadoVacio from '../components/EstadoVacio.jsx';
import EsqueletoTarjetas from '../components/EsqueletoTarjetas.jsx';
import FiltroCategoria from '../components/FiltroCategoria.jsx';
import Header from '../components/Header.jsx';
import Paginacion from '../components/Paginacion.jsx';
import { useAlojamientosContext } from '../context/AlojamientosContext.jsx';

// Resultados de la búsqueda global: lista desde la URL ?q=...
export default function Resultados() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();

  const { loading, error, recargar, cambiarBusqueda, cambiarPagina, paginacion } = useAlojamientosContext();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const resultadosRef = useRef(null);
  const paginaAnterior = useRef(1);

  // El término viene de la URL y se sincroniza con el buscador del contexto
  useEffect(() => {
    cambiarBusqueda(q);
    cambiarPagina(1);
  }, [q, cambiarBusqueda, cambiarPagina]);

  // Al cambiar de página, sube hasta la sección de resultados
  useEffect(() => {
    if (paginaAnterior.current === paginacion.paginaActual) return;
    paginaAnterior.current = paginacion.paginaActual;
    if (resultadosRef.current) {
      resultadosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [paginacion.paginaActual]);

  return (
    <>
      <Header onMenuClick={() => setMenuAbierto(true)} />

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

      <Container maxWidth="xl" sx={{ mt: 3 }}>
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
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Button component={RouterLink} to="/" startIcon={<ArrowBack />} sx={{ mb: 2 }} color="primary">
              Todas las categorías
            </Button>

            <Stack direction="row" gap={1} sx={{ mb: 1, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ color: 'text.primary' }}>
                {q ? `Resultados de "${q}"` : 'Resultados de búsqueda'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paginacion.totalItems} {paginacion.totalItems === 1 ? 'alojamiento' : 'alojamientos'}
              </Typography>
            </Stack>

            <Box sx={{ maxWidth: 560, mb: 3 }}>
              <Buscador placeholder="Buscá por nombre, dirección o teléfono..." />
            </Box>

            <Box ref={resultadosRef}>
              {loading && <EsqueletoTarjetas />}

              {!loading && error && (
                <Alert severity="error" action={<Button onClick={recargar}>Reintentar</Button>} sx={{ borderRadius: 2 }}>
                  No se pudieron cargar los alojamientos. Verificá que el backend esté corriendo en la API configurada.
                </Alert>
              )}

              {!loading && !error && paginacion.items.length === 0 && (
                <EstadoVacio limpiar={() => cambiarBusqueda('')} />
              )}

              {!loading && !error && paginacion.items.length > 0 && (
                <>
                  <AlojamientoList />
                  <Paginacion />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}