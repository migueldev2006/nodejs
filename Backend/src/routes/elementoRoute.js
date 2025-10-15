    import {Router} from 'express';
    import { registrarElementos, actualizarElementos, cambiarEstadoElemento, listarElementos, cargarImagen,elementosUso, elementosPrestados, elementosDadosBaja, salidaIngresoElementos, elementosCaducados} from '../controllers/elementoController.js';

    export const elementoRoute = Router();

    elementoRoute.post('/elemento', cargarImagen, registrarElementos);
    elementoRoute.put('/elemento/:id_elemento', cargarImagen, actualizarElementos);
    elementoRoute.put('/elemento/cambiarEstado/:id_elemento', cambiarEstadoElemento);
    elementoRoute.get('/elemento', listarElementos);
    elementoRoute.get('/elemento/usos', elementosUso);
    elementoRoute.get('/elemento/prestamo', elementosPrestados);
    elementoRoute.get('/elemento/dadosBaja', elementosDadosBaja);
    elementoRoute.get('/elemento/salidaIngresoElementos', salidaIngresoElementos);
    elementoRoute.get('/elemento/caducado', elementosCaducados);
