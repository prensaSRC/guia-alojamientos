import { createTheme } from '@mui/material/styles';

const MUNI = {
  turquesa: '#00adb7',
  turquesaDark: '#008a92',
  turquesaLight: '#b3eef0',
  naranja: '#ff7300',
  naranjaLight: '#ff9b00',
  verde: '#7cc100',
  verdeLight: '#b4d006',
  texto: '#505762',
  textoClaro: '#4a4a6a',
  fondo: '#f8f9fa',
  borde: '#e9ecef',
  whatsapp: '#25d366',
};

export const COLORES_MUNI = MUNI;

// Sombra suave teñida del color de marca (nunca gris puro sobre fondos claros)
const sombraTintada = (opacidad) => `0 2px 12px rgba(0, 173, 183, ${opacidad})`;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: MUNI.turquesa, dark: MUNI.turquesaDark, light: MUNI.turquesaLight },
    secondary: { main: MUNI.naranja, dark: MUNI.turquesaDark },
    warning: { main: MUNI.naranjaLight },
    success: { main: MUNI.verde },
    info: { main: MUNI.verdeLight },
    error: { main: '#d32f2f' },
    text: { primary: MUNI.texto, secondary: MUNI.textoClaro },
    background: { default: MUNI.fondo },
    whatsapp: { main: MUNI.whatsapp },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    // Dos pesos de toda la escala: 400 (texto) y 700 (jerarquía)
    h2: { fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.15 },
    h3: { fontWeight: 700, lineHeight: 1.2 },
    h4: { fontWeight: 700, lineHeight: 1.2 },
    h5: { fontWeight: 700, lineHeight: 1.25 },
    h6: { fontWeight: 700, lineHeight: 1.3 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: MUNI.fondo,
        },
        ':focus-visible': {
          outline: `2px solid ${MUNI.turquesa}`,
          outlineOffset: 2,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 700,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease',
          // Tap targets de al menos 44px en móviles
          '@media (max-width: 599.98px)': { minHeight: 44 },
        },
        containedPrimary: {
          boxShadow: `${sombraTintada(0.28)}, inset 0 1px 0 rgba(255, 255, 255, 0.45)`,
          '&:hover': {
            boxShadow: `${sombraTintada(0.4)}, inset 0 1px 0 rgba(255, 255, 255, 0.45)`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 599.98px)': { width: 44, height: 44 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: sombraTintada(0.1),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          transition: 'background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

export default theme;