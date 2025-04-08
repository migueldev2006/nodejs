import {pool} from "../database/db.js";

const Registrar_Sitio = async (req, res) => {
  try {
    const {
      nombre,
      persona_encargada,
      ubicacion,
      estado,
      fk_tipo_sitio,
      fk_area,
    } = req.body;
    const sql =
      " insert into sitios (nombre,persona_encargada,ubicacion,estado,fk_tipo_sitio,fk_area)  values($1,$2,$3,$4,$5,$6)";
    const result = await pool.query(sql, [
      nombre,
      persona_encargada,
      ubicacion,
      estado,
      fk_tipo_sitio,
      fk_area,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar sitio" });
  }
};

const Actualizar_Sitio = async (req,res)=>{
    try {
        const {nombre,
            persona_encargada,
            ubicacion,
            estado,
            fk_tipo_sitio,fk_area}= req.body;
        const {id_sitio}= req.params
        const sql="update sitios set  nombre=$1,persona_encargada=$2,ubicacion=$3,estado=$4,fk_tipo_sitio=$5,fk_area=$6 where id_sitio=$7";
        const result = await pool.query(sql,[nombre,
            persona_encargada,
            ubicacion,
            estado,fk_tipo_sitio,fk_area,id_sitio])
            res.status(200).json(result.rows);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error al actualziar sitios"})
        
    }
}


const Desactivar_Sitio = async (req,res)=>{
    try {
        const {id_sitio}= req.params;
        const sql="update sitios set estado= CASE WHEN estado = false THEN true ELSE false END where id_sitio=$1";
        const result = await pool.query(sql,[id_sitio])
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error al desactivar sitio"})
        
    }
}



const Listar_Sitios = async (req,res)=>{
    try {
        const sql="select * from sitios";
        const result = await pool.query(sql);
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error al listar sitios"})
        
    }
}

export { Registrar_Sitio,Actualizar_Sitio,Desactivar_Sitio,Listar_Sitios};
