import { Router } from 'express';
import { obtenerNotificaciones, marcarNotificacionLeida, crearNotificacion, responderNotificacion } from '../controllers/notificacionController.js';

export const notificaciónRoute = Router();

notificaciónRoute.get('/notificaciones', obtenerNotificaciones); 
notificaciónRoute.post('/notificaciones/:id/leida', marcarNotificacionLeida); 
notificaciónRoute.post('/notificaciones', crearNotificacion); 
notificaciónRoute.post('/notificaciones/:id_notificacion', responderNotificacion); 

