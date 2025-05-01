import { pool } from '../database/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

//Iniciar Sesion

const login = async (req, res) => {
    try {
        const { documento, password } = req.body;
        const sql = 'SELECT * FROM usuarios WHERE documento = $1 ';
        const result = await pool.query(sql, [documento]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        const user = result.rows[0];
        const verified = await bcrypt.compare(password, user.password)
        if (verified) {
            const modulosSQL = `SELECT m.nombre FROM modulos m JOIN rol_modulo rm ON rm.fk_modulo = m.id_modulo JOIN usuarios u ON u.fk_rol = rm.fk_rol WHERE rm.fk_rol = u.fk_rol AND u.documento = $1`
            const modulos = await pool.query(modulosSQL,[documento]);

            const token = jwt.sign({...user,modulos : modulos.rows}, process.env.AUT_SECRET)
            return res.status(200).json({ token })
        }else{
            return res.status(400).json({msg:"Contraseña incorrecta"})
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error logueandose" })
    }
}

//Cerrar Sesion

export const blacklist = new Set();

const listedBlack = (token) =>{
    return blacklist.has(token);
}

const logout = async(req,res) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: "Token no enviado" })
        } 

        if(token){
            blacklist.add(token);
        }

        console.log(listedBlack(token))

        res.status(200).json({msg:"Sesion cerrada"});
    }catch(error){
        console.error(error);
        res.status(500).json({msg:"Error cerrando sesion"})
    }
}

// Registrar Ususario

const registrar = async (req, res) => {
    try {
        const { documento, nombre, apellido, edad, telefono, correo, estado, cargo, password,fk_rol} = req.body;
        const sql = "INSERT INTO usuarios(documento,nombre,apellido,edad,telefono,correo,estado,cargo,password,fk_rol) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await pool.query(sql, [documento, nombre, apellido, edad, telefono, correo, estado, cargo, encryptedPassword,fk_rol]);
        return res.status(201).json(user)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registrando usuario" })
    }
}


//Actualizar Usuario


const actualizar = async (req, res) => {
    try {
        const { nombre, apellido, edad, telefono, correo, cargo } = req.body
        const { id } = req.params
        const sql = "UPDATE usuarios SET nombre = $1,apellido = $2,edad = $3,telefono = $4,correo = $5, cargo = $6 WHERE id_usuario = $7"
        const result = await pool.query(sql, [nombre, apellido, edad, telefono, correo, cargo,id])
        res.status(200).json({ msg: "usuario actualizado con exito" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "error actualizando el usuario" })
    }
}


// Desactivar Usuario


const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params
        const sql = `UPDATE usuarios SET estado =
        CASE 
        WHEN estado = true THEN false
        WHEN estado = false THEN true
        END
        WHERE id_usuario = $1`
        const result = await pool.query(sql, [id])
        res.status(200).json({ msg: "Estado actualizado con exito" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Algo salio mal" })
    }
}



//Listar Usuarios

const listar = async (req, res) => {
    try {
        const sql = "SELECT * FROM usuarios"
        const result = await pool.query(sql)
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "no se pudo listar usuarios" })
    }
}

// Obtener el reporte de usuarios
// Obtener asignaciones de elementos
// Obtener asignaciones de elementos
export const getAsignacionesElementos = async (req, res) => {
    try {
      const result = await pool.query(`
SELECT u.id_usuario, u.nombre, u.apellido, f.id_ficha, f.codigo_ficha
FROM usuario_ficha uf
JOIN usuarios u ON uf.fk_usuario = u.id_usuario
JOIN fichas f ON uf.fk_ficha = f.id_ficha
WHERE u.estado = TRUE; -- Puedes añadir más condiciones según lo necesites
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error en getAsignacionesElementos:", error);
      res.status(500).json({ message: "Error al obtener asignaciones.", error: error.message });
    }
  };
  
  
 // Obtener reporte de usuarios
export const getReporteUsuarios = async (req, res) => {
    try {
      const result = await pool.query(`
SELECT 
    u.id_usuario, 
    u.nombre, 
    u.apellido, 
    s.nombre AS sede_nombre, 
    c.nombre AS centro_nombre
FROM 
    usuarios u
JOIN 
    areas a ON u.id_usuario = a.fk_usuario
JOIN 
    sedes s ON a.fk_sede = s.id_sede
JOIN 
    centros c ON s.fk_centro = c.id_centro
WHERE 
    u.estado = TRUE; 
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error en getReporteUsuarios:", error);
      res.status(500).json({ message: "Error al obtener el reporte de usuarios.", error: error.message });
    }
  };
  
// Obtener usuarios por ficha
export const getUsuariosPorFicha = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          f.id_ficha,
          f.codigo_ficha AS codigo,
          COUNT(uf.fk_usuario) AS total_usuarios
        FROM fichas f
        LEFT JOIN usuario_ficha uf ON f.id_ficha = uf.fk_ficha
        GROUP BY f.id_ficha, f.codigo_ficha
        ORDER BY total_usuarios DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error en getUsuariosPorFicha:", error);
      res.status(500).json({ message: "Error al obtener reporte de fichas.", error: error.message });
    }
  };
  
 // Obtener movimientos por usuario y elemento
export const getMovimientosPorUsuarioElemento = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          u.id_usuario,
          u.nombre || ' ' || u.apellido AS nombre_usuario,
          u.documento,
          r.nombre AS rol,
          e.id_elemento,
          e.nombre AS nombre_elemento,
          COUNT(m.id_movimiento) AS total_movimientos
        FROM movimientos m
        INNER JOIN usuarios u ON m.fk_usuario = u.id_usuario
        INNER JOIN roles r ON u.fk_rol = r.id_rol
        INNER JOIN inventarios i ON m.fk_inventario = i.id_inventario
        INNER JOIN elementos e ON i.fk_elemento = e.id_elemento
        GROUP BY u.id_usuario, u.nombre, u.documento, r.nombre, e.id_elemento, e.nombre
        ORDER BY total_movimientos DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error en getMovimientosPorUsuarioElemento:", error);
      res.status(500).json({ message: "Error al obtener reporte de movimientos.", error: error.message });
    }
  };
  
  
  export { login,logout,listedBlack, registrar, actualizar, cambiarEstado, listar }