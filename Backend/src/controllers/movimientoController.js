import {pool} from '../database/db.js'

export const registrarMovimientos = async(req, res) => {
    try {
        const {descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario} = req.body;
        const sql = `INSERT INTO movimientos (descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
        const result = await pool.query(sql, [descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario]);
        if (result.rowCount>0) {
            return res.status(201).json({message:"Se ha resgistrado el movimiento correctamente"})
        } else {
            return res.status(400).json({message:"No se logro registrar el movimiento"})
        }
    } catch (error) {
        console.log("Error al registrar el movimiento en el sistema "+error.message);
        return res.status(500).json({message:"Error al registrar el movimiento en el sistema"});
    }
}
export const actualizarMovimientos = async(req, res) => {
    try {
        const {id_movimiento} = req.params;
        const {descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario} = req.body;
        const sql = `UPDATE movimientos SET descripcion = $1, cantidad = $2, hora_ingreso = $3, hora_salida = $4, aceptado = $5, en_proceso = $6, cancelado = $7, devolutivo = $8, no_devolutivo = $9, fk_usuario = $10, fk_tipo_movimiento = $11, fk_sitio = $12, fk_inventario = $13 WHERE id_movimiento = $14`;
        const result = await pool.query(sql, [descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario, id_movimiento]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Movimiento actualizado"})
        } else {
            return res.status(400).json({message:"Fallo la actualizacion del movimiento"})
        }
    } catch (error) {
        console.log("Error al actualizar el movimiento en el sistema "+error.message);
        return res.status(500).json({message:"Error al actualizar el movimiento en el sistema"});
    }
}
export const aceptarMovimientos = async(req, res) => {
    try {
        const {id_movimiento} = req.params;
        const sql = `UPDATE movimientos SET aceptado = TRUE, en_proceso = FALSE, cancelado = FALSE WHERE id_movimiento = $1 AND en_proceso = TRUE `
        const result = await pool.query(sql, [id_movimiento]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Su movimiento ha sido aceptado"})
        } else {
            return res.status(400).json({message:"No se logro aceptar el movimiento debido a que su movimiento ya ha sido aceptado o posiblemente rechazado"})
        }
    } catch (error) {
        console.log("Error al aceptar un movimiento en el sistema "+error.message);
        return res.status(500).json({message:"Error al aceptar un movimiento en el sistema"});
    }
}
export const cancelarMovimientos = async(req, res) => {
    try {
        const {id_movimiento} = req.params;
        const sql = `UPDATE movimientos SET aceptado = FALSE, en_proceso = FALSE, cancelado = TRUE WHERE id_movimiento = $1 AND en_proceso = TRUE `;
        const result = await pool.query(sql, [id_movimiento]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Se ha rechazado el movimiento correctamente"})
        } else {
            return res.status(400).json({message:"No se logro rechazar el movimiento debido a que ya ha sido rechazado o posiblemente aceptado"})
        }
    } catch (error) {
        console.log("Error al cancelar un movimiento en el sistema "+error.message);
        return res.status(500).json({message:"Error al cancelar un movimiento en el sistema"});
    }
}

export const listarMovimientos = async(req, res) => {
    try {
        const sql = `SELECT * FROM movimientos`
        const result = await pool.query(sql);
        if (result.rowCount === 0) {
            return res.status(200).json([])
        } else {
            return res.status(200).json(result.rows);
        }
    } catch (error) {
        console.log("Error al consultar en el sistema "+error.message);
        return res.status(500).json({message:"Error al consultar en el sistema"});
    }
}