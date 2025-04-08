import {pool} from '../database/db.js'


//Registrar Tipo de Sitio

const registrar = async(req,res) =>{
    try{
        const {nombre,descripcion,url_destino,estado,fk_modulo} = req.body
        const sql = "INSERT INTO rutas(nombre,descripcion,url_destino,estado,fk_modulo) VALUES($1,$2,$3,$4,$5)"
        const result = await pool.query(sql,[nombre,descripcion,url_destino,estado,fk_modulo])
        return res.status(200).json({msg:"Ruta registrada exitosamente"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error registrando Ruta"})
    }
}

//Actualizar Tipo de Sitio

const actualizar = async(req,res) => {
    try{
        const {id} = req.params
        const {nombre,descripcion,url_destino,fk_modulo} = req.body
        const sql = `UPDATE rutas SET nombre = $1,descripcion = $2, url_destino = $3,fk_modulo=$4 WHERE id_ruta = $5 `
        const result = await pool.query(sql,[nombre,descripcion,url_destino,fk_modulo,id])
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
        const sql = `UPDATE rutas SET estado =
        CASE 
        WHEN estado = true THEN false
        WHEN estado = false THEN true
        END
        WHERE id_ruta = $1`
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
        const sql = "SELECT * FROM rutas"
        const result = await pool.query(sql)
        return res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error obteniendo las rutas"})
    }
}


export {registrar,actualizar,cambiaEstado,getAll}
