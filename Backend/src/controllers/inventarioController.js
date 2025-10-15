import { pool } from "../database/db.js";

export const registrarInventarios = async (req, res) => {
  try {
    const { stock, estado, fk_sitio, fk_elemento } = req.body;

    // Obtener la categoría del elemento que se quiere agregar
    const categoriaQuery = `SELECT fk_categoria FROM elementos WHERE id_elemento = $1`;
    const categoriaResult = await pool.query(categoriaQuery, [fk_elemento]);

    if (categoriaResult.rowCount === 0) {
      return res.status(404).json({ message: "Elemento no encontrado" });
    }

    const categoria = categoriaResult.rows[0].fk_categoria;

    // Verificar si ya hay un inventario con un elemento de la misma categoría y sitio
    const buscarInventario = `
      SELECT i.id_inventario, i.stock
      FROM inventarios i
      JOIN elementos e ON i.fk_elemento = e.id_elemento
      WHERE i.fk_sitio = $1 AND e.fk_categoria = $2
    `;

    const inventarioExistente = await pool.query(buscarInventario, [fk_sitio, categoria]);

    if (inventarioExistente.rowCount > 0) {
      // Ya hay un inventario con un elemento de esa categoría, actualizar stock
      const { id_inventario, stock: stockActual } = inventarioExistente.rows[0];
      const nuevoStock = stockActual + stock;

      const actualizarStock = `
        UPDATE inventarios
        SET stock = $1, updated_at = NOW()
        WHERE id_inventario = $2
      `;

      await pool.query(actualizarStock, [nuevoStock, id_inventario]);

      return res.status(200).json({ message: "Stock actualizado correctamente" });
    } else {
      // No existe inventario para esa categoría en ese sitio, crear uno nuevo
      const insertarInventario = `
        INSERT INTO inventarios (stock, estado, fk_sitio, fk_elemento)
        VALUES ($1, $2, $3, $4)
      `;

      await pool.query(insertarInventario, [stock, estado, fk_sitio, fk_elemento]);

      return res.status(201).json({ message: "Elemento agregado correctamente al inventario" });
    }
  } catch (error) {
    console.log("Error al registrar elementos al inventario: " + error.message);
    return res.status(500).json({ message: "Error en el servidor al registrar el inventario" });
  }
};

// export const actualizarInventarios = async(req, res) => {
//     try {
//         const {id_inventario} = req.params;
//         const { stock, estado, fk_sitio, fk_elemento} = req.body;
//         const sql = `UPDATE inventarios SET stock = $1, estado = $2, fk_sitio = $3, fk_elemento = $4 WHERE id_inventario = $5`;
//         const result = await pool.query(sql, [ stock, estado, fk_sitio, fk_elemento, id_inventario]);
//         if (result.rowCount>0) {
//             return res.status(200).json({message:"Inventario actualizado"});
//         } else {
//             return res.status(400).json({message:"No se logro realizar la actualizacion"});
//         }
//     } catch (error) {
//         console.log("Error al actualizar el inventario en el sistema "+error.message);
//         return res.status(500).json({message:"Error al actualizar el inventario en el sistema"});
//     }
// }

export const cambiarEstadoInventario = async (req, res) => {
  try {
    const { id_inventario } = req.params;
    const sql = `UPDATE inventarios SET estado = CASE WHEN estado = TRUE THEN FALSE WHEN estado = FALSE THEN TRUE END WHERE id_inventario = $1`;
    const result = await pool.query(sql, [id_inventario]);
    if (result.rowCount > 0) {
      return res
        .status(200)
        .json({ message: "Se cambio el estado del ineventario exitosamente" });
    } else {
      return res
        .status(400)
        .json({ message: " No se logro cambiar el estado del inventario" });
    }
  } catch (error) {
    console.log(
      "Error al cambiar el estado del inventario en el sistema " + error.message
    );
    return res
      .status(500)
      .json({
        message: "Error al cambiar el estado del inventario en el sistema",
      });
  }
};

export const listarInventarios = async (req, res) => {
  try {
    const sql = `SELECT * FROM inventarios`;
    const result = await pool.query(sql);
    if (result.rowCount === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (error) {
    console.log("Error al consultar en el sistema " + error.message);
    return res
      .status(500)
      .json({ message: "Error al consultar en el sistema" });
  }
};

export const reporteInventario = async (req, res) => {
  try {
    const { rows } = await pool.query(`
                SELECT 
                  e.id_elemento,
                  e.nombre AS nombre_elemento,
                e.created_at AS created_at,
                  c.nombre AS nombre_categoria,
                  i.stock AS cantidad,  -- Ajusta el nombre aquí
                  um.nombre AS unidad_medida,
                  s.nombre AS nombre_sede,
                  si.nombre AS nombre_sitio
                FROM inventarios i
                INNER JOIN elementos e ON i.fk_elemento = e.id_elemento
                INNER JOIN categorias c ON e.fk_categoria = c.id_categoria
                INNER JOIN sitios si ON i.fk_sitio = si.id_sitio
                INNER JOIN sedes s ON si.fk_area = s.id_sede  -- Relación con sedes desde sitios
                INNER JOIN unidades_medida um ON e.fk_unidad_medida = um.id_unidad
                WHERE i.estado = true;
              `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al generar el reporte de inventario" });
  }
};

export const stockInventario = async (req, res) => {
  try {
    const sql = `SELECT 
  s.nombre AS sitio, 
  e.nombre AS nombre_elemento, 
  i.stock 
FROM 
  inventarios i 
JOIN 
  sitios s ON i.fk_sitio = s.id_sitio 
JOIN 
  elementos e ON i.fk_elemento = e.id_elemento
WHERE 
  i.stock < 6 AND i.estado = true;`;

    const result = await pool.query(sql);
    if (result.rowCount === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (error) {
    console.log("Error al consultar stock en el sistema " + error.message);
    return res
      .status(500)
      .json({ message: "Error al consultar en el sistema" });
  }
};
