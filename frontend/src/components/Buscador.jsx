import { Clear, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useAlojamientosContext } from '../context/AlojamientosContext.jsx';

export default function Buscador({ size = 'medium', placeholder = 'Buscá por nombre, dirección o teléfono...' }) {
  const { busqueda, cambiarBusqueda } = useAlojamientosContext();

  return (
    <TextField
      fullWidth
      size={size}
      value={busqueda}
      onChange={(e) => cambiarBusqueda(e.target.value)}
      placeholder={placeholder}
      aria-label="Buscar alojamiento"
      sx={{
        '& .MuiInputBase-root': {
          fontWeight: 400,
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'rgba(80, 87, 98, 0.65)',
          opacity: 1,
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: 999,
          backgroundColor: '#fff',
          boxShadow: 'inset 0 0 0 1px rgba(0, 173, 183, 0.4), 0 8px 24px rgba(0, 32, 36, 0.16)',
          transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
          '&:hover': {
            boxShadow: 'inset 0 0 0 1px rgba(0, 173, 183, 0.65), 0 8px 24px rgba(0, 32, 36, 0.16)',
          },
          '&.Mui-focused': {
            backgroundColor: '#fff',
            boxShadow: 'inset 0 0 0 2px rgba(0, 173, 183, 0.7), 0 8px 24px rgba(0, 32, 36, 0.16)',
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search color={busqueda ? 'primary' : 'disabled'} />
            </InputAdornment>
          ),
          endAdornment: busqueda ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                color="primary"
                aria-label="Limpiar búsqueda"
                onClick={() => cambiarBusqueda('')}
                sx={{
                  backgroundColor: 'rgba(0, 173, 183, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(0, 173, 183, 0.2)' },
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}