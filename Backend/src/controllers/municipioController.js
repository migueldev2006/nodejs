import { pool } from "../database/db.js";

//Registrar municipios

const registrar = async(req,res) =>{
    try{
        const {nombre, departamento,estado,} = req.body
        const sql = "INSERT INTO municipios(nombre, departamento,estado) VALUES($1,$2,$3)"
        const result = await pool.query(sql,[nombre,departamento,estado])
        return res.status(200).json({msg:"Municipio registrado exitosamente"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error registrando municipio"})
    }
}

//Actualizar municipio

const actualizar = async(req,res) =>{
    try{
        const {id} = req.params
        const {nombre,departamento} = req.body
        const sql = `UPDATE municipios SET nombre = $1, departamento = $2 WHERE id_municipio = $3`
        const result = await pool.query(sql,[nombre, departamento,id])
        return res.status(200).json({msg:"Actualizado con exito"})
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error actualizando"})
    }
}

//Desactivar municipio

const cambiaEstado = async (req, res) => { 
    try {
        const { id } = req.params
        const sql = `UPDATE municipios SET estado =
        CASE 
        WHEN estado = true THEN false
        WHEN estado = false THEN true
        END
        WHERE id_municipio = $1`
        const result = await pool.query(sql,[id] )
        res.status(200).json({ msg: "Estado actualizado con exito" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Algo salio mal" })
    }
}




//Listar municipios

const getAll = async(req,res) =>{
    try{
        const sql = "SELECT * FROM municipios"
        const result = await pool.query(sql)
        return res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error obteniendo los municipios"})
    }
}

export {registrar,actualizar,cambiaEstado,getAll}