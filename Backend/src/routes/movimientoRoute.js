import {Router} from 'express';
import { aceptarMovimientos, actualizarMovimientos, cancelarMovimientos, listarMovimientos, registrarMovimientos,masUsados,movimientosMensuales } from '../controllers/movimientoController.js';

export const movimientoRoute = Router();

movimientoRoute.post('/movimiento/', registrarMovimientos);
movimientoRoute.put('/movimiento/:id_movimiento', actualizarMovimientos);
movimientoRoute.put('/movimiento/aceptar/:id_movimiento', aceptarMovimientos);
movimientoRoute.put('/movimiento/cancelar/:id_movimiento', cancelarMovimientos);
movimientoRoute.get('/movimiento/', listarMovimientos);
movimientoRoute.get('/movimiento/materiales', masUsados);
movimientoRoute.get('/movimiento/mensuales', movimientosMensuales);