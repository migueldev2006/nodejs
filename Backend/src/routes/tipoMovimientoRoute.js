import { Router } from "express";
import { actualizarTipoMovimiento, cambiarEstadoTipoMovimiento, listarTipoMovimiento, registrarTipoMovimiento } from "../controllers/tipoMovimientoController.js";

export const tipoMovimientoRoute = Router();

tipoMovimientoRoute.post('/tipoMovimiento/', registrarTipoMovimiento);
tipoMovimientoRoute.put('/tipoMovimiento/:id_tipo', actualizarTipoMovimiento);
tipoMovimientoRoute.put('/tipoMovimiento/cambiarEstado/:id_tipo', cambiarEstadoTipoMovimiento);
tipoMovimientoRoute.get('/tipoMovimiento/', listarTipoMovimiento);