import {pool} from '../database/db.js'


//Registrar Tipo de Sitio

const registrar = async(req,res) =>{
    try{
        const {nombre,estado} = req.body
        const sql = "INSERT INTO tipo_sitios(nombre,estado) VALUES($1,$2)"
        const result = await pool.query(sql,[nombre,estado])
        return res.status(200).json({msg:"Tipo de sitio registrado exitosamente"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error registrando Tipo de sitio"})
    }
}

//Actualizar Tipo de Sitio

const actualizar = async(req,res) => {
    try{
        const {id} = req.params
        const {nombre} = req.body
        const sql = `UPDATE tipo_sitios SET nombre = $1 WHERE id_tipo = $2 `
        const result = await pool.query(sql,[nombre,id])
        return res.status(200).json({msg:"Actualizado con exito"})
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error actualizando"})
    }
}

//Desactivar Tipo de Sitio

const cambiaEstado = async(req,res) =>{  
    try{
        const { id } = req.params
        const sql = `UPDATE tipo_sitios SET estado =
        CASE 
        WHEN estado = true THEN false
        WHEN estado = false THEN true
        END
        WHERE id_tipo = $1`
        const result = await pool.query(sql,[id] )
        res.status(200).json({ msg: "Estado actualizado con exito" })

    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error cambiando el estado"})
    }
}


//Listar Tipos de Sitios

const getAll = async(req,res) =>{
    try{
        const sql = "SELECT * FROM tipo_sitios"
        const result = await pool.query(sql)
        return res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error obteniendo los tipos de sitios"})
    }
}


export {registrar,actualizar,cambiaEstado,getAll}
