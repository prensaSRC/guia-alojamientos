import { Router } from 'express';
import { body } from 'express-validator';
import { iniciarSesion, registrar } from '../controllers/auth.controller.js';

const router = Router();

// Registro (solo para desarrollo)
function soloDesarrollo(_req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'El registro está deshabilitado' });
  }
  next();
}

router.post(
  '/register',
  soloDesarrollo,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
  ],
  registrar
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  iniciarSesion
);

export default router;