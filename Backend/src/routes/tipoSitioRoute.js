import { Router } from "express";
import {registrar,actualizar,cambiaEstado,getAll} from '../controllers/tipoSitioController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router()

router.get('/tipoSitio', getAll);
router.post('/tipoSitio',registrar);
router.put('/tipoSitio/:id', actualizar);
router.put('/tipoSitio/estado/:id', cambiaEstado);


export default router