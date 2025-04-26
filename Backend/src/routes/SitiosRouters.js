import Router from 'express'
import { Registrar_Sitio,Actualizar_Sitio,Desactivar_Sitio,Listar_Sitios} from '../controllers/SitiosControllers.js'

const router = Router();

router.post("/sitio",Registrar_Sitio)
router.put("/sitio/:id_sitio",Actualizar_Sitio)
router.put("/sitio/estado/:id_sitio",Desactivar_Sitio)
router.get("/sitio",Listar_Sitios)


export default router;