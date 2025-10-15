import {pool} from '../database/db.js'
import { crearNotificacion } from './notificacionController.js';

export const registrarMovimientos = async(req, res) => {
    try {
        const {descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fecha_devolucion, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario, destino} = req.body;
        const sql = `INSERT INTO movimientos (descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fecha_devolucion, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario, destino) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id_movimiento`;
        const result = await pool.query(sql, [descripcion, cantidad, hora_ingreso, hora_salida, aceptado, en_proceso, cancelado, devolutivo, no_devolutivo, fecha_devolucion, fk_usuario, fk_tipo_movimiento, fk_sitio, fk_inventario, destino]);
        if (result.rowCount>0) {
            const id_movimiento = result.rows[0].id_movimiento;
           
            await crearNotificacion({
                titulo: 'Nuevo movimiento pendiente',
                mensaje: 'Hay un nuevo movimiento que requiere revisión',
                fk_movimiento: id_movimiento,
                en_proceso: true,
                aceptado: false,
                cancelado: false,
                destino:fk_usuario,
                id_movimiento
            });
      
            return res.status(201).json({message:"Se ha resgistrado el movimiento correctamente", movimiento:id_movimiento})
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
        const {descripcion, cantidad, hora_ingreso, hora_salida} = req.body;
        const sql = `UPDATE movimientos SET descripcion = $1, cantidad = $2, hora_ingreso = $3, hora_salida = $4 WHERE id_movimiento = $5`;
        const result = await pool.query(sql, [descripcion, cantidad, hora_ingreso, hora_salida, id_movimiento]);
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

export const aceptarMovimientos = async (req, res) => {
    const client = await pool.connect(); 
    try {
        const { id_movimiento } = req.params;

        await client.query('BEGIN');


        const movimientoQuery = `SELECT cantidad, fk_inventario, fk_tipo_movimiento
                                 FROM movimientos
                                 WHERE id_movimiento = $1 AND en_proceso = TRUE`;
        const movimientoResult = await client.query(movimientoQuery, [id_movimiento]);

        if (movimientoResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "El movimiento no está en proceso o no existe." });
        }

        const { cantidad, fk_inventario, fk_tipo_movimiento } = movimientoResult.rows[0];


        const tipoMovimientoQuery = `SELECT nombre FROM tipo_movimientos WHERE id_tipo = $1`;
        const tipoMovimientoResult = await client.query(tipoMovimientoQuery, [fk_tipo_movimiento]);

        if (tipoMovimientoResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Tipo de movimiento no encontrado." });
        }

        const tipoMovimiento = tipoMovimientoResult.rows[0].nombre;


        const inventarioQuery = `SELECT cantidad FROM inventarios WHERE id_inventario = $1 FOR UPDATE`;
        const inventarioResult = await client.query(inventarioQuery, [fk_inventario]);

        if (inventarioResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Inventario no encontrado." });
        }

        const stockActual = inventarioResult.rows[0].cantidad;

        if (tipoMovimiento === "salida" && stockActual < cantidad) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "No hay suficiente stock para procesar la salida del movimiento." });
        }

        let updateStockQuery;

        if (tipoMovimiento === "entrada") {

            updateStockQuery = `UPDATE inventarios
                                SET cantidad = cantidad + $1
                                WHERE id_inventario = $2`;
        } else if (tipoMovimiento === "salida") {

            updateStockQuery = `UPDATE inventarios
                                SET cantidad = cantidad - $1
                                WHERE id_inventario = $2`;
        }

        else if (tipoMovimiento === "prestamo") {

            updateStockQuery = `UPDATE inventarios
                                SET prestado = TRUE
                                WHERE id_inventario = $2`;
        }

        await client.query(updateStockQuery, [cantidad, fk_inventario]);


        const actualizarMovimientoQuery = `UPDATE movimientos
                                           SET aceptado = TRUE, en_proceso = FALSE, cancelado = FALSE
                                           WHERE id_movimiento = $1 AND en_proceso = TRUE`;
        const result = await client.query(actualizarMovimientoQuery, [id_movimiento]);

        if (result.rowCount > 0) {
            await client.query('COMMIT');
            return res.status(200).json({ message: "El movimiento ha sido aceptado y el inventario actualizado." });
        } else {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "No fue posible aceptar el movimiento debido a que ya fue aceptado o rechazado." });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.log("Error al aceptar un movimiento en el sistema: " + error.message);
        return res.status(500).json({ message: "Error al aceptar un movimiento en el sistema" });
    } finally {
        client.release(); 
    }
};

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
        const sql = `SELECT e.nombre, SUM(m.cantidad) AS total_usos FROM movimientos m 
        JOIN inventarios i ON m.fk_inventario = i.id_inventario
        JOIN elementos e ON i.fk_elemento = e.id_elemento
        GROUP BY e.nombre
        ORDER BY total_usos DESC
        LIMIT 10;
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
        COUNT(*) AS total
        FROM movimientos m
        JOIN tipo_movimientos tm ON m.fk_tipo_movimiento = tm.id_tipo
        GROUP BY tipo_movimiento, mes
        ORDER BY mes DESC
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

export const historialPrestamos = async(req, res) => {
    try {
        const sql = `SELECT 
  m.id_movimiento,
  e.nombre AS nombre_elemento,
  tm.nombre AS tipo_movimiento,
  m.cantidad,
  s.nombre AS sitio,
  u.nombre AS usuario,
  m.created_at AS fecha_prestamo,
  m.fecha_devolucion,
  CASE 
    WHEN m.fecha_devolucion IS NOT NULL THEN 'Pendiente de devolución'
    ELSE 'Devuelto'
  END AS estado_devolucion
FROM movimientos m
JOIN tipo_movimientos tm ON m.fk_tipo_movimiento = tm.id_tipo
LEFT JOIN inventarios i ON m.fk_inventario = i.id_inventario
LEFT JOIN elementos e ON i.fk_elemento = e.id_elemento
LEFT JOIN sitios s ON m.fk_sitio = s.id_sitio
LEFT JOIN usuarios u ON m.fk_usuario = u.id_usuario
WHERE 
  tm.nombre ILIKE ANY (ARRAY['Prestamo']) 

ORDER BY m.created_at DESC;

`
const result = await pool.query(sql)

if (result.rowCount>0 ) {
    return res.status(200).json(result.rows)
} else {
    return res.status(200).json([])
}
    } catch (error) {
        console.log("Error al mostrar el historial de prestamos: "+error.message)
        return res.status(500).json({message:"Error al consultar el historial en el sistema: "+error.message})
    }
}


export const totaltipoMovimiento = async(req, res) => {
    try {
        const sql = `SELECT 
  tm.nombre AS tipo_movimiento,
  SUM(m.cantidad) AS cantidad_total,
  MAX(m.created_at) as fecha_movimiento
FROM movimientos m
JOIN tipo_movimientos tm ON m.fk_tipo_movimiento = tm.id_tipo
GROUP BY tm.nombre
ORDER BY cantidad_total DESC;
`
        const result = await pool.query(sql)

        if (result.rowCount>0) {
            return res.status(200).json(result.rows)
        } else {
            return res.status(200).json([])
        }
    } catch (error) {
        console.log("Error al realizar la consulta: "+error.message)
        return res.status(500).json({message:"Error al realizar la consulta: "+error.message})
    }
}

export const estadoMovimiento = async(req, res) => {
    try {
        const sql = `SELECT 
  e.nombre AS nombre_elemento,
  COUNT(m.id_movimiento) AS total_movimientos,
  COUNT(*) FILTER (WHERE m.aceptado = TRUE) AS total_aceptados,
  COUNT(*) FILTER (WHERE m.cancelado = TRUE) AS total_cancelados,
  COUNT(*) FILTER (WHERE m.en_proceso = TRUE) AS total_en_proceso,
  ROUND(100.0 * COUNT(*) FILTER (WHERE m.aceptado = TRUE) / NULLIF(COUNT(*), 0), 2) AS porcentaje_aceptados,
  ROUND(100.0 * COUNT(*) FILTER (WHERE m.cancelado = TRUE) / NULLIF(COUNT(*), 0), 2) AS porcentaje_cancelados,
  ROUND(100.0 * COUNT(*) FILTER (WHERE m.en_proceso = TRUE) / NULLIF(COUNT(*), 0), 2) AS porcentaje_en_proceso,
  MAX(m.created_at) AS fecha_movimiento
FROM movimientos m
JOIN inventarios i ON m.fk_inventario = i.id_inventario
JOIN elementos e ON i.fk_elemento = e.id_elemento
GROUP BY e.nombre;
`
        const result = await pool.query(sql)
        if (result.rowCount>0) {
            return res.status(200).json(result.rows)
        } else {
            return res.status(200).json([])
        }
    } catch (error) {
        console.log("Error al realizar la consulta: "+error.message)
        return res.status(500).json({message:"Error al realizar la consulta: "+error.message})
    }
}