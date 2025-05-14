import {pool} from '../database/db.js'
import { crearNotificacion } from './notificacionController.js';

export const registrarMovimientos = async(req, res) => {
    try {
        const {descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario} = req.body;
        const sql = `INSERT INTO movimientos (descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_movimiento`;
        const result = await pool.query(sql, [descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario]);
        if (result.rowCount>0) {
            const id_movimiento = result.rows[0].id_movimiento;
           
      
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


export const masUsados = async(req,res)=>{
    try {
        const sql = `SELECT 
    a.nombre AS area,
    e.nombre AS nombre,
    COALESCE(SUM(m.cantidad), 0) AS total_usos
FROM elementos e
JOIN inventarios i ON e.id_elemento = i.fk_elemento
JOIN sitios s ON i.fk_sitio = s.id_sitio
JOIN areas a ON s.fk_area = a.id_area
LEFT JOIN movimientos m ON i.id_inventario = m.fk_inventario AND m.aceptado = TRUE
GROUP BY a.nombre, e.nombre
ORDER BY a.nombre, total_usos DESC;

`
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


export const movimientosMensuales = async(req,res) => {
    try{
        const sql = `SELECT 
  tm.nombre AS tipo_movimiento,
  DATE_TRUNC('month', m.created_at) AS mes,
  a.nombre AS area,
  e.nombre AS elemento,
  COUNT(*) AS total
FROM movimientos m
JOIN tipo_movimientos tm ON m.fk_tipo_movimiento = tm.id_tipo
JOIN inventarios i ON m.fk_inventario = i.id_inventario
JOIN elementos e ON i.fk_elemento = e.id_elemento
JOIN sitios s ON i.fk_sitio = s.id_sitio
JOIN areas a ON s.fk_area = a.id_area
GROUP BY tipo_movimiento, mes, area, elemento
ORDER BY mes DESC;
        `
        const result = await pool.query(sql);
        if (result.rowCount === 0) {
            return res.status(200).json([])
        } else {
            return res.status(200).json(result.rows);
        }
    } catch (error) {
        console.log("Error al consultar los movimientos mensuales en el sistema "+error.message);
        return res.status(500).json({message:"Error al consultar en el sistema"});
    }
}