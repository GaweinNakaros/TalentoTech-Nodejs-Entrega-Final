import { fileURLToPath } from 'url';
import db from '../../firebase.js'; // importo la base de datos de Firebase, que exporté como default en firebase.js
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore"; // importo las funciones necesarias para interactuar con Firestore

// creo una referencia a la colección "products" en Firestore, utilizando la función collection y pasando la base de datos y el nombre de la colección como argumentos.
const productsCollection = collection(db, "products");

const productsSeeders = [
    {
        sku: 'PROD-1',
        name: "Producto 1",
        price: 10.99,
        stock: 100,
        description: "Descripción del producto 1"
    },
    {
        sku: 'PROD-2',
        name: "Producto 2",
        price: 19.99,
        stock: 50,
        description: "Descripción del producto 2"
    },
    {
        sku: 'PROD-3',
        name: "Producto 3",
        price: 5.99,
        stock: 200,
        description: "Descripción del producto 3"
    },
    {
        sku: 'PROD-4',
        name: "Producto 4",
        price: 29.99,
        stock: 25,
        description: "Descripción del producto 4"
    },
    {
        sku: 'PROD-5',
        name: "Producto 5",
        price: 15.99,
        stock: 75,
        description: "Descripción del producto 5"
    }
];

export const seedProducts = async () => {
    const snapshot = await getDocs(productsCollection); // Obtiene los productos existentes

    for (const product of productsSeeders) {
        const existingProduct = snapshot.docs.find((docSnap) => {
            const data = docSnap.data();
            return data.sku === product.sku || data.name === product.name;
        });

        if (existingProduct) {
            const docRef = doc(db, 'products', existingProduct.id);
            await updateDoc(docRef, product); // Actualiza los productos existentes para agregar/normalizar SKU
            console.log(`Producto ${product.name} actualizado en Firestore`);
        } else {
            await addDoc(productsCollection, product); // Crea el producto si no existe
            console.log(`Producto ${product.name} creado en Firestore`);
        }
    }
};

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
    seedProducts()
        .then(() => console.log('Seed finalizado'))
        .catch((error) => {
            console.error('Error al ejecutar seed:', error);
            process.exit(1);
        });
}
