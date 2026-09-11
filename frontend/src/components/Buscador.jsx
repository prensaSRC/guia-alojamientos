import { Clear, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useAlojamientosContext } from '../context/AlojamientosContext.jsx';
import { useState } from 'react';

// Campo de búsqueda con dos modos:
// - Por contexto (dentro de una categoría/página): filtra en vivo lo que se lista.
// - Por navegación (portada): recibe el texto ingresado vía onBuscar al apretar Enter o buscar.
function BaseBuscador({ size = 'medium', placeholder, valor, onValor, onBuscar }) {
  const esNavegacion = typeof onBuscar === 'function';

  return (
    <TextField
      fullWidth
      size={size}
      value={valor}
      onChange={(e) => onValor(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && esNavegacion) {
          e.preventDefault();
          onBuscar(valor);
        }
      }}
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
              <Search color={valor ? 'primary' : 'disabled'} />
            </InputAdornment>
          ),
          endAdornment: valor ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                color="primary"
                aria-label="Limpiar búsqueda"
                onClick={() => onValor('')}
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

function BuscadorContexto(props) {
  const { busqueda, cambiarBusqueda } = useAlojamientosContext();
  return <BaseBuscador {...props} valor={busqueda} onValor={cambiarBusqueda} />;
}

function BuscadorNavegacion(props) {
  const [valor, setValor] = useState('');
  const buscar = (texto) => {
    const limpia = (texto || '').trim();
    if (limpia) props.onBuscar(limpia);
  };
  return <BaseBuscador {...props} valor={valor} onValor={setValor} onBuscar={buscar} />;
}

export default function Buscador(props) {
  return typeof props.onBuscar === 'function' ? <BuscadorNavegacion {...props} /> : <BuscadorContexto {...props} />;
}