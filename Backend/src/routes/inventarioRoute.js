import { Router } from "express";
import { cambiarEstadoInventario, listarInventarios, registrarInventarios, reporteInventario, stockInventario } from "../controllers/inventarioController.js";


export const inventarioRoute = Router();

inventarioRoute.post('/inventario/', registrarInventarios);
// inventarioRoute.put('/inventario/:id_inventario', actualizarInventarios);
inventarioRoute.put('/inventario/cambiarEstado/:id_inventario', cambiarEstadoInventario);
inventarioRoute.get('/inventario/', listarInventarios);
inventarioRoute.get('/reporte/inventario', reporteInventario);
inventarioRoute.get('/inventario/stock', stockInventario);