import { Email, LocationOn, Phone } from '@mui/icons-material';
import { Box, Container, Divider, Typography } from '@mui/material';

// Pie de página con marca y datos de contacto
export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#0b1f2a', color: 'rgba(255,255,255,0.85)', mt: 8 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'space-between',
            py: 5,
          }}
        >
          <Box sx={{ maxWidth: 420 }}>
            <Box component="img" src="/images/logo-blanco.svg" alt="Santa Rosa de Calamuchita" sx={{ height: 48, mb: 1.5 }} />
            <Typography variant="body2">Guía de Alojamientos · Santa Rosa de Calamuchita</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mt: 1 }}>
              Creado por Área de Prensa y Comunicación de la Municipalidad de Santa Rosa de Calamuchita
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5, color: 'rgba(255,255,255,0.95)' }}>
              Contacto
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" sx={{ color: '#00adb7' }} /> +549 3546 52 8914
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" sx={{ color: '#00adb7' }} /> turismo@santarosacalamuchita.gob.ar
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" sx={{ color: '#00adb7' }} /> Santa Rosa de Calamuchita, Córdoba
            </Typography>
          </Box>
        </Box>
      </Container>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          © 2026 Municipalidad de Santa Rosa de Calamuchita. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}