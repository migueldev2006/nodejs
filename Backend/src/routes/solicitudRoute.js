import { Router } from "express";
import { registrarSolicitudes, actualizarSolicitudes, listarSolicitudes, aceptarSolicitudes, rechazarSolicitudes } from "../controllers/solicitudController.js";

export const solicitudRoute = Router();

solicitudRoute.post('/solicitud/', registrarSolicitudes);
solicitudRoute.put('/solicitud/:id_solicitud', actualizarSolicitudes);
solicitudRoute.put('/solicitud/aceptar/:id_solicitud', aceptarSolicitudes);
solicitudRoute.put('/solicitud/rechazar/:id_solicitud', rechazarSolicitudes)
solicitudRoute.get('/solicitud/', listarSolicitudes);