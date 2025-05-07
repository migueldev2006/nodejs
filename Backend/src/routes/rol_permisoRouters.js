import Router from "express";
import {Registrar_rol_permiso, Actualizar_rol_permiso, Listar_rol_permiso} from '../controllers/rol_permisoControllers.js'

const router = Router();

router.post("/rol_permiso", Registrar_rol_permiso);
router.put("/rol_permiso/:id_rol_permiso", Actualizar_rol_permiso);
router.get("/rol_permiso", Listar_rol_permiso);


export default router;
