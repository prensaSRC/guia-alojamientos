import jwt from 'jsonwebtoken';

// Verifica el token JWT del header Authorization: Bearer <token>
// y adjunta el usuario decodificado en req.user
export function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No autorizado: falta el token' });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodificado;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}