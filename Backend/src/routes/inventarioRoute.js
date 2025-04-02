import { Router } from "express";
import { actualizarInventarios, cargarImagen, cambiarEstadoInventario, listarInventarios, registrarInventarios } from "../controllers/inventarioController.js";


export const inventarioRoute = Router();

inventarioRoute.post('/inventario/', cargarImagen, registrarInventarios);
inventarioRoute.put('/inventario/:id_inventario', cargarImagen, actualizarInventarios);
inventarioRoute.put('/inventario/cambiarEstado/:id_inventario', cambiarEstadoInventario);
inventarioRoute.get('/inventario/', listarInventarios);