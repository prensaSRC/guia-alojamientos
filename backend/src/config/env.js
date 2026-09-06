import dotenv from 'dotenv';
import { existsSync } from 'node:fs';

// En producción busca .env.production (para probar localmente contra la DB remota).
// En Railway/Netlify las variables reales viven en el panel y tienen prioridad
// porque dotenv nunca pisa las variables ya definidas en el entorno.
const archivo =
  process.env.NODE_ENV === 'production' && existsSync('.env.production')
    ? '.env.production'
    : '.env';

dotenv.config({ path: archivo, quiet: true });