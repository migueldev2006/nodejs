import Router from "express";
import {
  RegistrarArea,
  ActualizarArea,
  Listar_Áreas,
  Desactivar_Area
} from "../controllers/AreasControllers.js";

const router = Router();

router.get("/areas", Listar_Áreas);
router.put("/areas/:id_area", ActualizarArea);
router.put("/areas/estado/:id_area", Desactivar_Area);
router.post("/areas", RegistrarArea);

export default router;
