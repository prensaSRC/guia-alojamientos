// Middleware de manejo de errores (siempre al final de la cadena)
export function errorHandler(err, req, res, _next) {
  console.error('Error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
}