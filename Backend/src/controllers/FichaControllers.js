import {pool} from "../../src/database/db.js";

const Registrar_Ficha = async (req, res) => {
  try {
    const {
      codigo_ficha,
      estado,
      fk_programa,
    } = req.body;
    const sql =
      "insert into fichas (codigo_ficha,estado,fk_programa) values($1,$2,$3)";
    const result = await pool.query(sql, [
      codigo_ficha,
      estado,
      fk_programa,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar fichas" });
  }
};

const Actualizar_Ficha = async (req, res) => {
  try {
    const {
      codigo_ficha,
      estado,
      fk_programa,
    } = req.body;
    const { id_ficha } = req.params;
    const sql="update fichas set codigo_ficha=$1,estado=$2,fk_programa=$3 where id_ficha=$4"
    const result = await pool.query(sql, [
      codigo_ficha,
      estado,
      fk_programa,
      id_ficha,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar ficha" });
  }
};





const Listar_Fichas = async (req,res)=>{
    try {
        const sql="select * from Fichas";
        const result = await pool.query(sql);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error al listar todas las fichas registradas"})
        
    }
}


const Desactivar_Ficha = async (req,res)=>{
  try {
    const {id_ficha}=req.params;
    const sql="update fichas set estado= CASE WHEN estado= false THEN true ELSE false END where id_ficha=$1"
    const result= await pool.query(sql,[id_ficha])
    res.status(200).json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Error al desactivar ficha"})
    
  }
}

export { Registrar_Ficha,Actualizar_Ficha,Listar_Fichas,Desactivar_Ficha };
