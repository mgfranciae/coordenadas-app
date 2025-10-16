import { Router } from 'express';
import {
  recibirCoordenadas,
  ajustarIntervalo,
  obtenerCoordenadas
} from '../controllers/coordenadas.controller.js';

const router = Router();

router.post('/coordenadas', recibirCoordenadas); // Recibir nuevas coordenadas
router.post('/refrescar', ajustarIntervalo);     // Ajustar intervalo
router.get('/coordenadas', obtenerCoordenadas);  // (opcional) para pruebas

export default router;