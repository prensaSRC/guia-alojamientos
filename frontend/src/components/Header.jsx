import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';

// Barra superior con logo y título. En móvil se apilan centrados
// (el buscador vive dentro del Hero); el menú queda a la derecha.
// conMenu: en páginas sin lista (p. ej. la portada) se oculta la hamburguesa.
export default function Header({ onMenuClick, conMenu = true }) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)', boxShadow: '0 4px 16px rgba(0, 173, 183, 0.07)' }}
    >
      <Toolbar
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: 96, md: 64 },
          py: { xs: 1, md: 0 },
          position: 'relative',
          gap: { xs: 0.75, md: 3 },
        }}
      >
        <Box
          component="img"
          src="/images/logo-gris.svg"
          alt="Municipalidad de Santa Rosa de Calamuchita"
          sx={{
            width: { xs: '50%', md: 'auto' },
            height: { xs: 'auto', md: 44 },
            maxWidth: { xs: 180, md: 'none' },
          }}
        />
        <Typography
          variant="h6"
          component="h1"
          sx={{
            color: 'text.primary',
            whiteSpace: 'nowrap',
            width: { xs: '80%', md: 'auto' },
            textAlign: 'center',
            fontSize: { xs: '1.1rem', md: '1.3rem' },
          }}
        >
          Guía de Alojamientos
        </Typography>
        {esMovil && conMenu && (
          <Box
            sx={{
              position: 'absolute',
              right: { xs: 4, sm: 8 },
              top: '50%',
              transform: 'translateY(-50%)',
              // Anillo de atención que pulsa unas ondas al entrar a la web.
              // pointerEvents none para no tapar el botón; al terminar queda oculto.
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid transparent',
                opacity: 0,
                pointerEvents: 'none',
                animation: 'menuPulso 1.4s ease-out 3',
              },
              '@keyframes menuPulso': {
                '0%': { transform: 'scale(1)', opacity: 1, borderColor: 'rgba(0, 173, 183, 0.7)' },
                '100%': { transform: 'scale(1.65)', opacity: 0, borderColor: 'rgba(0, 173, 183, 0)' },
              },
              '@media (prefers-reduced-motion: reduce)': { '&::after': { animation: 'none' } },
            }}
          >
            <IconButton
              aria-label="Abrir menú"
              onClick={onMenuClick}
              sx={{
                backgroundColor: 'primary.main',
                color: '#fff',
                borderRadius: '50%',
                boxShadow: '0 4px 14px rgba(0, 173, 183, 0.4)',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              <Menu />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}