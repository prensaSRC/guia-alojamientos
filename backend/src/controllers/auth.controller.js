import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Usuario from '../models/usuario.model.js';

function sinPassword(usuario) {
  return { id: usuario.id, email: usuario.email, nombre: usuario.nombre, role: usuario.role };
}

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register -> crear usuario (solo para desarrollo)
export async function registrar(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ message: 'Datos inválidos', errores: errores.array() });
    }

    const { email, password, nombre } = req.body;

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const usuario = await Usuario.create({
      email,
      password: hash,
      nombre,
      role: 'admin'
    });

    res.status(201).json({ usuario: sinPassword(usuario) });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login -> validar credenciales y devolver JWT
export async function iniciarSesion(req, res, next) {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ message: 'Datos inválidos', errores: errores.array() });
    }

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.validarPassword(password)) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const token = generarToken(usuario);

    res.json({ token, usuario: sinPassword(usuario) });
  } catch (error) {
    next(error);
  }
}