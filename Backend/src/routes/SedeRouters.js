import Router from "express";
import {
  Registrar_Sede,
  Actualizar_Sede,
  Listar_Sedes,
  Desactivar_Sede
} from "../controllers/SedeControllers.js";

const router = Router();

router.post("/Sede", Registrar_Sede);
router.put("/Sede/:id_sede", Actualizar_Sede);
router.get("/Sede", Listar_Sedes);
router.put("/Sede/estado/:id_sede", Desactivar_Sede);

export default router;
