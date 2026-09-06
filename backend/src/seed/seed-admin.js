import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createDatabaseIfNotExists } from '../config/database.js';
import { sequelize, Usuario } from '../models/index.js';

const email = process.env.ADMIN_EMAIL || 'admin@santarosacalamuchita.gob.ar';
const password = process.env.ADMIN_PASSWORD || 'admin1234';
const nombre = process.env.ADMIN_NOMBRE || 'Administrador';

async function seedAdmin() {
  try {
    await createDatabaseIfNotExists();
    await sequelize.sync();

    const [usuario, creado] = await Usuario.findOrCreate({
      where: { email },
      defaults: {
        password: bcrypt.hashSync(password, 10),
        nombre,
        role: 'admin'
      }
    });

    if (creado) {
      console.log(`✅ Usuario admin creado: ${usuario.email}`);
    } else {
      console.log(`ℹ️  El usuario ${usuario.email} ya existía.`);
    }

    if (password === 'admin1234') {
      console.warn('⚠️  Estás usando la contraseña por defecto. Cambiala en backend/.env (ADMIN_PASSWORD).');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error al crear el usuario admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();