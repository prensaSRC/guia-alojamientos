// Middleware para rutas no encontradas (404)
export function notFound(req, res) {
  res.status(404).json({ message: 'Ruta no encontrada' });
}