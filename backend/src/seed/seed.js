import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { sequelize, createDatabaseIfNotExists } from '../config/database.js';
import Alojamiento from '../models/alojamiento.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '../../../data.json');

async function seed() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`No se encontró ${DATA_PATH}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  await createDatabaseIfNotExists();
  await sequelize.sync({ alter: true });

  // Limpiar la tabla antes de cargar
  await Alojamiento.destroy({ where: {}, truncate: true });

  const registros = data.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    categoria: r.categoria,
    direccion: r.direccion || '',
    telefono: r.telefono || '',
    telefonos: r.telefonos || null,
    web: r.web || ''
  }));

  const creados = await Alojamiento.bulkCreate(registros);

  console.log(`Seed completado: ${creados.length} alojamientos cargados.`);
  await sequelize.close();
}

seed().catch((error) => {
  console.error('Error en el seed:', error.message);
  process.exit(1);
});