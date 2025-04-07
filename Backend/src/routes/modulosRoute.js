import { Router } from "express";
import {registrar,actualizar,cambiaEstado,getAll} from '../controllers/modulosController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router()

router.get('/modulos',  getAll);
router.post('/modulos', registrar);
router.put('/modulos/:id',  actualizar);
router.put('/modulos/estado/:id',  cambiaEstado);


export default router