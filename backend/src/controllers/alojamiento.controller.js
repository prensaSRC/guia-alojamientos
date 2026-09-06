import { validationResult } from 'express-validator';
import Alojamiento from '../models/alojamiento.model.js';

// Si la validación de express-validator falló, responde 400
function hayErroresValidacion(req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({
      message: 'Datos inválidos',
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg }))
    });
    return true;
  }
  return false;
}

// El teléfono visible de la tarjeta es el "numero" del primer teléfono
function telefonoVisible(telefonos, fallback = null) {
  if (Array.isArray(telefonos) && telefonos.length > 0 && telefonos[0].numero) {
    return telefonos[0].numero;
  }
  return fallback;
}

// GET /api/alojamientos -> todas los alojamientos
export async function obtenerTodos(req, res, next) {
  try {
    const alojamientos = await Alojamiento.findAll({
      order: [['id', 'ASC']]
    });
    res.json(alojamientos);
  } catch (error) {
    next(error);
  }
}

// GET /api/alojamientos/:id -> un alojamiento por id
export async function obtenerPorId(req, res, next) {
  try {
    const { id } = req.params;
    const alojamiento = await Alojamiento.findByPk(id);

    if (!alojamiento) {
      return res.status(404).json({ message: 'Alojamiento no encontrado' });
    }

    res.json(alojamiento);
  } catch (error) {
    next(error);
  }
}

// POST /api/alojamientos -> crear (requiere autenticación)
export async function crear(req, res, next) {
  try {
    if (hayErroresValidacion(req, res)) return;

    const { nombre, categoria, direccion, telefonos, web } = req.body;
    const telefono = telefonoVisible(telefonos, req.body.telefono || null);

    const alojamiento = await Alojamiento.create({
      nombre,
      categoria,
      direccion,
      telefono,
      telefonos: telefonos || [],
      web
    });

    res.status(201).json(alojamiento);
  } catch (error) {
    next(error);
  }
}

// PUT /api/alojamientos/:id -> actualizar (requiere autenticación)
export async function actualizar(req, res, next) {
  try {
    if (hayErroresValidacion(req, res)) return;

    const { id } = req.params;
    const alojamiento = await Alojamiento.findByPk(id);

    if (!alojamiento) {
      return res.status(404).json({ message: 'Alojamiento no encontrado' });
    }

    const { nombre, categoria, direccion, telefonos, web } = req.body;
    // En edición parcial, conserva valores existentes cuando el campo no se envía
    const telefonosFinal = Array.isArray(telefonos) ? telefonos : alojamiento.telefonos;
    const telefono = telefonoVisible(telefonosFinal, req.body.telefono || alojamiento.telefono);

    await alojamiento.update({
      nombre,
      categoria,
      direccion,
      telefono,
      telefonos: telefonosFinal,
      web
    });

    res.json(alojamiento);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/alojamientos/:id -> eliminar (requiere autenticación)
export async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    const alojamiento = await Alojamiento.findByPk(id);

    if (!alojamiento) {
      return res.status(404).json({ message: 'Alojamiento no encontrado' });
    }

    await alojamiento.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}