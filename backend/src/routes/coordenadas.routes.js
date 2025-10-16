import { Router } from 'express';
import { getCoordinates } from '../controllers/coordenadas.controller.js';

const router = Router();
router.post('/coordenadas', getCoordinates);
console.log("rutas");
export default router;