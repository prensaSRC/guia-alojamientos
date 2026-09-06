import { Router } from 'express';
import { body } from 'express-validator';
import {
  actualizar,
  crear,
  eliminar,
  obtenerPorId,
  obtenerTodos
} from '../controllers/alojamiento.controller.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// ============ Validaciones compartidas (crear y actualizar) ============
const validarAlojamiento = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('categoria').trim().notEmpty().withMessage('La categoría es obligatoria'),
  body('direccion').trim().notEmpty().withMessage('La dirección es obligatoria'),
  body('web')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('La web debe ser una URL válida (ej: https://sitio.com)'),
  body('telefonos').isArray({ min: 1 }).withMessage('Debe haber al menos un teléfono'),
  body('telefonos.*.numero').trim().notEmpty().withMessage('Cada teléfono debe tener un número visible'),
  body('telefonos.*.tipo')
    .isIn(['fijo', 'celular'])
    .withMessage('El tipo de teléfono debe ser fijo o celular'),
  body('telefonos.*.e164')
    .optional({ values: 'falsy' })
    .isString()
    .matches(/^\+?\d{8,16}$/)
    .withMessage('El E.164 debe ser un número con 8 a 16 dígitos (ej: +5493546452067)'),
  body('telefonos.*.whatsapp')
    .optional({ values: 'falsy' })
    .isString()
    .matches(/^\d{10,16}$/)
    .withMessage('El WhatsApp debe ser un número de 10 a 16 dígitos')
];

// Rutas públicas de lectura
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);

// Rutas protegidas de escritura (requieren token JWT)
router.post('/', verificarToken, validarAlojamiento, crear);
router.put('/:id', verificarToken, validarAlojamiento, actualizar);
router.delete('/:id', verificarToken, eliminar);

export default router;