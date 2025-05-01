import Router from 'express'
import { Registrar_Sitio,Actualizar_Sitio,Desactivar_Sitio,Listar_Sitios, obtenerTopSitiosPorElementos, obtenerAreaConMasElementos, obtenerElementosPorAgotarse} from '../controllers/SitiosControllers.js'

const router = Router();

router.post("/sitio",Registrar_Sitio)
router.put("/sitio/:id_sitio",Actualizar_Sitio)
router.put("/sitio/estado/:id_sitio",Desactivar_Sitio)
router.get("/sitio",Listar_Sitios)
router.get("/reporte/sitio",obtenerTopSitiosPorElementos)
router.get("/reporte/sitio/elemento",obtenerAreaConMasElementos)
router.get("/reporte/sitio/agotado",obtenerElementosPorAgotarse)


export default router;