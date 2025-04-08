import { pool } from "../../src/database/db.js";

const RegistrarArea = async (req, res) => {
  try {
    const { nombre, persona_encargada,estado, fk_sede } = req.body;
    const sql =
      "insert into areas (nombre,persona_encargada,estado,fk_sede) Values ($1,$2,$3,$4)";
    const result = await pool.query(sql, [nombre, persona_encargada,estado, fk_sede]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al regsitrar area" });
  }
};

const ActualizarArea = async (req, res) => {
  try {
    const { nombre, persona_encargada,estado, fk_sede  } = req.body;
    const { id_Area } = req.params;
    const sql =
      "update areas set nombre=$1,persona_encargada=$2,estado=$3,fk_sede=$4 where id_area=$5";
    const result = await pool.query(sql, [
      nombre,
      persona_encargada,
      estado,
      fk_sede,
      id_Area,
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
    const {id_Area}=req.params;
    const sql="update areas set estado= CASE WHEN estado= false THEN true ELSE false END where id_area=$1"
    const result= await pool.query(sql,[id_Area])
    res.status(200).json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Error al desactivar area"})
    
  }
};
export { RegistrarArea, ActualizarArea, Listar_Áreas,Desactivar_Area };
