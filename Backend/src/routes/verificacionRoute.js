import {Router} from "express";
import { registrarVerificacion, listarVerificaciones, actualizarVerificacion, traerElementosSitio } from "../controllers/verificacionController.js";

export const verificacionRoute = Router();

verificacionRoute.post('/verificacion/', registrarVerificacion);
verificacionRoute.put('/verificacion/update/:id_verificacion', actualizarVerificacion);
verificacionRoute.get('/verificacion/', listarVerificaciones);
verificacionRoute.get('/verificacion/:id_sitio', traerElementosSitio);