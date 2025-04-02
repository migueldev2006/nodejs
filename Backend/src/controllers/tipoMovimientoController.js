import { pool } from "../database/db.js";

export const registrarTipoMovimiento = async(req, res) => {
    try {
        const {nombre, estado} = req.body;
        const sql = `INSERT INTO tipo_movimientos (nombre, estado) VALUES ($1, $2)`;
        const result = await pool.query(sql, [nombre, estado]);
        if (result.rowCount>0) {
            return res.status(201).json({message:"Tipo de movimiento registrado con exito"});
        } else {
            return res.status(400).json({message:"No  fue posible registrar el tipo de movimiento"});
        }
    } catch (error) {
        console.log("Error al registrar un tipo de movimiento en el sistema "+error.message);
        return res.status(500).json({message:"Error al registrar un tipo de movimiento en el sistema"});
    }
}
export const actualizarTipoMovimiento = async(req, res) => {
    try {
        const {id_tipo} = req.params;
        const {nombre, estado} = req.body;
        const sql = `UPDATE tipo_movimientos SET nombre = $1, estado = $2 WHERE id_tipo = $3`;
        const result = await pool.query(sql, [nombre, estado, id_tipo]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Tipo de movimiento actualizado"});
        } else {
            return res.status(400).json({message:"No se logro realizar la actualizacion"});
        }
    } catch (error) {
        console.log("Error al catualizar un tipo de movimiento en el sistema "+error.message);
        return res.status(500).json({message:"Error al catualizar un tipo de movimiento en el sistema"});
    }
}
export const cambiarEstadoTipoMovimiento = async(req, res) => {
    try {
        const {id_tipo} = req.params;
        const sql = `UPDATE tipo_movimientos SET estado = CASE WHEN estado = TRUE THEN FALSE WHEN estado = FALSE THEN TRUE END WHERE id_tipo = $1 `;
        const result = await pool.query(sql, [id_tipo]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Se ha cambiado el estado del tipo de movimiento exitosamente"});
        } else {
            return res.status(400).json({message:" No se logro cambiar el estado del tipo de movimeinto"});
        }
    } catch (error) {
        console.log("Error al cambiar el estado de un tipo de movimiento en el sistema "+error.message);
        return res.status(500).json({message:"Error al cambiar el estado de un tipo de movimiento en el sistema"});
    }
}

export const listarTipoMovimiento = async(req, res) => {
    try {
        const sql = `SELECT * FROM tipo_movimientos`
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