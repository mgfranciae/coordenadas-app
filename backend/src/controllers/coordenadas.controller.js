import {
  guardarCoordenadas,
  establecerIntervaloEnvio,
  obtenerUltimasCoordenadas
} from '../services/almacenCoordenadas.js';
import { actualizarIntervalo } from '../services/emisorWebSocket.js';

// POST /api/coordenadas → recibe { latitud, longitud }
export const recibirCoordenadas = (req, res) => {
  const { latitud, longitud } = req.body;

  if (latitud == null || longitud == null) {
    return res.status(400).json({
      error: 'Se requieren los campos "latitud" y "longitud"'
    });
  }

  const lat = parseFloat(latitud);
  const lng = parseFloat(longitud);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({
      error: '"latitud" y "longitud" deben ser números'
    });
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({
      error: 'Coordenadas fuera de rango válido'
    });
  }

  guardarCoordenadas(lat, lng);
  return res.status(201).json({
    mensaje: 'Coordenadas recibidas y almacenadas',
    datos: { latitud: lat, longitud: lng }
  });
};

// POST /api/refrescar → recibe { intervalo_ms }
export const ajustarIntervalo = (req, res) => {
  const { intervalo_ms } = req.body;

  if (intervalo_ms == null) {
    return res.status(400).json({
      error: 'Se requiere el campo "intervalo_ms"'
    });
  }

  const ms = parseInt(intervalo_ms, 10);
  if (isNaN(ms) || ms < 500) {
    return res.status(400).json({
      error: '"intervalo_ms" debe ser un número entero >= 500'
    });
  }

  establecerIntervaloEnvio(ms);
  actualizarIntervalo(); // ← Reinicia el intervalo del emisor

  return res.json({
    mensaje: 'Intervalo de actualización ajustado',
    intervalo_ms: ms
  });
};

// GET /api/coordenadas → para pruebas (opcional)
export const obtenerCoordenadas = (req, res) => {
  const coords = obtenerUltimasCoordenadas();
  if (!coords) {
    return res.status(404).json({ error: 'No hay coordenadas almacenadas' });
  }
  return res.json(coords);
};