import {pool} from '../database/db.js'


//Registrar Centro

const registrar = async(req,res) =>{
    try{
        const {nombre,estado,fk_municipio} = req.body
        const sql = "INSERT INTO centros(nombre,estado,fk_municipio) VALUES($1,$2,$3)"
        const result = await pool.query(sql,[nombre,estado,fk_municipio])
        return res.status(200).json({msg:"Centro registrado exitosamente"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error registrando centro"})
    }
}

//Actualizar Centro

const actualizar = async(req,res) =>{
    try{
        const {id} = req.params
        const {nombre, fk_municipio} = req.body
        const sql = `UPDATE centros SET nombre = $1, fk_municipio = $2 WHERE id_centro = $3 `
        const result = await pool.query(sql,[nombre,fk_municipio,id])
        return res.status(200).json({msg:"Actualizado con exito"})
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error actualizando"})
    }
}

//Desactivar Centro

const cambiaEstado = async(req,res) =>{ 
    try{
        const { id } = req.params
        const sql = `UPDATE centros SET estado =
        CASE 
        WHEN estado = true THEN false
        WHEN estado = false THEN true
        END
        WHERE id_centro = $1`
        const result = await pool.query(sql,[id] )
        res.status(200).json({ msg: "Estado actualizado con exito" })

    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error cambiando el estado"})
    }
}


//Listar Centros

const getAll = async(req,res) =>{
    try{
        const sql = "SELECT * FROM centros"
        const result = await pool.query(sql)
        return res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error obteniendo los centros"})
    }
}

export {registrar,actualizar,cambiaEstado,getAll}