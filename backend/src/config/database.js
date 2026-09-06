import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { createConnection } from 'mysql2/promise';

const DB_NAME = process.env.DB_NAME || 'guia_alojamientos';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT) || 3306;

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
  dialectOptions: {
    charset: 'utf8mb4'
  }
});

// Crea la base de datos si no existe (necesaria antes de sync/seed)
export async function createDatabaseIfNotExists() {
  const connection = await createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: false
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await connection.end();
}