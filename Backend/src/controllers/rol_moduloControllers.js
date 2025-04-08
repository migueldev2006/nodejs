import { pool } from "../../src/database/db.js";

const Registrar_rol_modulo = async (req, res) => {
  try {
    const { fk_rol, fk_modulo, fk_permiso } = req.body;
    const sql =
      "insert into rol_modulo (fk_rol, fk_modulo, fk_permiso) Values ($1,$2,$3)";
    const result = await pool.query(sql, [fk_rol, fk_modulo, fk_permiso]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al regsitrar rol_modulo" });
  }
};

const Actualizar_rol_modulo = async (req, res) => {
  try {
    const { fk_rol, fk_modulo, fk_permiso  } = req.body;
    const { id_rol_modulo } = req.params;
    const sql =
      "update rol_modulo set fk_rol=$1,fk_modulo=$2,fk_permiso=$3, where id_rol_modulo=$4";
    const result = await pool.query(sql, [
        fk_rol,
        fk_modulo,
        fk_permiso,
        id_rol_modulo
  
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en la actualizacion de rol_modulo" });
  }
};



const Listar_rol_modulo = async (req, res) => {
  try {
    const sql = "select * from rol_modulo";
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al listar todas las rol_modulo registradas" });
  }
};

const Desactivar_rol_modulo = async (req,res)=>{
  try {
    const {id_rol_modulo}=req.params;
    const sql="update rol_modulo set estado= CASE WHEN estado= false THEN true ELSE false END where id_rol_modulo=$1"
    const result= await pool.query(sql,[id_Area])
    res.status(200).json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Error al desactivar area"})
    
  }
};





export { Registrar_rol_modulo, Actualizar_rol_modulo, Listar_rol_modulo,Desactivar_rol_modulo };
