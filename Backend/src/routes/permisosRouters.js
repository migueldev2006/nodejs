import Router from "express";
import { Listar__Permisos, Actualizar_Permisos, Registrar_Permisos} from '../controllers/permisosControllers.js'
 
const router = Router();

router.get("/permisos", Listar__Permisos);
router.put("/permisos/:id_permiso", Actualizar_Permisos);
router.post("/permisos", Registrar_Permisos);

export default router;
