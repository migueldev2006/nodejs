import { pool } from "../database/db.js";


const registrar = async(req,res) =>{
    try{
        const {nombre} = req.body
        const sql = "INSERT INTO caracteristicas(nombre) VALUES($1)"
        const result = await pool.query(sql,[nombre])
        return res.status(200).json({msg:"Caracteristica registrada exitosamente"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error registrando caracteristica"})
    }
}


const actualizar = async(req,res) =>{
    try{
        const {id} = req.params
        const {nombre} = req.body 
        const sql = `UPDATE caracteristicas SET nombre = $1 WHERE id_caracteristica = $5`
        const result = await pool.query(sql,[nombre,id])
        return res.status(200).json({msg:"Actualizado con exito"})
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error actualizando"})
    }
} 




//Listar Categorias

const getAll = async(req,res) =>{
    try{
        const sql = "SELECT * FROM caracteristicas"
        const result = await pool.query(sql)
        return res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error obteniendo las caracteristicas"})
    }
}

export {registrar,actualizar,getAll}