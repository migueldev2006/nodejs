    import {Router} from 'express';
    import { registrarElementos, actualizarElementos, cambiarEstadoElemento, listarElementos, cargarImagen,elementosUso } from '../controllers/elementoController.js';

    export const elementoRoute = Router();

    elementoRoute.post('/elemento', cargarImagen, registrarElementos);
    elementoRoute.put('/elemento/:id_elemento', cargarImagen, actualizarElementos);
    elementoRoute.put('/elemento/cambiarEstado/:id_elemento', cambiarEstadoElemento);
    elementoRoute.get('/elemento', listarElementos);
    elementoRoute.get('/elemento/usos', elementosUso);