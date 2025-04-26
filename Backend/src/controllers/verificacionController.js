import {pool} from "../database/db.js";

export const registrarVerificacion = async(req, res) => {
    try {
        const {persona_encargada, hora_ingreso, hora_fin, observaciones, fk_sitio, fk_usuario} = req.body;
        const sql = `INSERT INTO verificaciones (persona_encargada, hora_ingreso, hora_fin, observaciones, fk_sitio, fk_usuario) values ($1, $2, $3, $4, $5, $6)`;
        const result = await pool.query(sql, [persona_encargada, hora_ingreso, hora_fin, observaciones, fk_sitio, fk_usuario]);
        if (result.rowCount>0) {
            return res.status(201).json({message:"Registro exitoso, Iniciando Verificacion"});
        } else {
            return res.status(400).json({message:"No fue posible iniciar la verificacion"});
        }
    } catch (error) {
        console.log("Error al registrar e iniciar verificacion en el sistema "+error.message);
        return res.status(500).json({message:"Error al registrar e iniciar verificacion en el sistema"})
    }
}

export const actualizarVerificacion = async(req, res) => {
    try {
        const {id_verificacion} = req.params;
        const {persona_encargada, hora_ingreso, hora_fin, observaciones, fk_sitio, fk_usuario} = req.body;
        const sql = `UPDATE verificaciones SET persona_encargada = $1, hora_ingreso = $2, hora_fin = $3, observaciones = $4, fk_sitio = $5, fk_usuario = $6 WHERE id_verificacion = $7 `;
        const result = await pool.query(sql, [persona_encargada, hora_ingreso, hora_fin, observaciones, fk_sitio, fk_usuario, id_verificacion]);
        if (result.rowCount>0) {
            return res.status(201).json({message:"Se ha actualizado correctamente"});
        } else {
            return res.status(400).json({message:"No fue posible actualizar la verificacion"});
        }
    } catch (error) {
        console.log("Error al actualizar la verificacion en el sistema "+error.message);
        return res.status(500).json({message:"Error al actualizar la verificacion en el sistema"})
    }
}
export const traerElementosSitio = async(req, res) => {
    try {
        const {id_sitio} = req.params
        const sql = `SELECT e.* FROM elementos e INNER JOIN inventarios i ON e.id_elemento = i.fk_elemento WHERE i.fk_sitio = $1`
       const result = await pool.query(sql, [id_sitio]);
       if (result.rowCount === 0) {
        return res.status(200).json([])
    } else {
        return res.status(200).json(result.rows);
    }
    } catch (error) {
        console.log("Error al consultar los elementos del sitio a verificar en el sistema: "+error.message);
        return res.status(500).json({message:"Error al consultar los elementos del sitio a verificar en el sistema"});
    }
}
export const listarVerificaciones = async(req, res) => {
    try {
        const sql = `SELECT * FROM verificaciones`;
        const result =  await pool.query(sql);
        if (result.rowCount === 0) {
            return res.status(200).json([])
        } else {
            return res.status(200).json(result.rows);
        }
    } catch (error) {
        console.log("Error al consultar las verificaciones realizadas en el sistema "+error.message);
        return res.status(500).json({message:" Error al consultar las verificaciones realizadas en el sistema"});
    }
}