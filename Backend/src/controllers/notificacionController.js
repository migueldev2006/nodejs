import { pool } from "../database/db.js";

export const crearNotificacion = async ({
  titulo,
  mensaje,
  destino,
  id_movimiento,
  id_solicitud,
}) => {
  if (!id_movimiento && !id_solicitud) {
    console.log(
      "Error: Se debe proporcionar un id_movimiento o id_solicitud para la notificación"
    );
    return;
  }

  const sql = `
    INSERT INTO notificaciones (titulo, mensaje, destino, fk_movimiento, fk_solicitud)
    VALUES ($1, $2, $3, $4, $5)
  `;

  const result = await pool.query(sql, [
    titulo,
    mensaje,
    destino,
    id_movimiento || null,
    id_solicitud || null,
  ]);

  if (result.rowCount > 0) {
    console.log("Notificación creada correctamente");
  } else {
    console.log("Error al crear la notificación");
  }
};

export const obtenerNotificaciones = async (req, res) => {
  try {
    const { destino } = req.query;
    const sql = `SELECT * FROM notificaciones n
JOIN usuarios u ON n.destino::INTEGER = u.id_usuario
WHERE u.id_usuario = $1 AND n.leido = false
ORDER BY n.created_at DESC;
`;
    const result = await pool.query(sql, [destino]);

    if (result.rowCount === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (error) {
    console.log(
      "Error al obtener las notificaciones en el sistema: " + error.message
    );
    return res
      .status(500)
      .json({ message: "Error al obtener las notificaciones" });
  }
};

export const marcarNotificacionLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `UPDATE notificaciones SET leido = true WHERE id_notificacion = $1 RETURNING *`;
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      return res
        .status(200)
        .json({ message: "Notificación marcada como leída" });
    } else {
      return res
        .status(400)
        .json({ message: "No se encontró la notificación" });
    }
  } catch (error) {
    console.log("Error al marcar la notificación como leída: " + error.message);
    return res
      .status(500)
      .json({ message: "Error al marcar la notificación como leída" });
  }
};

export const responderNotificacion = async (req, res) => {
  const { id_notificacion, respuesta } = req.body; // respuesta = "aceptar" o "cancelar"

  try {
    const notiSql = `SELECT fk_movimiento FROM notificaciones WHERE id_notificacion = $1`;
    const notiResult = await pool.query(notiSql, [id_notificacion]);

    if (notiResult.rowCount === 0) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    const { fk_movimiento } = notiResult.rows[0];

    if (respuesta === "aceptar") {
      await pool.query(
        `UPDATE movimientos SET aceptado = TRUE, en_proceso = FALSE, cancelado = FALSE WHERE id_movimiento = $1`,
        [fk_movimiento]
      );
    } else if (respuesta === "cancelar") {
      await pool.query(
        `UPDATE movimientos SET aceptado = FALSE, en_proceso = FALSE, cancelado = TRUE WHERE id_movimiento = $1`,
        [fk_movimiento]
      );
    }

    await pool.query(
      `UPDATE notificaciones SET leido = TRUE WHERE id_notificacion = $1`,
      [id_notificacion]
    );

    return res.status(200).json({
      message: "Movimiento actualizado correctamente desde notificación",
    });
  } catch (error) {
    console.log("Error al responder la notificación", error.message);
    return res.status(500).json({ message: "Error al procesar la respuesta" });
  }
};
