import { Router } from "express";
import {registrar,actualizar,cambiaEstado,getAll} from '../controllers/municipioController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router()

router.get('/municipios',  getAll);
router.post('/municipios',  registrar);
router.put('/municipios/:id',  actualizar);
router.put('/municipios/estado/:id',  cambiaEstado);


export default router