import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import apiRoutes from './routes/api.routes.js';
import {
  obtenerIntervaloEnvio,
  obtenerUltimasCoordenadas
} from './services/almacenCoordenadas.js';
import {
  configurarClientes,
  iniciarEmisor
} from './services/emisorWebSocket.js';

const app = express();
const puerto = process.env.PUERTO || 3001;
const intervaloPorDefecto = process.env.INTERVALO_ENVIO_MS
  ? parseInt(process.env.INTERVALO_ENVIO_MS, 10)
  : 2000;

// Aplicar intervalo por defecto
import { establecerIntervaloEnvio } from './services/almacenCoordenadas.js';
establecerIntervaloEnvio(intervaloPorDefecto);

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const servidorHttp = http.createServer(app);
const servidorWebSocket = new WebSocketServer({ server: servidorHttp });

const clientes = new Set();
configurarClientes(clientes);

servidorWebSocket.on('connection', (cliente) => {
  console.log('🟢 Nuevo cliente WebSocket conectado');
  clientes.add(cliente);

  // Enviar coordenadas actuales si existen
  const coords = obtenerUltimasCoordenadas();
  if (coords) {
    cliente.send(JSON.stringify(coords));
  }

  cliente.on('close', () => {
    console.log('🔴 Cliente desconectado');
    clientes.delete(cliente);
  });

  cliente.on('error', (err) => {
    console.error('❌ Error WebSocket:', err);
    clientes.delete(cliente);
  });
});

// Iniciar el emisor de coordenadas
iniciarEmisor();

servidorHttp.listen(puerto, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${puerto}`);
  console.log(`📡 WebSocket listo en ws://localhost:${puerto}`);
  console.log(`⏱️ Intervalo inicial: ${obtenerIntervaloEnvio()} ms`);
});