import { Hotel, Restaurant } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

// Selector de rubro del panel de administración: Alojamientos | Gastronomía
const ETIQUETAS = [
  { valor: 'alojamientos', texto: 'Alojamientos', icono: <Hotel sx={{ fontSize: 18 }} /> },
  { valor: 'gastronomia', texto: 'Gastronomía', icono: <Restaurant sx={{ fontSize: 18 }} /> },
];

export default function SelectorRubro({ rubro, onChange, disabled }) {
  const seleccionar = (_, valor) => {
    if (valor) onChange(valor);
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={rubro}
      onChange={seleccionar}
      disabled={disabled}
      color="primary"
      aria-label="Rubro de la guía"
      sx={{
        '& .MuiToggleButton-root': { gap: 0.75, px: { xs: 1.5, sm: 2 }, whiteSpace: 'nowrap' },
      }}
    >
      {ETIQUETAS.map((opcion) => (
        <ToggleButton key={opcion.valor} value={opcion.valor}>
          {opcion.icono}
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {opcion.texto}
          </Box>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}