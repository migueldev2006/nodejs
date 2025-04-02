import {pool} from "../database/db.js";

export const registrarRol = async(req, res) => {
    try {
        const {nombre, estado} = req.body;
        const sql = `INSERT INTO roles (nombre, estado) values ($1, $2)`;
        const result = await pool.query(sql, [nombre, estado]);
        if (result.rowCount>0) {
            return res.status(201).json({message:"Rol registrado exitosamente"});
        } else {
            return res.status(400).json({message:"No fue posible registrar el rol"});
        }
    } catch (error) {
        console.log("Error al registrar un rol en el sistema "+error.message);
        return res.status(500).json({message:"Error al registrar un rol en el sistema"})
    }
}

export const actualizarRol = async(req, res) => {
    try {
        const {id_rol} = req.params;
        const {nombre, estado} = req.body;
        const sql = `UPDATE roles SET nombre = $1, estado = $2 WHERE id_rol = $3 `;
        const result = await pool.query(sql, [nombre, estado, id_rol]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"El rol se ha actualizado correctamente"});
        } else {
            return res.status(400).json({message:"No fue posible actualizar el rol"});
        }
    } catch (error) {
        console.log("Error al actualizar el rol en el sistema "+error.message);
        return res.status(500).json({message:"Error al actualizar el rol en el sistema"})
    }
}

export const cambiarEstadoRol = async(req, res) => {
    try {
        const {id_rol} = req.params;
        const sql = `UPDATE roles SET estado = CASE WHEN estado = TRUE THEN FALSE WHEN estado = FALSE THEN TRUE END WHERE id_rol = $1`;
        const result = await pool.query(sql, [id_rol]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Se ha cambiado el estado del rol correctamente"})
        } else {
            return res.status(400).json({message:"No fue posible cambiar el estado el rol"})
        }
    } catch (error) {
        console.log("Error al cambiar el estado del rol en el sistema "+error.message);
        return res.status(500).json({message:"Error al cambiar el estado del rol en el sistema"})
    }
}

export const listarRoles = async(req, res) => {
    try {
        const sql = `SELECT * FROM roles`;
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