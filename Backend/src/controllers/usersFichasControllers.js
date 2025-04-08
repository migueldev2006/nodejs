import { pool } from "../../src/database/db.js";

const RegistrarUsersFichas = async (req, res) => {
  try {
    const { fk_usuario, fk_ficha } = req.body;
    const sql =
      "insert into usuario_ficha (fk_usuario, fk_ficha) Values ($1,$2)";
    const result = await pool.query(sql, [fk_usuario, fk_ficha]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al regsitrar usuario_ficha" });
  }
};

const ActualizarUsersFichas = async (req, res) => {
  try {
    const { fk_usuario, fk_ficha  } = req.body;
    const { id_usuario_ficha } = req.params;
    const sql =
      "update usuario_ficha set fk_usuario=$1,fk_ficha=$2 where id_usuario_ficha=$5";
    const result = await pool.query(sql, [
        fk_usuario,
        fk_ficha,
        id_usuario_ficha,
    
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en la actualizacion de usuario_ficha" });
  }
};



const Listar_UsersFichas = async (req, res) => {
  try {
    const sql = "select * from  usuario_ficha";
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al listar todas  usuario_ficha registradas" });
  }
};






export { RegistrarUsersFichas, ActualizarUsersFichas, Listar_UsersFichas, };
