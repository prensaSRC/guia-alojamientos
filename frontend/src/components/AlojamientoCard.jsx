import { Language, LocationOn, Phone, Smartphone, WhatsApp } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { obtenerMetaCategoria } from '../utils/categorias.js';
import { obtenerTelefonosVisibles } from '../utils/telefonos.js';

// Tarjeta individual de un alojamiento
export default function AlojamientoCard({ alojamiento, indice = 0 }) {
  const meta = obtenerMetaCategoria(alojamiento.categoria);
  const IconoCategoria = meta.icono;
  const telefonos = obtenerTelefonosVisibles(alojamiento);
  const whatsapps = telefonos
    .map((t) => t.waHref)
    .filter(Boolean)
    .filter((href, i, arr) => arr.indexOf(href) === i);

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderColor: 'divider',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        animation: 'cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: `${indice * 60}ms`,
        '@keyframes cardIn': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        '&:hover': {
          boxShadow: '0 12px 48px rgba(0, 173, 183, 0.15)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, pb: 1 }}>
        <Chip
          icon={<IconoCategoria sx={{ fontSize: 16 }} />}
          label={meta.nombre}
          size="small"
          sx={{
            mb: 1.5,
            backgroundColor: `${meta.color}20`,
            color: meta.color,
            fontWeight: 700,
            '& .MuiChip-icon': { color: meta.color },
          }}
        />
        <Typography variant="h6" component="h3" sx={{ mb: 1.5, lineHeight: 1.3, fontSize: { sm: '1.25rem', md: '1.35rem' } }}>
          {alojamiento.nombre}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {alojamiento.direccion && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <LocationOn fontSize="small" color="disabled" sx={{ mt: 0.3, flexShrink: 0, fontSize: { xs: '1.2rem', md: '1.4rem' } }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                {alojamiento.direccion}
              </Typography>
            </Box>
          )}
          {telefonos.map((t, i) => (
            <Box
              key={i}
              sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}
            >
              {t.tipo === 'celular' ? (
                <Smartphone fontSize="small" color="disabled" sx={{ flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />
              ) : (
                <Phone fontSize="small" color="disabled" sx={{ flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />
              )}
              <Box
                sx={{ display: { xs: t.telHref ? 'none' : 'block', sm: 'block' }, minWidth: 0 }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  <Box component="span" sx={{ mr: 0.5, fontWeight: 600 }}>
                    {t.tipo === 'celular' ? 'Celular' : 'Fijo'}:
                  </Box>
                  {t.numero}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  gap: 0.75,
                  width: '100%',
                }}
              >
                {t.telHref && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    href={t.telHref}
                    startIcon={<Phone sx={{ fontSize: 16 }} />}
                    sx={{ whiteSpace: 'nowrap', flex: 1 }}
                  >
                    Llamar
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ px: { xs: 2, sm: 3 }, py: 1.5, gap: 1 }}>
        {whatsapps.length > 0 && (
          <Button
            size="small"
            variant="contained"
            href={whatsapps[0]}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsApp sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: 'whatsapp.main',
              color: '#fff',
              '&:hover': { backgroundColor: '#1ebe57' },
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            WhatsApp
          </Button>
        )}
        {alojamiento.web && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            href={alojamiento.web}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Language sx={{ fontSize: 16 }} />}
            sx={{ flex: 1, color: '#fff' }}
          >
            Sitio Web
          </Button>
        )}
      </CardActions>
    </Card>
  );
}