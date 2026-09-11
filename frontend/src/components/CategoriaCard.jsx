import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { obtenerMetaCategoria, slugCategoria } from "../utils/categorias.js";

// Tarjeta de la portada: ícono, nombre y contador, clicable hacia /categoria/<slug>
export default function CategoriaCard({ clave, cantidad }) {
  const navigate = useNavigate();
  const meta = obtenerMetaCategoria(clave);
  const Icono = meta.icono;
  const destino = `/categoria/${slugCategoria(clave)}`;

  const ir = () => navigate(destino);

  return (
    <Box
      role="link"
      tabIndex={0}
      onClick={ir}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ir();
        }
      }}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        borderTop: `4px solid ${meta.color}`,
        p: { xs: 2, sm: 2.5 },
        textAlign: "center",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        backgroundColor: "background.paper",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 24px rgba(0, 32, 36, 0.1)",
        },
        "&:focus-visible": {
          outline: `2px solid ${meta.color}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 52, sm: 60 },
          height: { xs: 52, sm: 60 },
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          backgroundColor: `${meta.color}1a`,
          color: meta.color,
        }}
      >
        <Icono sx={{ fontSize: { xs: 30, sm: 34 } }} />
      </Box>
      <Typography
        sx={{ fontWeight: 700, fontSize: { xs: "0.95rem", sm: "1.05rem" } }}
        color="text.primary"
      >
        {meta.nombre}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {cantidad} {cantidad === 1 ? "establecimiento" : "establecimientos"}
      </Typography>
    </Box>
  );
}
