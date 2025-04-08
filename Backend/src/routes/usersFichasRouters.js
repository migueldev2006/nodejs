import Router from 'express'
import {RegistrarUsersFichas, ActualizarUsersFichas, Listar_UsersFichas, } from '../controllers/usersFichasControllers.js'

const router = Router();

router.post("/UsersFichas",RegistrarUsersFichas)
router.put("/UsersFichas/:id_usuario_ficha",ActualizarUsersFichas)
router.get("/UsersFichas",Listar_UsersFichas)


export default router;