import { Router } from "express";
import {registrar,actualizar,cambiaEstado,getAll} from '../controllers/centroController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router()

router.get('/centros',getAll);
router.post('/centros',registrar);
router.put('/centros/:id',actualizar);
router.put('/centros/estado/:id',cambiaEstado);


export default router