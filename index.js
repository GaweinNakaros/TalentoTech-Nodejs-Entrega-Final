// Importamos el paquete dotenv para cargar las variables de entorno desde un archivo .env. Esto nos permite mantener nuestras configuraciones sensibles, como las credenciales de Firebase, fuera del código fuente y en un lugar seguro.
import dotenv from 'dotenv';
dotenv.config();// Cargamos las variables de entorno desde el archivo .env. Esto es útil para mantener nuestras configuraciones sensibles, como las credenciales de Firebase, fuera del código fuente y en un lugar seguro. Asegúrate de tener un archivo .env en la raíz de tu proyecto con las variables necesarias, como PORT=3000 o cualquier otra configuración que necesites para tu aplicación.

// Importamos las dependencias necesarias para nuestro servidor Express, incluyendo express, cors y los routers para manejar las rutas de productos, usuarios y categorías. También importamos la configuración de Firebase para interactuar con nuestra base de datos Firestore.
import express from 'express';

// Importamos las funciones necesarias para inicializar Firebase y configurar la conexión a nuestra base de datos.
import db from './firebase.js'; // importo la base de datos de Firebase, que exporté como default en firebase.js
import { collection, addDoc } from "firebase/firestore"; // importo las funciones necesarias para interactuar con Firestore, como collection y addDoc

// Importamos los routers para manejar las rutas de productos, usuarios y categorías.
import cors from 'cors'; // Si decides usar el paquete cors, puedes importarlo aquí y luego usarlo como middleware global con app.use(cors());
import productosRouter from './src/routes/productos.router.js'; // si es el export default, puedo llamarlo como quiera, no necesariamente productosRouter
import usersRouter from './src/routes/users.router.js';
import categoriesRouter from './src/routes/categories.router.js';


const app = express();
// Usamos la variable de entorno PORT, o el puerto 3000 si no está definida. Esto es útil para desplegar nuestra aplicación en plataformas como Heroku, donde el puerto se asigna dinámicamente a través de la variable de entorno PORT.
const PORT = process.env.PORT || 3000; // procesos.env.PORT es la variable de entorno que contiene el puerto asignado por la plataforma de despliegue, como Heroku. Si no está definida, usaremos el puerto 3000 por defecto.

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());


// Middleware para parsear datos de formularios (x-www-form-urlencoded)
// CORS (Cross-Origin Resource Sharing) - Permite que otros dominios accedan a nuestra API
// Esto es importante si queremos que nuestra API sea consumida por aplicaciones web que se ejecutan en un dominio diferente al de nuestro servidor.
// Para habilitar CORS, podemos usar el paquete 'cors' de npm, o hacerlo manualmente con middleware personalizado.
// es como un sistema de seguridad para permitir o bloquear solicitudes de otros dominios. Si no habilitamos CORS, solo las solicitudes desde el mismo dominio podrán acceder a nuestra API, lo que puede ser un problema si queremos que nuestra API sea consumida por aplicaciones web externas.
app.use(cors()); // Usar el middleware cors para habilitar CORS


//  Middleware para parsear datos de formularios (x-www-form-urlencoded)
app.get('/', (req, res) => {
    res.send(`
        <h1>API de Productos</h1>
        <p>Bienvenido a mi servidor Express.</p>
    `);
});


// Middleware para manejar rutas de productos
app.use('/api/productos', productosRouter);


// Middleware para manejar rutas de usuarios
app.use('/api/users', usersRouter); // se puede usar sin prefijo, o con uno específico como /api/users, dependiendo de cómo se definan las rutas en el router.


// Middleware para manejar rutas de categorías
app.use('/api/categories', categoriesRouter); // se puede usar sin prefijo, o con uno específico como /api/categories, dependiendo de cómo se definan las rutas en el router.


// Ruta de ejemplo para mostrar cómo funcionan los path params, 
app.get("/parametros/:uid", (req, res) => {
    console.log(req.params); // req.params es un objeto con los path params
    const { uid } = req.params;
    res.json({ uid, message: "Path params recibidos correctamente" });
});


// Ruta de ejemplo para mostrar cómo funcionan los query params
app.get("/query/params", (req, res) => {
    console.log(req.query); // req.query es un objeto con los query params
    const { id } = req.query;
    res.json({ id, message: "Query params recibidos correctamente" });
});


// Ruta de ejemplo para mostrar cómo funcionan los path params
app.get("/up", (req, res) => {
    res.json({ 
        status: "OK",
        message: "Servidor Express funcionando correctamente" });
});


// Middleware para manejar rutas no definidas (404)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


// Ruta de ejemplo para mostrar cómo crear un producto en Firestore

const createProduct = async () => {
    const product = {
        name: "Producto de ejemplo",
        price: 100,
        stock: 10
    };

    await addDoc(collection(db, "products"), product);
    console.log("Producto creado en Firestore");
};
        

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

