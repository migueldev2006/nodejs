import { Router } from "express";
import { login,logout,registrar,actualizar,cambiarEstado,listar} from '../controllers/usuarioController.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyRol from "../middlewares/verifyRol.js";
const router = Router()


router.get('/usuarios', verifyToken(), listar);
router.post('/usuarios/login',login);
router.post('/usuarios/cerrar',verifyToken(), logout);
router.post('/usuarios', registrar);
router.put('/usuarios/:id',actualizar);
router.put('/usuarios/estado/:id', cambiarEstado);


export default router
