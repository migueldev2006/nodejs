import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Areas from './src/routes/AreasRouters.js';
import P_formacion from './src/routes/P.formacionRouter.js'
import sitios from './src/routes/SitiosRouters.js'
import sedes from './src/routes/SedeRouters.js'
import fichas from './src/routes/FichasRouters.js'
import UsersFichas from './src/routes/usersFichasRouters.js'
import rol_modulo from './src/routes/rol_moduloRouters.js'
import Permisos from './src/routes/permisosRouters.js'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(Areas);
app.use(P_formacion);
app.use(sitios);
app.use(sedes);
app.use(fichas);
app.use(UsersFichas);
app.use(rol_modulo);
app.use(Permisos);

app.listen(3000, () => {
  console.log("API activa en el servidor 3000");
});
