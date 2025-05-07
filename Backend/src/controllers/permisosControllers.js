import { pool } from "../../src/database/db.js";

const Registrar_Permisos = async (req, res) => {
  try {
    const { permiso, fk_modulo } = req.body;
    const sql =
      "insert into permisos (permiso, fk_modulo) Values ($1, $2)";
    const result = await pool.query(sql, [permiso, fk_modulo]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al regsitrar permisos" });
  }
};

const Actualizar_Permisos = async (req, res) => {
  try {
    const { permiso } = req.body;
    const { id_permiso } = req.params;
    const sql =
      "update permisos set permiso=$1 where id_permiso=$2";
    const result = await pool.query(sql, [
        permiso,
        id_permiso
   
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en la actualizacion de permisos" });
  }
};



const Listar__Permisos = async (req, res) => {
  try {
    const sql = "select * from permisos";
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al listar todas las permisos registradas" });
  }
};







export { Listar__Permisos, Actualizar_Permisos, Registrar_Permisos };
