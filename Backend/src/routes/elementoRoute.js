import {Router} from 'express';
import { registrarElementos, actualizarElementos, cambiarEstadoElemento, listarElementos } from '../controllers/elementoController.js';

export const elementoRoute = Router();

elementoRoute.post('/elemento/', registrarElementos);
elementoRoute.put('/elemento/:id_elemento', actualizarElementos);
elementoRoute.put('/elemento/cambiarEstado/:id_elemento', cambiarEstadoElemento);
elementoRoute.get('/elemento/', listarElementos);