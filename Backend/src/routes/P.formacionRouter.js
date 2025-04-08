import Router from "express";
import {
  Registrar_Programas_de_Formación,
  Actualizar_Programas_de_Formación,
  Listar_Programas_de_Formación,
  Desactivar_Programas_de_Formación,
} from "../controllers/P.formacionControllers.js";

const router = Router();

router.post("/P.formacion", Registrar_Programas_de_Formación);
router.put("/P.formacion/:id_programa", Actualizar_Programas_de_Formación);
router.get("/P.formacion", Listar_Programas_de_Formación);
router.put("/P.formacion/estado/:id_programa", Desactivar_Programas_de_Formación);

export default router;
