import { useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Buscador from '../components/Buscador.jsx';
import CategoriaCard from '../components/CategoriaCard.jsx';
import EsqueletoTarjetas from '../components/EsqueletoTarjetas.jsx';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import { useAlojamientos } from '../hooks/useAlojamientos.js';
import { ORDEN_CATEGORIAS } from '../utils/categorias.js';
import { normalizar } from '../utils/normalizar.js';

// Portada: grilla de tarjetas por categoría (una por tipo de alojamiento).
// No lista alojamientos: cada tarjeta lleva a su página /categoria/<slug>.
export default function Home() {
  const { alojamientos, loading } = useAlojamientos();
  const navigate = useNavigate();

  const conteos = useMemo(() => {
    const mapa = new Map();
    alojamientos.forEach((a) => {
      const clave = normalizar(a.categoria);
      mapa.set(clave, (mapa.get(clave) || 0) + 1);
    });
    return mapa;
  }, [alojamientos]);

  const buscar = (texto) => {
    if (texto.trim()) navigate(`/resultados?q=${encodeURIComponent(texto.trim())}`);
  };

  return (
    <>
      <Header conMenu={false} />
      <Hero onBuscar={buscar} />

      {/* Buscador móvil: debajo del hero */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, mt: -3, position: 'relative', zIndex: 1 }}>
        <Buscador placeholder="Buscá por nombre, dirección o teléfono..." onBuscar={buscar} />
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Typography variant="h5" component="h2" sx={{ color: 'text.primary' }}>
            Elegí el tipo de alojamiento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Todas las opciones disponibles para tu estadía en Santa Rosa de Calamuchita
          </Typography>
        </Box>

        {loading ? (
          <EsqueletoTarjetas />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2, sm: 2.5 },
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
            }}
          >
            {ORDEN_CATEGORIAS.map((clave) => (
              <CategoriaCard key={clave} clave={clave} cantidad={conteos.get(normalizar(clave)) || 0} />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}