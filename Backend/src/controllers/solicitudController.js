import { pool } from "../database/db.js";
import { crearNotificacion } from './notificacionController.js'; 

export const registrarSolicitudes = async(req, res) => {
    try {
        const {descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario} = req.body;
        const sql = `INSERT INTO solicitudes (descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const result = await pool.query(sql, [descripcion, cantidad, aceptada, pendiente, rechazada, fk_usuario, fk_inventario]);
        if (result.rowCount>0) {
            const id_solicitud = result.rows[0].id_solicitud;
            

            await crearNotificacion({
                titulo: 'Nueva solicitud',
                mensaje: 'Se ha registrado una nueva solicitud.',
                fk_solicitud: id_solicitud,
                pendiente: true,
                aceptada: false,
                rechazada: false,
                destino:fk_usuario,
                id_solicitud
              });

            return res.status(201).json({message:"Solicitud registrada exitosamente", solicitud:id_solicitud})
        } else {
            return res.status(400).json({message:"No se logro realizar la solicitud"})
        }
    } catch (error) {
        console.log("Error al registrar una solicitud en el sistema"+error.message);
        return res.status(500).json({message:"Error al registrar una solicitud en el sistema"});
    }
}
export const actualizarSolicitudes = async(req, res) => {
    try {
        const {id_solicitud} = req.params
        const {descripcion, cantidad} = req.body;
        const sql = `UPDATE solicitudes SET descripcion = $1, cantidad = $2 WHERE id_solicitud = $3 `;
        const result = await pool.query(sql, [descripcion, cantidad, id_solicitud]);
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

export const aceptarSolicitudes = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id_solicitud } = req.params;

        await client.query('BEGIN');

        const solicitudQuery = `SELECT cantidad, fk_inventario FROM solicitudes  WHERE id_solicitud = $1 AND pendiente = TRUE`;
        const solicitudResult = await client.query(solicitudQuery, [id_solicitud]);

        if (solicitudResult.rowCount === 0) {
            return res.status(400).json({ message: "La solicitud no está pendiente o no existe." });
        }

        const { cantidad, fk_inventario } = solicitudResult.rows[0];


        const inventarioQuery = `SELECT cantidad FROM inventarios WHERE id_inventario = $1 FOR UPDATE`;
        const inventarioResult = await client.query(inventarioQuery, [fk_inventario]);

        if (inventarioResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Inventario no encontrado." });
        }

        const stockActual = inventarioResult.rows[0].cantidad;

        if (stockActual < cantidad) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "No hay suficiente stock para procesar la solicitud." });
        }


        const updateStockQuery = `UPDATE inventarios SET cantidad = cantidad - $1 WHERE id_inventario = $2`;
        await client.query(updateStockQuery, [cantidad, fk_inventario]);


        const actualizarSolicitudQuery = `UPDATE solicitudes SET aceptada = TRUE, pendiente = FALSE, rechazada = FALSE  WHERE id_solicitud = $1 AND pendiente = TRUE`;
        const result = await client.query(actualizarSolicitudQuery, [id_solicitud]);

        if (result.rowCount > 0) {
            await client.query('COMMIT');
            return res.status(200).json({ message: "La solicitud ha sido aceptada y el inventario actualizado." });
        } else {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "No fue posible aceptar la solicitud debido a que ya fue aceptada o rechazada." });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.log("Error al aceptar una solicitud en el sistema: " + error.message);
        return res.status(500).json({ message: "Error al aceptar una solicitud en el sistema" });
    } finally {
        client.release();
    }
};


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

export const topElementosMasSolicitados = async(req, res) =>{
    try{
        const sql = `SELECT 
  e.id_elemento,
  e.nombre AS nombre_elemento,
  st.id_sitio,
  st.nombre AS nombre_sitio,
  COUNT(*) AS cantidad_solicitudes,
  MAX(s.created_at) as fecha_solicitud
FROM solicitudes s
JOIN inventarios i ON s.fk_inventario = i.id_inventario
JOIN elementos e ON i.fk_elemento = e.id_elemento
JOIN sitios st ON i.fk_sitio = st.id_sitio
GROUP BY e.id_elemento, e.nombre, st.id_sitio, st.nombre
ORDER BY cantidad_solicitudes DESC
LIMIT 5;`;

const result = await pool.query(sql)

if (result.rowCount>0) {
    return res.status(200).json(result.rows)
} else {
    return res.status(200).json([])
}
    }catch(error){
        console.log("Error al consultar en el sistema "+error.message);
        return res.status(500).json({message:" Error al consultar en el sistema"})
    }
}

export const estadoSolicitud = async(req, res) => {
    try {
        const sql = `SELECT 
  e.nombre AS nombre_elemento,
  COUNT(s.id_solicitud) AS total_solicitudes,
  COUNT(*) FILTER (WHERE s.aceptada = TRUE) AS total_aceptadas,
  COUNT(*) FILTER (WHERE s.rechazada = TRUE) AS total_rechazadas,
  COUNT(*) FILTER (WHERE s.pendiente = TRUE) AS total_pendientes,
  ROUND(100.0 * COUNT(*) FILTER (WHERE s.aceptada = TRUE) / NULLIF(COUNT(*), 0), 2) AS porcentaje_aceptadas,
  ROUND(100.0 * COUNT(*) FILTER (WHERE s.rechazada = TRUE) / NULLIF(COUNT(*), 0), 2) AS porcentaje_rechazadas,
  ROUND(100.0 * COUNT(*) FILTER (WHERE s.pendiente = TRUE) / NULLIF(COUNT(*), 0), 2) AS porcentaje_pendientes,
  MAX(s.created_at) as fecha_solicitud
FROM solicitudes s
JOIN inventarios i ON s.fk_inventario = i.id_inventario
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
        console.log("Error al consultar en el sistema "+error.message);
        return res.status(500).json({message:" Error al consultar en el sistema: "+error.message})
    }
}