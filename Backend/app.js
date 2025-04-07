import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usuarioRouter from './src/routes/usuarioRoute.js'
import centrosRouter from './src/routes/centrosRoute.js'
import tipoSitiosRouter from './src/routes/tipoSitioRoute.js'
import municipiosRouter from './src/routes/municipioRoute.js'
import categoriasRouter from './src/routes/categoriasRoute.js'
import rutasRoute from './src/routes/rutasRoute.js'
import modulosRoute from './src/routes/modulosRoute.js'
import caracterisRoute from './src/routes/caracteristicasRoute.js'


const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(usuarioRouter);
app.use(centrosRouter);
app.use(tipoSitiosRouter);
app.use(municipiosRouter);
app.use(categoriasRouter);
app.use(rutasRoute);
app.use(modulosRoute);
app.use(caracterisRoute);

app.listen(3000, () => {
  console.log("API activa en el servidor 3000");
});
