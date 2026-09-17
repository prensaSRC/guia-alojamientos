import { SearchOff } from '@mui/icons-material';
import { alpha, Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GUIA_ACTIVA } from '../guia.js';

// Estado vacío cuando no hay resultados
export default function EstadoVacio({ limpiar }) {
  const theme = useTheme();
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
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <SearchOff sx={{ fontSize: 32, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {`No encontramos ${GUIA_ACTIVA.sustantivo.plural}`}
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