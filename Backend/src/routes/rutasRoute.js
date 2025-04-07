import { Router } from "express";
import {registrar,actualizar,cambiaEstado,getAll} from '../controllers/rutasController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router()

router.get('/rutas', getAll);
router.post('/rutas', registrar);
router.put('/rutas/:id', actualizar);
router.put('/rutas/estado/:id', cambiaEstado);


export default router