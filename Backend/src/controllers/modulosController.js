import { pool } from "../database/db.js";



const registrar = async (req, res) => {

    try {
        const { nombre, descripcion, estado } = req.body
        const sql = "INSERT INTO modulos(nombre,descripcion,estado) VALUES ($1,$2,$3)"
        const result = await pool.query(sql, [nombre, descripcion, estado])
        return res.status(200).json({ msg: "Modulo registrado exitosamente" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error registrando modulo" })
    }

}

const actualizar = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, descripcion } = req.body
        const sql = "UPDATE modulos SET nombre = $1, descripcion = $2 WHERE id_modulo = $3"
        const result = await pool.query(sql, [nombre, descripcion, id]);
        return res.status(200).json({ msg: "Modulo actualizado exitosamente" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error registrando modulo" });
    }
}

const cambiaEstado = async (req, res) => { 
    try {
        const { id } = req.params
        const sql = `UPDATE modulos SET estado =
        CASE 
        WHEN estado = true THEN false
        WHEN estado = false THEN true
        END
        WHERE id_modulo = $1`
        const result = await pool.query(sql,[id] )
        res.status(200).json({ msg: "Estado actualizado con exito" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Algo salio mal" })
    }
}

const getAll = async(req,res) =>{
    try{
        const sql = "SELECT * FROM modulos"
        const result = await pool.query(sql)
        return res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        return res.status(500).json({msg:"Error obteniendo los modulos"})
    }
}


export {registrar,actualizar,cambiaEstado,getAll}
