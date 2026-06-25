// Importamos el paquete dotenv para cargar las variables de entorno desde un archivo .env. Esto nos permite mantener nuestras configuraciones sensibles, como las credenciales de Firebase, fuera del código fuente y en un lugar seguro.
import dotenv from 'dotenv';
dotenv.config();// Cargamos las variables de entorno desde el archivo .env. Esto es útil para mantener nuestras configuraciones sensibles, como las credenciales de Firebase, fuera del código fuente y en un lugar seguro. Asegúrate de tener un archivo .env en la raíz de tu proyecto con las variables necesarias, como PORT=3000 o cualquier otra configuración que necesites para tu aplicación.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore"; // importo la base de datos


// Las credenciales de Firebase se cargan desde las variables de entorno, que a su vez se cargan desde el archivo .env. 
// Esto es importante para mantener nuestras configuraciones sensibles, como las credenciales de Firebase, fuera del código fuente y en un lugar seguro. 
// Asegúrate de tener un archivo .env en la raíz de tu proyecto con las variables necesarias, como API_KEY, AUTH_DOMAIN, PROJECT_ID, etc.
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;