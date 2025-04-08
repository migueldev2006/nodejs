import {pool} from "../../src/database/db.js";

const Registrar_Programas_de_Formación = async (req, res) => {
  try {
    const { nombre,estado,  fk_area } = req.body;
    const sql =
      "insert into programas_formacion (nombre,estado,fk_area) values($1,$2,$3)";
    const result = await pool.query(sql, [
      nombre,
      estado,
      fk_area,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al registrar programas de formacion" });
  }
};
const Actualizar_Programas_de_Formación = async (req, res) => {
  try {
    const { nombre,estado, fk_area } = req.body;
    const { id_programa } = req.params;
    const sql =
      "update programas_formacion set nombre=$1,estado=$2,  fk_area=$3 where id_programa=$4";
    const result = await pool.query(sql, [
      nombre,
      estado,
      fk_area,
      id_programa,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al actualizar programas de formacion" });
  }
};


const Desactivar_Programas_de_Formación = async (req, res) => {
    try {
        const {id_programa} = req.params;
        const sql= "update programas_formacion set estado= CASE WHEN estado = false THEN true ELSE false END   where id_programa=$1"
        const result= await pool.query(sql,[id_programa]) 
        res.status(200).json(result.rows)
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"Error al desactivas programa de fromacion"})
        
    }
    
};


const Listar_Programas_de_Formación = async (req, res) => {
  try {
    const sql = "select * from programas_formacion";
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al listar los Programa_Formacion" });
  }
};

export  {
  Registrar_Programas_de_Formación,
  Actualizar_Programas_de_Formación,
  Desactivar_Programas_de_Formación,
  Listar_Programas_de_Formación,
};
