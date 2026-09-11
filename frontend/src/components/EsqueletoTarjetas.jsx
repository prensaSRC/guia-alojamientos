import { Box, Skeleton } from '@mui/material';

// Esqueletos con la misma forma de la tarjeta mientras carga la API
export default function EsqueletoTarjetas() {
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