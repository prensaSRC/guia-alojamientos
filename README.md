# Guía de Alojamientos – Santa Rosa de Calamuchita

Sitio público para consultar los alojamientos turísticos del municipio, con un panel de administración protegido para gestionarlos (crear, editar, eliminar).

## Estructura del proyecto

```
guia-alojamientos/
├── backend/          # API REST (Express + Sequelize + MySQL)
├── frontend/         # Aplicación web (React + Vite + MUI)
├── data.json         # Datos de seed (561 alojamientos)
├── data.backup.json  # Copia de seguridad de los datos
└── tools/            # Scripts auxiliares de normalización
```

## Stack

- **Backend**: Node.js (ESM), Express, Sequelize, mysql2, JWT, bcryptjs.
- **Frontend**: React 19, Vite, MUI v9, React Router.

## Requisitos

- Node.js 18 o superior (con npm).
- MySQL 5.7+ (para desarrollo local).

## Puesta en marcha local

### 1. Base de datos

Crear una base MySQL (default: `guia_alojamientos`) con acceso root local, o definir otro usuario en `backend/.env`.

### 2. Backend

```bash
cd backend
cp .env.example .env   # completar si hace falta
npm install
npm run seed           # carga los 561 alojamientos
npm run seed:admin     # crea el usuario administrador
npm run dev            # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

En desarrollo el proxy de Vite envía `/api` a `localhost:3000`, así que no hace falta configurar nada más.

### 4. Acceso al panel

Entrar a `http://localhost:5173/admin` e iniciar sesión con el email y password definidos en `backend/.env` (por defecto `admin@santarosacalamuchita.gob.ar` / `admin1234`).

## Scripts

| Comando (en cada carpeta) | Descripción |
| --- | --- |
| `npm run dev` (backend) | Servidor con recarga automática (nodemon) |
| `npm run start` (backend) | Arranca el servidor de producción |
| `npm run seed` (backend) | Carga los alojamientos desde `data.json` |
| `npm run seed:admin` (backend) | Crea o reusa el usuario administrador |
| `npm run dev` (frontend) | Servidor de desarrollo con HMR |
| `npm run build` (frontend) | Build de producción en `dist/` |
| `npm run lint` (frontend) | Lint con oxlint |
| `npm run preview` (frontend) | Sirve el build localmente |

## Variables de entorno

### Backend (`backend/.env` local / panel de Railway en producción)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DB_URL` | Cadena completa de conexión MySQL (Clever Cloud). Alternativa a `DB_*` | `mysql://user:pass@host:3306/db` |
| `DB_USE_SSL` | `true` si la conexión remota requiere SSL (Clever Cloud) | `true` |
| `DB_HOST` / `DB_PORT` | Host y puerto (si no usás `DB_URL`) | `localhost` / `3306` |
| `DB_USER` / `DB_PASSWORD` | Usuario y password (si no usás `DB_URL`) | `root` / |
| `DB_NAME` | Nombre de la base (si no usás `DB_URL`) | `guia_alojamientos` |
| `JWT_SECRET` | Secreto para firmar los tokens JWT | `(secreto largo)` |
| `FRONTEND_URL` | Dominio del frontend en Netlify (origen permitido por CORS) | `https://sitio.netlify.app` |
| `PORT` | Puerto del servidor (Railway define su propio) | `3000` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NOMBRE` | Usuario administrador que crea `seed:admin` | |

### Frontend (`frontend/.env` local / variables de Netlify)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | Base de la API (build-time). | `https://back.up.railway.app/api` |

> `VITE_API_URL` se resuelve **en el build**: hay que setearla en Netlify (o en `frontend/.env.production` para builds locales).

## Deploy a producción

Arquitectura: **Railway** (backend) + **Clever Cloud** (MySQL) + **Netlify** (frontend).

### 0. Subir el código a GitHub

```bash
git init
git add -A
git commit -m "Inicia proyecto"
git remote add origin https://github.com/TU-USUARIO/guia-alojamientos.git
git push -u origin main
```

El repo debe contener `backend/` y `frontend/` en la raíz.

### 1. Base de datos (Clever Cloud)

1. Crear un servicio **MySQL** en Clever Cloud.
2. Copiar la **cadena de conexión** que provee el panel (formato `mysql://usuario:password@host:puerto/nombre_db`).
3. El acceso remoto requiere SSL.

### 2. Backend (Railway)

1. **New Project → Deploy from GitHub** → elegir el repo.
2. Configurar el servicio para usar la carpeta `/backend` como **root directory**.
3. Agregar las variables de entorno (ver tabla de backend): `DB_URL`, `DB_USE_SSL=true`, `FRONTEND_URL`, `JWT_SECRET` (fuerte), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Start command: `npm run start`.
5. Deploy y copiar el dominio asignado (ej. `https://guiadealojamientos.up.railway.app`).

### 3. Cargar datos en producción

Los seeds se corren contra la base remota usando las mismas variables:

- Desde el panel de Railway (una sola vez): ejecutar `npm run seed` y `npm run seed:admin`.
- O con la CLI de Railway (linkeado al proyecto): `railway run npm run seed` y `railway run npm run seed:admin`.

> Para rotar la contraseña de un admin ya creado `seed:admin` **no la actualiza** (usa `findOrCreate`): borrá la fila del usuario o actualizala con una consulta SQL.

### 4. Frontend (Netlify)

1. **Add new site → Import an existing project → GitHub** → elegir el repo.
2. La configuración de build se lee de `frontend/netlify.toml` (base `frontend`, build `npm run build`, publish `dist`).
3. Agregar la variable de entorno `VITE_API_URL` = dominio del backend Railway.
4. Deploy. Netlify asigna un dominio (ej. `https://guiadealojamientos.netlify.app`).

### 5. Cerrar el círculo

1. Copiar el dominio final de Netlify a la variable `FRONTEND_URL` del backend en Railway y redeployar (para que CORS solo acepte ese origen).
2. Verificar:
   - `GET https://BACKEND/api/health` → `{ "status": "ok" }`
   - La web pública carga los alojamientos desde el backend.
   - `/admin` permite iniciar sesión.

## Seguridad

- Usar un `JWT_SECRET` fuerte y distinto al de desarrollo (generar con `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`).
- Definir un `ADMIN_PASSWORD` fuerte antes de correr `seed:admin` en producción.
- No commitear valores reales de entorno: los archivos `.env*` están gitignoreados (solo se suben `.env.example` y `.env.production.example`).

## Solución de problemas

| Síntoma | Revisar |
| --- | --- |
| "Connection closed / SSL" | `DB_USE_SSL=true` en la conexión remota |
| El backend responde pero la web no carga datos | `VITE_API_URL` en Netlify (requiere nuevo build) y `FRONTEND_URL` en Railway |
| Error "Access denied" al arrancar en cloud | El usuario de Clever Cloud no tiene `CREATE DATABASE`; la base ya existe, el backend lo tolera y continúa |
| Errores de CORS en consola del navegador | `FRONTEND_URL` debe incluir el protocolo (ej. `https://...netlify.app`) |