import { pool } from "../../src/database/db.js";

const RegistrarArea = async (req, res) => {
  try {
    const { nombre,estado, fk_sede, fk_usuario } = req.body;
    const sql =
      "insert into areas (nombre,estado,fk_sede, fk_usuario) Values ($1,$2,$3,$4)";
    const result = await pool.query(sql, [nombre,estado, fk_sede, fk_usuario]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al regsitrar area" });
  }
};

const ActualizarArea = async (req, res) => {
  try {
    const { nombre  } = req.body;
    const { id_area } = req.params;
    const sql =
      "update areas set nombre=$1 where id_area=$2";
    const result = await pool.query(sql, [
      nombre,
      id_area,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en la actualizacion de areas" });
  }
};



const Listar_Áreas = async (req, res) => {
  try {
    const sql = "select * from areas";
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al listar todas las Areas registradas" });
  }
};

const Desactivar_Area = async (req,res)=>{
  try {
    const {id_area}=req.params;
    const sql="update areas set estado= CASE WHEN estado= false THEN true ELSE false END where id_area=$1"
    const result= await pool.query(sql,[id_area])
    res.status(200).json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Error al desactivar area"})
    
  }
};
export { RegistrarArea, ActualizarArea, Listar_Áreas,Desactivar_Area };
