import Router from "express";
import {
  RegistrarArea,
  ActualizarArea,
  Listar_Áreas,
  Desactivar_Area
} from "../controllers/AreasControllers.js";

const router = Router();

router.get("/Areas", Listar_Áreas);
router.put("/Areas/:id_Area", ActualizarArea);
router.put("/Areas/estado/:id_Area", Desactivar_Area);
router.post("/Areas", RegistrarArea);

export default router;
