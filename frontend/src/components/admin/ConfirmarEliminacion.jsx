import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

// Modal de confirmación antes de eliminar un alojamiento
export default function ConfirmarEliminacion({ abierto, nombre, guardando, onConfirmar, onCancelar }) {
  return (
    <Dialog open={abierto} onClose={onCancelar} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <WarningAmber />
        Eliminar alojamiento
      </DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que querés eliminar <strong>“{nombre}”</strong>? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
        <Button variant="contained" color="error" onClick={onConfirmar} disabled={guardando}>
          {guardando ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}