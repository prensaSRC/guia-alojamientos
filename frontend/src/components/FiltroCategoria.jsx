import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useAlojamientosContext } from '../context/AlojamientosContext.jsx';
import { CATEGORIAS_PANEL, obtenerMetaCategoria } from '../utils/categorias.js';

// Panel lateral con las pestañas de categorías (también se usa dentro del Drawer móvil)
export default function FiltroCategoria({ onCategoryChange }) {
  const { categoria, cambiarCategoria } = useAlojamientosContext();

  const seleccionar = (clave) => {
    cambiarCategoria(clave);
    if (onCategoryChange) onCategoryChange();
  };

  return (
    <List component="nav" disablePadding aria-label="Filtrar por categoría">
      {CATEGORIAS_PANEL.map((clave) => {
        const meta = obtenerMetaCategoria(clave);
        const Icono = meta.icono;
        const activo = categoria === clave;
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