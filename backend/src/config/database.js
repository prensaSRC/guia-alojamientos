import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { createConnection } from 'mysql2/promise';

// Se puede configurar con una sola cadena DB_URL (ej. mysql://user:pass@host:port/db)
// o con las variables individuales DB_* (formato local).
const DB_URL = process.env.DB_URL || '';
const USE_SSL = process.env.DB_USE_SSL === 'true';

let DB_NAME = process.env.DB_NAME || 'guia_alojamientos';
let DB_USER = process.env.DB_USER || 'root';
let DB_PASSWORD = process.env.DB_PASSWORD || '';
let DB_HOST = process.env.DB_HOST || 'localhost';
let DB_PORT = Number(process.env.DB_PORT) || 3306;

if (DB_URL) {
  try {
    const url = new URL(DB_URL);
    DB_NAME = url.pathname.replace(/^\//, '') || DB_NAME;
    DB_USER = decodeURIComponent(url.username) || DB_USER;
    DB_PASSWORD = decodeURIComponent(url.password) || DB_PASSWORD;
    DB_HOST = url.hostname || DB_HOST;
    DB_PORT = url.port ? Number(url.port) : DB_PORT;
  } catch (error) {
    console.warn('⚠️  No se pudo parsear DB_URL, usando variables individuales:', error.message);
  }
}

const dialectOptions = {
  charset: 'utf8mb4'
};

if (USE_SSL) {
  dialectOptions.ssl = { rejectUnauthorized: false };
}

// Instancia de Sequelize apuntando a la base de datos
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true
  },
  dialectOptions
});

// Intenta crear la base de datos si no existe. En plataformas cloud (Ej. Clever Cloud)
// el usuario de la DB suele no tener privilegios CREATE DATABASE, así que si falla
// solo se avisa y se continúa: el servicio ya provee la base creada.
export async function createDatabaseIfNotExists() {
  try {
    const connection = await createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: false,
      ...(USE_SSL ? { ssl: { rejectUnauthorized: false } } : {})
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    await connection.end();
  } catch (error) {
    console.warn(`⚠️  No se pudo verificar/crear la base "${DB_NAME}" (puede ser normal en cloud):`, error.message);
  }
}