import Router from 'express'
import {Registrar_Ficha,Actualizar_Ficha,Listar_Fichas,Desactivar_Ficha} from '../controllers/FichaControllers.js'

const  router = Router();



router.get('/fichas',Listar_Fichas)
router.post('/fichas',Registrar_Ficha)
router.put('/fichas/:id_ficha',Actualizar_Ficha)
router.put('/fichas/estado/:id_ficha',Desactivar_Ficha)


export default router;