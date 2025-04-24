import { pool } from "../../src/database/db.js";

const verifyRol = (permisoId) => async(req,res,next) => {
    const user = req.user;
    const sql = 'SELECT rm.id_rol_modulo FROM rol_modulo rm JOIN usuarios u ON u.fk_rol = rm.fk_rol WHERE u.documento = $1 AND rm.fk_permiso = $2';
    const result = await pool.query(sql,[user.documento,permisoId]);
    if(result.rows.length === 0){
        return res.status(403).json({mensaje : "No puedes realizar esta acción"});
    }
    next();
}

export default verifyRol;