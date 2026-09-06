import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';

// Barra superior con logo y título. En móvil se apilan centrados
// (el buscador vive dentro del Hero); el menú queda a la derecha.
export default function Header({ onMenuClick }) {
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
        {esMovil && (
          <IconButton
            aria-label="Abrir menú"
            onClick={onMenuClick}
            color="primary"
            sx={{ position: 'absolute', right: { xs: 4, sm: 8 }, top: '50%', transform: 'translateY(-50%)' }}
          >
            <Menu />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}