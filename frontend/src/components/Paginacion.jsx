import { NavigateNext, NavigateBefore } from '@mui/icons-material';
import { Button, Pagination, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IrAPagina from './IrAPagina.jsx';
import { useAlojamientosContext } from '../context/AlojamientosContext.jsx';

// Paginación: solo se muestra cuando hay más de una página.
// En móviles (xs) se usa Anterior/Siguiente a lo ancho, en la zona del pulgar.
export default function Paginacion() {
  const { cambiarPagina, paginacion } = useAlojamientosContext();
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('sm'));

  if (paginacion.totalPaginas <= 1) return null;

  const paginaActual = paginacion.paginaActual;
  const totalPaginas = paginacion.totalPaginas;

  return (
    <Stack spacing={2} sx={{ py: 4, alignItems: 'center' }}>
      {esMovil ? (
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<NavigateBefore />}
            disabled={paginaActual <= 1}
            onClick={() => cambiarPagina(paginaActual - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            endIcon={<NavigateNext />}
            disabled={paginaActual >= totalPaginas}
            onClick={() => cambiarPagina(paginaActual + 1)}
          >
            Siguiente
          </Button>
        </Stack>
      ) : (
        <Pagination
          page={paginaActual}
          count={totalPaginas}
          onChange={(_, valor) => cambiarPagina(valor)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          siblingCount={0}
          boundaryCount={2}
          sx={{
            '& .MuiPaginationItem-root': { fontWeight: 600 },
          }}
        />
      )}
      <IrAPagina total={totalPaginas} actual={paginaActual} onChange={cambiarPagina} />
    </Stack>
  );
}