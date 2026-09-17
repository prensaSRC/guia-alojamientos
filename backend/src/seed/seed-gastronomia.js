import 'dotenv/config';
import { sequelize } from '../config/database.js';
import Gastronomia from '../models/gastronomia.model.js';

// 2 locales de demostración por cada categoría gastronómica (8 x 2 = 16).
// Datos ficticios solo para visualizar la Guía de Gastronomía en rojo.
const LOCALES = [
  // RESTAURANTES (2)
  {
    nombre: 'Restaurante El Rincón del Sol',
    categoria: 'restaurante',
    direccion: 'Av. Belgrano 1240',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 42-1122', e164: '+5493546421122', whatsapp: '5493546421122' },
    ],
    web: 'https://elrincondelsol.example.com',
  },
  {
    nombre: 'Parrilla y Restaurante Don Pedro',
    categoria: 'restaurante',
    direccion: 'Sarmiento 890',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 43-3344', e164: '+5493546433344', whatsapp: '5493546433344' },
    ],
    web: '',
  },
  // PIZZERÍAS (2)
  {
    nombre: 'Pizzería La Muzzarella',
    categoria: 'pizzería',
    direccion: 'San Martín 315',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 42-5566', e164: '+5493546425566', whatsapp: '5493546425566' },
    ],
    web: '',
  },
  {
    nombre: 'Pizzería Il Forno',
    categoria: 'pizzería',
    direccion: 'Rivadavia 720',
    telefonos: [
      { tipo: 'celular', numero: '(03546) 15-66-7788', e164: '+5493546667788', whatsapp: '5493546667788' },
    ],
    web: 'https://pizzeriailforno.example.com',
  },
  // BARES Y PUBS (2)
  {
    nombre: 'Bar El Encuentro',
    categoria: 'bares y pubs',
    direccion: '25 de Mayo 501',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 42-9988', e164: '+5493546429988', whatsapp: '5493546429988' },
    ],
    web: '',
  },
  {
    nombre: 'Pub La Vía Láctea',
    categoria: 'bares y pubs',
    direccion: 'Av. Roque Sáenz Peña 1500',
    telefonos: [
      { tipo: 'celular', numero: '(03546) 15-77-1122', e164: '+5493546771122', whatsapp: '5493546771122' },
    ],
    web: '',
  },
  // COMIDAS PARA LLEVAR (2)
  {
    nombre: 'Rotisería La Mamma',
    categoria: 'comidas para llevar',
    direccion: 'José Ingenieros 210',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 43-7788', e164: '+5493546437788', whatsapp: '5493546437788' },
    ],
    web: '',
  },
  {
    nombre: 'Comidas para llevar El Alma',
    categoria: 'comidas para llevar',
    direccion: 'Colón 1005',
    telefonos: [
      { tipo: 'celular', numero: '(03546) 15-44-5566', e164: '+5493546445566', whatsapp: '5493546445566' },
    ],
    web: 'https://elalma.example.com',
  },
  // FAST FOOD (2)
  {
    nombre: 'Hamburguesería El Potrero',
    categoria: 'fast food',
    direccion: 'Belgrano 2321',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 42-6655', e164: '+5493546426655', whatsapp: '5493546426655' },
    ],
    web: '',
  },
  {
    nombre: 'Lo de Leo – Fast Food',
    categoria: 'fast food',
    direccion: 'Sobremonte 845',
    telefonos: [
      { tipo: 'celular', numero: '(03546) 15-88-2233', e164: '+5493546882233', whatsapp: '5493546882233' },
    ],
    web: '',
  },
  // HELADERÍAS (2)
  {
    nombre: 'Heladería Copacabana',
    categoria: 'heladería',
    direccion: 'San Martín 220',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 42-3345', e164: '+5493546423345', whatsapp: '5493546423345' },
    ],
    web: 'https://copacabanahelados.example.com',
  },
  {
    nombre: 'Heladería Dos Corazones',
    categoria: 'heladería',
    direccion: 'Rivadavia 410',
    telefonos: [
      { tipo: 'celular', numero: '(03546) 15-99-4455', e164: '+5493546994455', whatsapp: '5493546994455' },
    ],
    web: '',
  },
  // CAFETERÍAS (2)
  {
    nombre: 'Café Bohemia',
    categoria: 'cafetería',
    direccion: '25 de Mayo 118',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 43-2211', e164: '+5493546432211', whatsapp: '5493546432211' },
    ],
    web: 'https://cafebohemia.example.com',
  },
  {
    nombre: 'Cafetería La Estación',
    categoria: 'cafetería',
    direccion: 'Estación 45',
    telefonos: [
      { tipo: 'celular', numero: '(03546) 15-55-6677', e164: '+5493546556677', whatsapp: '5493546556677' },
    ],
    web: '',
  },
  // PARRILLAS (2)
  {
    nombre: 'Parrilla El Fogón',
    categoria: 'parrilla',
    direccion: 'Av. Belgrano 3960',
    telefonos: [
      { tipo: 'fijo', numero: '(03546) 42-8877', e164: '+5493546428877', whatsapp: '5493546428877' },
    ],
    web: '',
  },
  {
    nombre: 'Parrilla La Cruz del Sur',
    categoria: 'parrilla',
    direccion: 'Costanera s/n',
    telefonos: [
      { tipo: 'celular', numero: '(03546) 15-22-9933', e164: '+5493546229933', whatsapp: '5493546229933' },
    ],
    web: 'https://lacruzdelsur.example.com',
  },
];

async function seedGastronomia() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await Gastronomia.destroy({ where: {}, truncate: true });

  const creados = await Gastronomia.bulkCreate(LOCALES.map((l, i) => ({ id: i + 1, ...l })));

  console.log(`Seed de gastronomía completado: ${creados.length} locales cargados (2 por categoría).`);

  const porCategoria = {};
  for (const l of creados) {
    porCategoria[l.categoria] = (porCategoria[l.categoria] || 0) + 1;
  }
  console.log('Por categoría:', JSON.stringify(porCategoria));

  await sequelize.close();
}

seedGastronomia().catch((error) => {
  console.error('Error en el seed de gastronomía:', error.message);
  process.exit(1);
});
