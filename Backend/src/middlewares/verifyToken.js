import jwt from 'jsonwebtoken'
import { listedBlack } from '../controllers/usuarioController.js';
import dotenv from 'dotenv'
dotenv.config();

const verifyToken = () => async (req, res, next) => {

    try {
        const header = req.headers['authorization'];
        const token = header ? header.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ msg: "Token no proveido" })
        }

        if (listedBlack(token)) {
            return res.status(401).json({ msg: "Token expirado" })
        }

        const verified = jwt.verify(token, process.env.AUT_SECRET);

        next();

    }
    catch (error) {
        console.error("Error autenticando:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Token inválido" });
        }

        return res.status(500).json({ msg: "Error autenticando" });
    }
}

export default verifyToken;