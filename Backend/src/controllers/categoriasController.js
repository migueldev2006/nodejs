import { pool } from "../database/db.js";

//Registrar Categoria

const registrar = async(req,res) =>{
    try{
        const {nombre,estado} = req.body
        const sql = "INSERT INTO categorias(nombre,estado) VALUES($1,$2)"
        const result = await pool.query(sql,[nombre,estado])
        return res.status(200).json({msg:"Categoria registrada exitosamente"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error registrando categoria"})
    }
}


//Actualizar Categoria

const actualizar = async(req,res) =>{
    try{
        const {id} = req.params
        const {nombre} = req.body 
        const sql = `UPDATE categorias SET nombre = $1 WHERE id_categoria = $2`
        const result = await pool.query(sql,[nombre,id])
        return res.status(200).json({msg:"Actualizado con exito"})
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error actualizando"})
    }
} 

//Desactivar Categoria

const cambiaEstado = async(req,res) =>{
    try{
        const { id } = req.params
        const sql = `UPDATE categorias SET estado =
        CASE 
        WHEN estado = true THEN false
        WHEN estado = false THEN true
        END
        WHERE id_categoria = $1`
        const result = await pool.query(sql,[id] )
        res.status(200).json({ msg: "Estado actualizado con exito" })
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error cambiando el estado"})
    }
}


//Listar Categorias

const getAll = async(req,res) =>{
    try{
        const sql = "SELECT * FROM categorias"
        const result = await pool.query(sql)
        return res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error obteniendo las categorias"})
    }
}

export {registrar,actualizar,cambiaEstado,getAll}