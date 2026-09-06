import { Box } from '@mui/material';
import { useAlojamientosContext } from '../context/AlojamientosContext.jsx';
import AlojamientoCard from './AlojamientoCard.jsx';

// Muestra las tarjetas de la página actual (o estado vacío si no hay resultados)
export default function AlojamientoList() {
  const { paginacion } = useAlojamientosContext();
  const items = paginacion.items;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(3, 1fr)',
        },
      }}
    >
      {items.map((alojamiento, indice) => (
        <AlojamientoCard key={alojamiento.id} alojamiento={alojamiento} indice={indice} />
      ))}
    </Box>
  );
}