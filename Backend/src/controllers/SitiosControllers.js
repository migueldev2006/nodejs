import { pool } from "../database/db.js";

const Registrar_Sitio = async (req, res) => {
  try {
    const {
      nombre,
      persona_encargada,
      ubicacion,
      estado,
      fk_tipo_sitio,
      fk_area,
    } = req.body;
    const sql =
      " insert into sitios (nombre,persona_encargada,ubicacion,estado,fk_tipo_sitio,fk_area) values($1,$2,$3,$4,$5,$6)";
    const result = await pool.query(sql, [
      nombre,
      persona_encargada,
      ubicacion,
      estado,
      fk_tipo_sitio,
      fk_area,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar sitio" });
  }
};

const Actualizar_Sitio = async (req, res) => {
  try {
    const { nombre, persona_encargada, ubicacion } = req.body;
    const { id_sitio } = req.params;
    const sql =
      "update sitios set  nombre=$1,persona_encargada=$2,ubicacion=$3 where id_sitio=$4";
    const result = await pool.query(sql, [
      nombre,
      persona_encargada,
      ubicacion,
      id_sitio,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualziar sitios" });
  }
};

const Desactivar_Sitio = async (req, res) => {
  try {
    const { id_sitio } = req.params;
    const sql =
      "update sitios set estado= CASE WHEN estado = false THEN true ELSE false END where id_sitio=$1";
    const result = await pool.query(sql, [id_sitio]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al desactivar sitio" });
  }
};

const Listar_Sitios = async (req, res) => {
  try {
    const sql = "select * from sitios";
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al listar sitios" });
  }
};

const obtenerTopSitiosPorElementos = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id_sitio,
        s.nombre AS nombre_sitio,
        COUNT(i.id_inventario) AS total_elementos
      FROM sitios s
      JOIN inventarios i ON s.id_sitio = i.fk_sitio
      GROUP BY s.id_sitio
      ORDER BY total_elementos DESC
      LIMIT 3;
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener sitios con más elementos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const obtenerAreaConMasElementos = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id_area,
        a.nombre AS nombre_area,
        COUNT(i.id_inventario) AS total_elementos
      FROM areas a
      JOIN sitios s ON s.fk_area = a.id_area
      JOIN inventarios i ON i.fk_sitio = s.id_sitio
      GROUP BY a.id_area
      ORDER BY total_elementos DESC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows[0]); // devuelve solo el primero
  } catch (error) {
    console.error("Error al obtener el área con más elementos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const obtenerElementosPorAgotarse = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id_elemento,
        e.nombre AS nombre_elemento,
        i.stock
      FROM inventarios i
      JOIN elementos e ON e.id_elemento = i.fk_elemento
      ORDER BY i.stock ASC
      LIMIT 10;
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener elementos por agotarse:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export {
  Registrar_Sitio,
  Actualizar_Sitio,
  Desactivar_Sitio,
  Listar_Sitios,
  obtenerTopSitiosPorElementos,
  obtenerAreaConMasElementos,
  obtenerElementosPorAgotarse,
};
