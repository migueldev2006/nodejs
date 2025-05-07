import { pool } from "../database/db.js";

const Registrar_rol_permiso = async (req, res) => {
  try {
    const { estado, fk_rol, fk_modulo, fk_permiso } = req.body;
    const sql =
      "insert into rol_modulo (estado, fk_rol, fk_modulo, fk_permiso) Values ($1,$2,$3,$4)";
    const result = await pool.query(sql, [estado, fk_rol, fk_modulo, fk_permiso]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al regsitrar rol_modulo" });
  }
};

const Actualizar_rol_permiso = async (req, res) => {
  try {
    const { fk_rol, fk_modulo, fk_permiso } = req.body;
    const { id_rol_permiso } = req.params;
    const sql =
      "update rol_modulo set fk_rol=$1,fk_modulo=$2,fk_permiso=$3, where id_rol_permiso=$4";
    const result = await pool.query(sql, [
      fk_rol,
      fk_modulo,
      fk_permiso,
      id_rol_permiso,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error en la actualizacion de rol_modulo" });
  }
};

const Listar_rol_permiso = async (req, res) => {
  try {
    const sql = "select * from rol_permiso";
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al listar todas las rol_modulo registradas" });
  }
};

const Desactivar_rol_permiso = async (req, res) => {
  try {
    const { id_rol_permiso } = req.params;
    const sql =
      "update rol_modulo set estado= CASE WHEN estado= false THEN true ELSE false END where id_rol_permiso=$1";
    const result = await pool.query(sql, [id_rol_permiso]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al desactivar area" });
  }
};

export {
  Registrar_rol_permiso,
  Actualizar_rol_permiso,
  Listar_rol_permiso,
  Desactivar_rol_permiso,
};
