import { Router } from "express";
import {getAll,registrar,actualizar} from '../controllers/caracteristicasController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router()

router.get('/caracteristicas',getAll);
router.post('/caracteristicas',registrar);
router.put('/caracteristicas/:id',actualizar);


export default router