import { useState } from 'react';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Delete, Edit, Language, NavigateBefore, NavigateNext, WhatsApp } from '@mui/icons-material';
import { obtenerEnlacesTelefono } from '../../utils/telefonos.js';
import IrAPagina from '../IrAPagina.jsx';

const FILAS_POR_PAGINA = 15;

// Link wa.me para verificar el WhatsApp de un alojamiento (null si no tiene)
function enlaceWhatsApp(alojamiento) {
  return obtenerEnlacesTelefono(alojamiento).waHref || null;
}

function telefonoResumen(alojamiento) {
  if (Array.isArray(alojamiento.telefonos) && alojamiento.telefonos.length > 0) {
    const numeros = alojamiento.telefonos
      .map((t) => t.numero || t.e164 || '')
      .filter(Boolean);
    if (numeros.length > 0) return numeros.join(' · ');
  }
  return alojamiento.telefono || '—';
}

// Las columnas secundarias se ocultan en pantallas chicas para evitar scroll horizontal
const visibilidad = {
  ocultoHastaMd: { display: { xs: 'none', md: 'table-cell' } },
};

export default function TablaAlojamientos({ alojamientos, onEditar, onEliminar }) {
  const [pagina, setPagina] = useState(0);

  const totalPaginas = Math.max(1, Math.ceil(alojamientos.length / FILAS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas - 1);

  const filas = alojamientos.slice(paginaSegura * FILAS_POR_PAGINA, (paginaSegura + 1) * FILAS_POR_PAGINA);
  const inicio = alojamientos.length === 0 ? 0 : paginaSegura * FILAS_POR_PAGINA + 1;
  const fin = Math.min(alojamientos.length, (paginaSegura + 1) * FILAS_POR_PAGINA);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 173, 183, 0.06)' }}>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={[visibilidad.ocultoHastaMd, { fontWeight: 700 }]}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={[visibilidad.ocultoHastaMd, { fontWeight: 700 }]}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 700 }} title="Probar contacto">
                Contacto
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No hay alojamientos que coincidan con el filtro.
                </TableCell>
              </TableRow>
            ) : (
              filas.map((a) => {
                const wa = enlaceWhatsApp(a);
                return (
                  <TableRow key={a.id} hover>
                    <TableCell sx={[visibilidad.ocultoHastaMd, { color: 'text.secondary' }]}>{a.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>{a.nombre}</TableCell>
                    <TableCell sx={visibilidad.ocultoHastaMd}>{a.direccion || '—'}</TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      {wa || a.web ? (
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
                          {wa && (
                            <Tooltip title={telefonoResumen(a)}>
                              <Button
                                size="small"
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<WhatsApp sx={{ fontSize: 15 }} />}
                                sx={{
                                  backgroundColor: '#25d366',
                                  color: '#fff',
                                  borderRadius: 2,
                                  px: 1.25,
                                  py: { xs: 0.75, sm: 0.5 },
                                  minWidth: 0,
                                  fontSize: 12,
                                  textTransform: 'none',
                                  '&:hover': { backgroundColor: '#1ebe57' },
                                }}
                              >
                                WhatsApp
                              </Button>
                            </Tooltip>
                          )}
                          {a.web && (
                            <Tooltip title={a.web}>
                              <Button
                                size="small"
                                href={a.web}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="outlined"
                                color="primary"
                                startIcon={<Language sx={{ fontSize: 15 }} />}
                                sx={{
                                  borderRadius: 2,
                                  px: 1.25,
                                  py: { xs: 0.75, sm: 0.5 },
                                  minWidth: 0,
                                  fontSize: 12,
                                  textTransform: 'none',
                                }}
                              >
                                Web
                              </Button>
                            </Tooltip>
                          )}
                        </Box>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <IconButton color="primary" size="small" onClick={() => onEditar(a)} aria-label={`Editar ${a.nombre}`}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => onEliminar(a)} aria-label={`Eliminar ${a.nombre}`}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {alojamientos.length === 0 ? 'Sin resultados' : `Mostrando ${inicio}–${fin} de ${alojamientos.length}`}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            disabled={paginaSegura === 0}
            onClick={() => setPagina(paginaSegura - 1)}
            aria-label="Página anterior"
          >
            <NavigateBefore />
          </IconButton>
          <IrAPagina total={totalPaginas} actual={paginaSegura + 1} onChange={(n) => setPagina(n - 1)} />
          <IconButton
            size="small"
            disabled={paginaSegura >= totalPaginas - 1}
            onClick={() => setPagina(paginaSegura + 1)}
            aria-label="Página siguiente"
          >
            <NavigateNext />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}