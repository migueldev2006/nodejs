import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Areas from './src/routes/AreasRouters.js';
import P_formacion from './src/routes/P.formacionRouter.js'
import sitios from './src/routes/SitiosRouters.js'
import sedes from './src/routes/SedeRouters.js'
import fichas from './src/routes/FichasRouters.js'
import UsersFichas from './src/routes/usersFichasRouters.js'
import rol_permiso from './src/routes/rol_permisoRouters.js'
import Permisos from './src/routes/permisosRouters.js'
import usuarioRouter from './src/routes/usuarioRoute.js'
import centrosRouter from './src/routes/centrosRoute.js'
import tipoSitiosRouter from './src/routes/tipoSitioRoute.js'
import municipiosRouter from './src/routes/municipioRoute.js'
import categoriasRouter from './src/routes/categoriasRoute.js'
import rutasRoute from './src/routes/rutasRoute.js'
import modulosRoute from './src/routes/modulosRoute.js'
import caracterisRoute from './src/routes/caracteristicasRoute.js'
import { elementoRoute } from './src/routes/elementoRoute.js'
import { inventarioRoute } from './src/routes/inventarioRoute.js'
import { movimientoRoute } from './src/routes/movimientoRoute.js'
import { rolRoute } from './src/routes/rolRoute.js'
import { solicitudRoute } from './src/routes/solicitudRoute.js'
import { tipoMovimientoRoute } from './src/routes/tipoMovimientoRoute.js'
import { unidadMedidaRoute } from './src/routes/unidadMedidaRoute.js'
import { verificacionRoute } from './src/routes/verificacionRoute.js'
//import { notificaciónRoute } from "./src/routes/notificacionesRoute.js";
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
//import morgan from "morgan";

const swaggerData = JSON.parse(fs.readFileSync(path.resolve('swagger.json'), 'utf-8'));
console.log(swaggerData)

const app = express();

app.use(bodyParser.json({limit:'12mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'12mb'}));
//app.use(morgan());

app.use("/documentacion", swaggerUI.serve, swaggerUI.setup(swaggerData));

app.use(cors());
app.use('/img', express.static(path.join(process.cwd(), 'public/img')));

app.use(Areas);
app.use(P_formacion);
app.use(sitios);
app.use(sedes);
app.use(fichas);
app.use(UsersFichas);
app.use(rol_permiso);
app.use(Permisos);
app.use(usuarioRouter);
app.use(centrosRouter);
app.use(tipoSitiosRouter);
app.use(municipiosRouter);
app.use(categoriasRouter);
app.use(rutasRoute);
app.use(modulosRoute);
app.use(caracterisRoute);
app.use(elementoRoute);
app.use(inventarioRoute);
app.use(movimientoRoute);
app.use(rolRoute);
app.use(solicitudRoute);
app.use(tipoMovimientoRoute);
app.use(unidadMedidaRoute);
app.use(verificacionRoute);
//app.use(notificaciónRoute);

app.listen(3000, () => {
  console.log("API activa en el servidor 3000");
});
