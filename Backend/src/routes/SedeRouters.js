import Router from "express";
import {
  Registrar_Sede,
  Actualizar_Sede,
  Listar_Sedes,
  Desactivar_Sede
} from "../controllers/SedeControllers.js";

const router = Router();

router.post("/sede", Registrar_Sede);
router.put("/sede/:id_sede", Actualizar_Sede);
router.get("/sede", Listar_Sedes);
router.put("/sede/estado/:id_sede", Desactivar_Sede);

export default router;
