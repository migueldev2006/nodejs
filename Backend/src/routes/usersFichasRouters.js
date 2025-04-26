import Router from 'express'
import {RegistrarUsersFichas, ActualizarUsersFichas, Listar_UsersFichas, } from '../controllers/usersFichasControllers.js'

const router = Router();

router.post("/usersFichas",RegistrarUsersFichas)
router.put("/usersFichas/:id_usuario_ficha",ActualizarUsersFichas)
router.get("/usersFichas",Listar_UsersFichas)


export default router;