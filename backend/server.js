import './src/config/env.js';
import express from 'express';
import cors from 'cors';

import { sequelize, createDatabaseIfNotExists } from './src/config/database.js';
import alojamientoRoutes from './src/routes/alojamiento.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import { notFound } from './src/middlewares/notFound.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

const app = express();

// Middlewares globales
// CORS: por defecto acepta cualquier origen; si FRONTEND_URL está definida
// (producción) solo acepta peticiones desde ese dominio.
const FRONTEND_URL = process.env.FRONTEND_URL || '';
app.use(
  cors({
    origin: FRONTEND_URL ? [FRONTEND_URL] : true
  })
);
app.use(express.json());

// Ruta de salud (para verificar que el servidor responde sin tocar la DB)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/alojamientos', alojamientoRoutes);

// Middlewares de 404 y errores
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // Crear la base si no existe
    await createDatabaseIfNotExists();

    // Sincronizar modelos (crea/actualiza la tabla)
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

iniciarServidor();