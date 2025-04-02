import { pool } from "../database/db.js";

export const registrarSolicitudes = async(req, res) => {
    try {
        const {descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario} = req.body;
        const sql = `INSERT INTO solicitudes (descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const result = await pool.query(sql, [descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario]);
        if (result.rowCount>0) {
            return res.status(201).json({message:"Solicitud registrada exitosamente"})
        } else {
            return res.status(400).json({message:"No se logro realizar la solicitud"})
        }
    } catch (error) {
        console.log("Error al registrar una solicitud en el sistema");
        return res.status(500).json({message:"Error al registrar una solicitud en el sistema"});
    }
}
export const actualizarSolicitudes = async(req, res) => {
    try {
        const {id_solicitud} = req.params
        const {descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario} = req.body;
        const sql = `UPDATE solicitudes SET descripcion = $1, cantidad = $2, aceptada = $3, pendiente = $4, rechazada = $5, fk_usuario = $6, fk_inventario = $7 WHERE id_solicitud = $8 `;
        const result = await pool.query(sql, [descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario, id_solicitud]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Solicitud actualizada exitosamente"})
        } else {
            return res.status(400).json({message:"No se logro actualizar la solicitud"})
        }
    } catch (error) {
        console.log("Error al actualizar una solicitud en el sistema "+error.message);
        return res.status(500).json({message:"Error al actualizar una solicitud en el sistema"});
    }
}

export const aceptarSolicitudes = async(req, res) => {
    try {
        const {id_solicitud} = req.params;
        const sql = `UPDATE solicitudes SET aceptada = TRUE, pendiente = FALSE, rechazada = FALSE  WHERE id_solicitud = $1 and pendiente = TRUE`;
        const result = await pool.query(sql, [id_solicitud]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"La solicitud ha sido aceptada"})
        } else {
            return res.status(400).json({message:"No fue posible aceptar la solicitud debido a que ya fue aceptada o posiblemente rechazada"})
        }
    } catch (error) {
        console.log("Error al aceptar una solicitud en el sistema "+error.message);
        return res.status(500).json({message:"Error al aceptar una solicitud en el sistema"});
    }
}

export const rechazarSolicitudes = async(req, res) => {
    try {
        const {id_solicitud} = req.params;
        const sql = `UPDATE solicitudes SET aceptada = FALSE, pendiente = FALSE, rechazada = TRUE  WHERE id_solicitud = $1 and pendiente = TRUE`;
        const result = await pool.query(sql, [id_solicitud]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"La solicitud ha sido rechazada"})
        } else {
            return res.status(400).json({message:"No fue posible rechazar la solicitud debodo a que ya fue rechazada o posiblemente aceptada"})
        }
    } catch (error) {
        console.log("Error al rechazar una solicitud en el sistema "+error.message);
        return res.status(500).json({message:"Error al rechazar una solicitud en el sistema"});
    }
}

export const listarSolicitudes = async(req, res) => {
    try {
        const sql = `SELECT * FROM solicitudes ORDER BY created_at DESC`;
        const result =  await pool.query(sql);
        if (result.rowCount === 0) {
            return res.status(200).json([])
        } else {
            return res.status(200).json(result.rows);
        }
    } catch (error) {
        console.log("Error al consultar en el sistema "+error.message);
        return res.status(500).json({message:" Error al consultar en el sistema"});
    }
}