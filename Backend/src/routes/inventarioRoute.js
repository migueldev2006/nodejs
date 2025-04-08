import { Router } from "express";
import { actualizarInventarios, cambiarEstadoInventario, listarInventarios, registrarInventarios } from "../controllers/inventarioController.js";


export const inventarioRoute = Router();

inventarioRoute.post('/inventario/', registrarInventarios);
inventarioRoute.put('/inventario/:id_inventario', actualizarInventarios);
inventarioRoute.put('/inventario/cambiarEstado/:id_inventario', cambiarEstadoInventario);
inventarioRoute.get('/inventario/', listarInventarios);