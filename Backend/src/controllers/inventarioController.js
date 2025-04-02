import { pool } from "../database/db.js";


export const registrarInventarios = async(req, res) => {
    try {
        const {stock, estado, fk_sitio, fk_elemento} = req.body;
        const sql = `INSERT INTO inventarios (stock, estado, fk_sitio, fk_elemento) VALUES ($1, $2, $3, $4)`;
        const result = await pool.query(sql, [stock, estado, fk_sitio, fk_elemento]);
        if (result.rowCount>0) {
            return res.status(201).json({message:"Elemento agregado correctamente al inventario"});
        } else {
            return res.status(400).json({message:"No fue posible registrar el elemnento en el inventario"});
        }
    } catch (error) {
        console.log("Error al registrar elementos al inventario en el sistema "+error.message);
        return res.status(500).json({message:"Error al registrar elementos al inventario en el sistema"});
    }
}

export const actualizarInventarios = async(req, res) => {
    try {
        const {id_inventario} = req.params;
        const { stock, estado, fk_sitio, fk_elemento} = req.body;
        const sql = `UPDATE inventarios SET stock = $1, estado = $2, fk_sitio = $3, fk_elemento = $4 WHERE id_inventario = $5`;
        const result = await pool.query(sql, [ stock, estado, fk_sitio, fk_elemento, id_inventario]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Inventario actualizado"});
        } else {
            return res.status(400).json({message:"No se logro realizar la actualizacion"});
        }
    } catch (error) {
        console.log("Error al actualizar el inventario en el sistema "+error.message);
        return res.status(500).json({message:"Error al actualizar el inventario en el sistema"});
    }
}

export const cambiarEstadoInventario = async(req, res) => {
    try {
        const {id_inventario} = req.params;
        const sql = `UPDATE inventarios SET estado = CASE WHEN estado = TRUE THEN FALSE WHEN estado = FALSE THEN TRUE END WHERE id_inventario = $1`
        const result = await pool.query(sql, [id_inventario]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Se cambio el estado del ineventario exitosamente"});
        } else {
            return res.status(400).json({message:" No se logro cambiar el estado del inventario"});
        }
    } catch (error) {
        console.log("Error al cambiar el estado del inventario en el sistema "+error.message);
        return res.status(500).json({message:"Error al cambiar el estado del inventario en el sistema"});
    }
}

export const listarInventarios = async(req, res) => {
    try {
        const sql = `SELECT * FROM inventarios`
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