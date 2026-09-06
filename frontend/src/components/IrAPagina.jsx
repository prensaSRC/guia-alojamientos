import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

// Campo compacto para saltar a una página específica (se usa en web pública y admin)
export default function IrAPagina({ total, actual, onChange }) {
  const [draft, setDraft] = useState(null);
  const valor = draft === null ? String(actual) : draft;

  const ir = () => {
    setDraft(null);
    const n = Number.parseInt(valor, 10);
    if (Number.isNaN(n) || n < 1 || n > total) return;
    onChange(n);
  };

  const enviar = (e) => {
    e.preventDefault();
    ir();
  };

  return (
    <Box component="form" onSubmit={enviar} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
      <Typography variant="body2" color="text.secondary">
        Ir a
      </Typography>
      <TextField
        size="small"
        value={valor}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={ir}
        aria-label="Ir a página"
        sx={{
          width: 64,
          '& .MuiInputBase-input': { py: 0.75, textAlign: 'center' },
        }}
        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
      />
      <Typography variant="body2" color="text.secondary">
        de {total}
      </Typography>
    </Box>
  );
}