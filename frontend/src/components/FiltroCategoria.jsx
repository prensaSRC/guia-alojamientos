import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ORDEN_CATEGORIAS, obtenerMetaCategoria, slugCategoria } from '../utils/categorias.js';

// Switcher de categorías: navega a /categoria/<slug>.
// Se usa como sidebar en desktop y dentro del Drawer móvil.
export default function FiltroCategoria({ actual, onCategoryChange }) {
  const navigate = useNavigate();

  const seleccionar = (clave) => {
    navigate(`/categoria/${slugCategoria(clave)}`);
    if (onCategoryChange) onCategoryChange();
  };

  return (
    <List component="nav" disablePadding aria-label="Cambiar de categoría">
      {ORDEN_CATEGORIAS.map((clave) => {
        const meta = obtenerMetaCategoria(clave);
        const Icono = meta.icono;
        const activo = clave === actual;
        return (
          <ListItemButton
            key={clave}
            selected={activo}
            onClick={() => seleccionar(clave)}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              mb: 0.5,
              borderLeft: '3px solid transparent',
              '&.Mui-selected': {
                backgroundColor: `${meta.color}1a`,
                color: meta.color,
                fontWeight: 700,
                borderLeftColor: meta.color,
                '&:hover': {
                  backgroundColor: `${meta.color}26`,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: activo ? meta.color : 'text.secondary' }}>
              <Icono fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={meta.nombre}
              slotProps={{ primary: { fontSize: 14, fontWeight: activo ? 700 : 400 } }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}