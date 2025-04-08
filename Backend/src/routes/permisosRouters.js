import Router from "express";
import { Listar__Permisos, Actualizar_Permisos, Registrar_Permisos} from '../controllers/permisosControllers.js'
 
const router = Router();

router.get("/Permisos", Listar__Permisos);
router.put("/Permisos/:id_permiso", Actualizar_Permisos);
router.post("/Permisos", Registrar_Permisos);

export default router;
