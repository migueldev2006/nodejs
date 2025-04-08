import Router from "express";
import {Registrar_rol_modulo, Actualizar_rol_modulo, Listar_rol_modulo} from '../controllers/rol_moduloControllers.js'

const router = Router();

router.post("/rol_modulo", Registrar_rol_modulo);
router.put("/rol_modulo/:id_rol_modulo", Actualizar_rol_modulo);
router.get("/rol_modulo", Listar_rol_modulo);


export default router;
