import {Router} from "express";
import { registrarVerificacion, listarVerificaciones, actualizarVerificacion } from "../controllers/verificacionController.js";

export const verificacionRoute = Router();

verificacionRoute.post('/verificacion/register/', registrarVerificacion);
verificacionRoute.put('/verificacion/update/:id_verificacion', actualizarVerificacion);
verificacionRoute.get('/verificacion/', listarVerificaciones);