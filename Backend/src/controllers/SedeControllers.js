import {pool} from "../../src/database/db.js";


const Registrar_Sede = async (req,res)=>{
    try {
        const {nombre,estado,fk_centro} = req.body;
        const sql= "insert into sedes (nombre,estado,fk_centro) values($1,$2,$3)";
        const result = await pool.query(sql,[nombre,estado,fk_centro]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error en el registro de una sede"})
    }
}

const Actualizar_Sede = async (req,res)=>{
    try {
        const {nombre,estado,fk_centro} = req.body
        const {id_sede}= req.params;
        const sql = "update sedes set  nombre=$1,estado=$2,fk_centro=$3 where id_sede=$4";
        const result = await pool.query(sql,[nombre,estado,fk_centro,id_sede]);
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error al actualziar sede"})
        
    }
}



const Desactivar_Sede = async (req,res)=>{
    try {
        const {id_sede} = req.params;
        const sql = `
        UPDATE sedes
        SET estado = CASE
            WHEN estado = false THEN true
            ELSE false
        END
        WHERE id_sede = $1;
    `
        const result = await pool.query(sql,[id_sede])
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error al desactivar sede"})
        
    }
}

const Listar_Sedes = async (req,res)=>{
    try {
        const sql="select * from sedes";
        const result = await pool.query(sql);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error al listas sedes"})

        
    }
}


export {Registrar_Sede,Actualizar_Sede,Listar_Sedes,Desactivar_Sede}