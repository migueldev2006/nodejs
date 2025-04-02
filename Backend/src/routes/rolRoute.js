import { Router } from "express";
import { actualizarRol, buscarRol, cambiarEstadoRol, listarRoles, registrarRol } from "../controllers/rolController.js";

export const rolRoute = Router();

rolRoute.post('/rol/', registrarRol);
rolRoute.put('/rol/:id_rol', actualizarRol);
rolRoute.put('/rol/cambiarEstado/:id_rol', cambiarEstadoRol);
rolRoute.get('/rol/', listarRoles)