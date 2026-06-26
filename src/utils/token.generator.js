
import dotenv from 'dotenv';

dotenv.config();// Cargamos las variables de entorno desde el archivo .env. Esto es útil para mantener nuestras configuraciones sensibles, como las credenciales de Firebase, fuera del código fuente y en un lugar seguro. Asegúrate de tener un archivo .env en la raíz de tu proyecto con las variables necesarias, como PORT=3000 o cualquier otra configuración que necesites para tu aplicación.

import jwt from 'jsonwebtoken';


export const generateToken = (user) => {
    // Genera un token JWT con la información del usuario y una clave secreta
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

