import { pool } from "../database/db.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, img, cb) {
        cb(null, "public/img");
    },
    filename: function (req, img, cb) {
        const imagen_elemento = Date.now() + "-" + img.originalname;
        cb(null, imagen_elemento);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
  }).single('imagen_elemento');
  
  export const cargarImagen = upload;

export const registrarElementos = async (req, res) => {
    try {
        const {nombre, descripcion, valor, perecedero, no_perecedero, estado, fecha_vencimiento, fecha_uso, fk_unidad_medida, fk_categoria} = req.body;
        const imagen_elemento = req.file.filename;;
        const sql = 'INSERT INTO elementos(nombre, descripcion, valor, perecedero, no_perecedero, estado, fecha_vencimiento, fecha_uso, imagen_elemento, fk_unidad_medida, fk_categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_elemento';
        const result = await pool.query(sql, [nombre, descripcion, valor, perecedero, no_perecedero, estado, fecha_vencimiento, fecha_uso, imagen_elemento, fk_unidad_medida, fk_categoria]);
        if(result.rowCount>0){
            return res.status(201).json({message:"El elemento se ha registrado correctamente", id_elemento:result.rows[0].id_elemento, imagen_elemento:imagen_elemento});
        }else{
            return res.status(400).json({message:"No fue posible registrar el elemento"});
        }
    } catch (error) {
        console.log("Error al consultar en el sistema" + error.message);
        return res.status(500).json({ message: "Error al agregar un elemento en el sistema" });
    }
}

export const actualizarElementos = async (req, res) => {
    try {
        const {id_elemento} = req.params
        const {nombre, descripcion, valor} = req.body;
        const sqlSelect = `SELECT imagen_elemento FROM elementos WHERE id_elemento = $1`;
        const resultSelect = await pool.query(sqlSelect, [id_elemento]);
        if (resultSelect.rowCount === 0) {
            return res.status(404).json({ message: "Elemento no encontrado" });
        }
        const imagenActual = resultSelect.rows[0].imagen_elemento;
        let nuevaImagen = imagenActual;
        if (req.file) {
            nuevaImagen = req.file.filename;
        }
        const sql = "UPDATE elementos SET nombre = $1, descripcion = $2, valor = $3, imagen_elemento = $4 WHERE id_elemento = $5";
        const result = await pool.query(sql, [nombre, descripcion, valor, nuevaImagen, id_elemento]);
        if (result.rowCount>0) {
            return res.status(200).json({message:"Se actualizo el elemento correctamente"});
        }else{
            return res.status(400).json({message:"No se actualizo el elemento"});
        }
    } catch (error) {
        console.log("Error al consultar en el sistema: " + error.message);
        return res.status(500).json({ message: "Error al actualizar el elemento en el sistema" });
    }
}

export const cambiarEstadoElemento = async (req, res) => {
    try {
        const { id_elemento } = req.params;
        const sql = ` UPDATE elementos SET estado = CASE WHEN estado = TRUE THEN FALSE WHEN estado = FALSE THEN TRUE END WHERE id_elemento = $1
        `;
        const result = await pool.query(sql, [id_elemento]);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "El elemento se ha cambiado de estado exitosamente" })
        } else {
            return res.status(400).json({ message: "No se logro cambiar el estado del elemento" })
        }
    } catch (error) {
        console.log("Error al consultar en el sistema " + error.message);
        return res.status(500).json({ message: "Error al cambiar el estado del elemento en el sistema" })
    }
}

export const listarElementos = async (req, res) => {
    try {
        const sql = `SELECT * FROM elementos`
        const result = await pool.query(sql);
        if (result.rowCount === 0) {
            return res.status(200).json([])
        } else {
            return res.status(200).json(result.rows);
        }
    } catch (error) {
        console.log("Error al consultar en el sistema " + error.message);
        return res.status(500).json({ message: "Error al consultar en el sistema" });
    }
}



export const elementosUso = async (req, res) => {
    try {
        const sql = `SELECT 
    e.nombre AS elemento,
    SUM(i.stock) AS stock_total,
    COALESCE(SUM(m.cantidad), 0) AS total_usado,
    ROUND(
        CASE 
            WHEN SUM(i.stock) = 0 THEN 0
            ELSE COALESCE(SUM(m.cantidad), 0)::numeric / NULLIF(SUM(i.stock), 0)
        END, 
        2
    ) AS indice_uso
FROM elementos e
JOIN inventarios i ON e.id_elemento = i.fk_elemento
LEFT JOIN movimientos m ON i.id_inventario = m.fk_inventario AND m.aceptado = TRUE
GROUP BY e.nombre
ORDER BY indice_uso ASC;
`
        const result = await pool.query(sql);
        if (result.rowCount === 0) {
            return res.status(200).json([])
        } else {
            return res.status(200).json(result.rows);
        }
    } catch (error) {
        console.log("Error al consultar los elementos " + error.message);
        return res.status(500).json({ message: "Error al consultar en el sistema" });
    }
}

export const elementosPrestados = async (req, res) => {
    try {
        const sql = `
        SELECT 
            u.nombre AS nombre_usuario,
            e.nombre AS nombre_elemento,
            SUM(m.cantidad) AS total_prestado,
            MAX(m.created_at) AS fecha_prestamo
        FROM 
            movimientos m
        JOIN 
            inventarios i ON m.fk_inventario = i.id_inventario
        JOIN 
            elementos e ON i.fk_elemento = e.id_elemento
        JOIN 
            usuarios u ON m.fk_usuario = u.id_usuario
        JOIN 
            tipo_movimientos tm ON m.fk_tipo_movimiento = tm.id_tipo
        WHERE 
            tm.nombre ILIKE 'Prestamo'
        GROUP BY 
            u.nombre, e.nombre
        ORDER BY 
            u.nombre, e.nombre;
        `;

        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error al consultar los prestamos: " + error.message);
        return res.status(500).json({ message: "Error al consultar los prestamos" });
    }
};


export const elementosDadosBaja = async (req, res) => {
    try {
        const sql = `
        SELECT 
            e.id_elemento,
            e.nombre AS nombre_elemento,
            e.descripcion,
            e.valor,
            e.estado,
            e.created_at AS fecha_baja,
            e.updated_at,
            u.nombre AS usuario_que_dio_baja,
            tm.nombre AS tipo_movimiento
        FROM 
            elementos e
        JOIN 
            inventarios i ON i.fk_elemento = e.id_elemento
        JOIN 
            movimientos m ON m.fk_inventario = i.id_inventario
        JOIN 
            usuarios u ON u.id_usuario = m.fk_usuario
        JOIN 
            tipo_movimientos tm ON tm.id_tipo = m.fk_tipo_movimiento
        WHERE 
            e.estado = false
            AND tm.nombre ILIKE 'Baja'
        ORDER BY 
            e.updated_at DESC;
        `;

        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error al consultar los elementos dados de baja: " + error.message);
        return res.status(500).json({ message: "Error al consultar los elementos dados de baja" });
    }
};


export const salidaIngresoElementos = async (req, res) => {
    try {
        const sql = `
        SELECT 
            e.nombre AS nombre_elemento,
            tm.nombre AS tipo_movimiento,
            m.cantidad,
            m.created_at AS fecha_movimiento,
            m.hora_ingreso,
            m.hora_salida,
            u.nombre AS usuario,
            CASE 
                WHEN tm.nombre ILIKE 'Ingreso' THEN s.nombre
                WHEN tm.nombre ILIKE 'Salida' THEN m.destino
                ELSE 'N/A'
            END AS lugar_destino
        FROM 
            movimientos m
        JOIN 
            inventarios i ON m.fk_inventario = i.id_inventario
        JOIN 
            elementos e ON i.fk_elemento = e.id_elemento
        JOIN 
            usuarios u ON m.fk_usuario = u.id_usuario
        JOIN 
            tipo_movimientos tm ON m.fk_tipo_movimiento = tm.id_tipo
        LEFT JOIN 
            sitios s ON m.fk_sitio = s.id_sitio
        WHERE 
            tm.nombre ILIKE 'Ingreso' OR tm.nombre ILIKE 'Salida'
        ORDER BY 
            m.created_at DESC;
        `;

        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error al realizar la consulta: " + error.message);
        return res.status(500).json({ message: "Error al realizar la consulta" });
    }
};


export const elementosCaducados = async (req, res) => {
    try {
        const sql = `SELECT 
            e.nombre,
            e.descripcion,
            e.fecha_vencimiento,
            e.perecedero,
            i.stock,
            s.nombre AS sitio,
            e.created_at
        FROM 
            elementos e
        JOIN 
            inventarios i ON e.id_elemento = i.fk_elemento  
        JOIN 
            sitios s ON i.fk_sitio = s.id_sitio
        ORDER BY 
            e.fecha_vencimiento ASC;
        `;
        
        const result = await pool.query(sql);
        
        if (result.rowCount > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        console.log("Error al consultar los elementos caducados: " + error.message);
        return res.status(500).json({ message: "Error al consultar los elementos caducados" });
    }
};