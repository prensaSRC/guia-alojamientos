import { Box, Container, Typography } from '@mui/material';
import Buscador from './Buscador.jsx';

// Hero con imagen del municipio y título (mismo efecto blend que la versión actual).
// En desktop incluye el buscador; en móvil va aparte, superpuesto al pie del hero.
// onBuscar: en la portada el buscador navega a /resultados?q=...
export default function Hero({ onBuscar }) {
  return (
    <Box
      sx={{
        backgroundImage:
          'linear-gradient(135deg, #00adb7 0%, #008a92 100%), url("/images/huesped-4.jpg")',
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center 22%',
        pt: { xs: 7, md: 9 },
        pb: { xs: 5, md: 8 },
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: 700,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="overline"
            component="p"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.2em',
              fontSize: '0.72rem',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Santa Rosa de Calamuchita · Córdoba
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mt: 0, mb: 1.5 }}
          >
            Encontrá tu hospedaje ideal
          </Typography>
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, color: 'rgba(255,255,255,0.9)' }}>
            Descubrí la mejor oferta de alojamientos en Santa Rosa de Calamuchita
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, mt: 4, mx: 'auto', maxWidth: 560 }}>
          <Buscador size="large" onBuscar={onBuscar} />
        </Box>
      </Container>
    </Box>
  );
}