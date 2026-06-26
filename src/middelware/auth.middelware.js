import dotenv from 'dotenv';
dotenv.config();// Cargamos las variables de entorno desde el archivo .env. Esto es útil para mantener nuestras configuraciones sensibles, como las credenciales de Firebase, fuera del código fuente y en un lugar seguro. Asegúrate de tener un archivo .env en la raíz de tu proyecto con las variables necesarias, como PORT=3000 o cualquier otra configuración que necesites para tu aplicación.


import jwt from 'jsonwebtoken';


export const auth = (req, res, next) => {
    const authHeader = req.headers['authorization']; //en la peticion dentro de las cabeceras, se envia un header llamado Authorization con el valor Bearer TOKEN, donde TOKEN es el token JWT generado al hacer login. Este token se envia en cada peticion que requiera autenticacion.
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN, 

    console.log('Token recibido:', token); // para debuggear, se puede borrar luego

    if (!token) {
        return res.sendStatus(401).json({ error: 'Access denied. No token provided.' }); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        try {
            
            if (err) {
                console.error('Error al verificar el token:', err); // para debuggear, se puede borrar luego
                return res.sendStatus(403).json({ error: 'Invalid token.' }); // Forbidden
            }
            req.user = user;
            next();
        } catch (error) {
            console.error('Error al verificar el token:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    });
};



