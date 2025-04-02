import {pool} from "../database/db.js";

export const registrarVerificacion = async(req, res) => {
    try {
        const {persona_encargada, persona_asignada, hora_ingreso, hora_fin, observaciones, fk_inventario} = req.body;
        const sql = `INSERT INTO verificaciones (persona_encargada, persona_asignada, hora_ingreso, hora_fin, observaciones, fk_inventario) values ($1, $2, $3, $4, $5, $6)`;
        const result = await pool.query(sql, [persona_encargada, persona_asignada, hora_ingreso, hora_fin, observaciones, fk_inventario]);
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
        const {persona_encargada, persona_asignada, hora_ingreso, hora_fin, observaciones, fk_inventario} = req.body;
        const sql = `UPDATE verificaciones SET persona_encargada = $1, persona_asignada = $2, hora_ingreso = $3, hora_fin = $4, observaciones = $5, fk_inventario = $6 WHERE id_verificacion = $7 `;
        const result = await pool.query(sql, [persona_encargada, persona_asignada, hora_ingreso, hora_fin, observaciones, fk_inventario, id_verificacion]);
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