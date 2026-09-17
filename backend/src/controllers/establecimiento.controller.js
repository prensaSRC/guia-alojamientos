import { validationResult } from 'express-validator';

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

// Fábrica de controladores CRUD para cualquier rubro (alojamientos, gastronomía, etc.)
export function crearEstablecimientoController(Modelo, { etiquetaSingular = 'Establecimiento' } = {}) {
  return {
    // GET / -> todos los registros
    async obtenerTodos(req, res, next) {
      try {
        const registros = await Modelo.findAll({
          order: [['id', 'ASC']]
        });
        res.json(registros);
      } catch (error) {
        next(error);
      }
    },

    // GET /:id -> un registro por id
    async obtenerPorId(req, res, next) {
      try {
        const { id } = req.params;
        const registro = await Modelo.findByPk(id);

        if (!registro) {
          return res.status(404).json({ message: `${etiquetaSingular} no encontrado` });
        }

        res.json(registro);
      } catch (error) {
        next(error);
      }
    },

    // POST / -> crear (requiere autenticación)
    async crear(req, res, next) {
      try {
        if (hayErroresValidacion(req, res)) return;

        const { nombre, categoria, direccion, telefonos, web } = req.body;
        const telefono = telefonoVisible(telefonos, req.body.telefono || null);

        const registro = await Modelo.create({
          nombre,
          categoria,
          direccion,
          telefono,
          telefonos: telefonos || [],
          web
        });

        res.status(201).json(registro);
      } catch (error) {
        next(error);
      }
    },

    // PUT /:id -> actualizar (requiere autenticación)
    async actualizar(req, res, next) {
      try {
        if (hayErroresValidacion(req, res)) return;

        const { id } = req.params;
        const registro = await Modelo.findByPk(id);

        if (!registro) {
          return res.status(404).json({ message: `${etiquetaSingular} no encontrado` });
        }

        const { nombre, categoria, direccion, telefonos, web } = req.body;
        // En edición parcial, conserva valores existentes cuando el campo no se envía
        const telefonosFinal = Array.isArray(telefonos) ? telefonos : registro.telefonos;
        const telefono = telefonoVisible(telefonosFinal, req.body.telefono || registro.telefono);

        await registro.update({
          nombre,
          categoria,
          direccion,
          telefono,
          telefonos: telefonosFinal,
          web
        });

        res.json(registro);
      } catch (error) {
        next(error);
      }
    },

    // DELETE /:id -> eliminar (requiere autenticación)
    async eliminar(req, res, next) {
      try {
        const { id } = req.params;
        const registro = await Modelo.findByPk(id);

        if (!registro) {
          return res.status(404).json({ message: `${etiquetaSingular} no encontrado` });
        }

        await registro.destroy();
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    }
  };
}