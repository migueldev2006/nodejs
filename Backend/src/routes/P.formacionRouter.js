import Router from "express";
import {
  Registrar_Programas_de_Formación,
  Actualizar_Programas_de_Formación,
  Listar_Programas_de_Formación,
  Desactivar_Programas_de_Formación,
} from "../controllers/P.formacionControllers.js";

const router = Router();

router.post("/programaFormacion", Registrar_Programas_de_Formación);
router.put("/programaFormacion/:id_programa", Actualizar_Programas_de_Formación);
router.get("/programaFormacion", Listar_Programas_de_Formación);
router.put("/programaFormacion/estado/:id_programa", Desactivar_Programas_de_Formación);

export default router;
