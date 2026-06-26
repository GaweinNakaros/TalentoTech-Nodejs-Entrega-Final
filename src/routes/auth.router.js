import {Router} from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = Router();

// prefijo: //api/auth

router.post('/login', login); // siempre se envia por post, por seguridad, ya que los datos de login (usuario y contraseña) no deben ser visibles en la URL.
router.post('/register', register);

export default router;

