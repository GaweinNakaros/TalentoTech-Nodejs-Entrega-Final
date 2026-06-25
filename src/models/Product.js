// models/Product.js
// Este archivo contiene las funciones que interactúan directamente con Firestore para realizar operaciones CRUD sobre la colección 'products'.
// Básicamente manejamos la conexión a la base de datos y las operaciones sobre los documentos, mientras que los controllers se encargan de manejar las peticiones HTTP y llamar a estas funciones del modelo para obtener o modificar los datos.

import db from '../../firebase.js'; // Importa la instancia de Firestore exportada en firebase.js
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    query,
    where,
    orderBy
} from "firebase/firestore"; // Importa funciones de la SDK de Firestore necesarias para CRUD

const productsCollection = collection(db, "products"); // Referencia a la colección 'products' en Firestore

const normalizeSku = (sku) => sku.trim().toUpperCase().replace(/\s+/g, '-'); // Convierte el SKU a mayúsculas y reemplaza espacios por guiones

const generateSku = (name) => {
    const base = name
        ? name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : 'PRODUCT';
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `${base}-${suffix}`.slice(0, 30);
};

const findProductBySku = async (sku) => { // Busca un producto por su SKU de negocio
    const normalizedSku = normalizeSku(sku);
    const productsQuery = query(productsCollection, where('sku', '==', normalizedSku));
    const snapshot = await getDocs(productsQuery);

    let product = null;
    snapshot.forEach((docSnap) => {
        product = { id: docSnap.id, ...docSnap.data() };
    });

    return product;
};

export const fetchProducts = async () => { // Función que obtiene todos los documentos de la colección
    const productsQuery = query(productsCollection, orderBy('name')); // Ordena los productos por nombre para obtener un orden consistente
    const snapshot = await getDocs(productsQuery); // Realiza la consulta para obtener los documentos

    const products = []; // Array donde se almacenarán los productos obtenidos

    snapshot.forEach((docSnap) => { // Itera cada documento del snapshot
        products.push({ // Inserta en el array un objeto con el id del documento y sus datos
            id: docSnap.id, // id del documento en Firestore
            ...docSnap.data() // resto de campos del documento
        });
    });

    return products; // Devuelve el array de productos
};

export const getProductById = async (id) => { // Recupera un producto por su id interno de Firestore
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        return null;
    }
    return { id: snap.id, ...snap.data() };
};

export const getProductByIdOrSku = async (identifier) => { // Recupera un producto por id interno o por SKU
    const productById = await getProductById(identifier); // Primero intenta buscar por id interno, si no encuentra nada, busca por SKU. Esto permite flexibilidad en el endpoint para que el cliente pueda usar cualquiera de los dos identificadores.
    if (productById) { // Si encuentra un producto por id interno, lo devuelve inmediatamente, evitando la consulta adicional por SKU, lo que mejora el rendimiento en caso de que el cliente esté usando el id interno.
        return productById; 
    }
    return await findProductBySku(identifier);
};

export const createProduct = async (productData) => { // Crea un nuevo documento en Firestore con los datos recibidos
    const sku = productData.sku ? normalizeSku(productData.sku) : generateSku(productData.name);
    //const name = productData.name ? productData.name.trim() : null;
    //const price = productData.price !== undefined ? parseFloat(productData.price) : null;
    //const stock = productData.stock !== undefined ? parseInt(productData.stock) : null;
// agregar validaciones y mas datos
// ver clase del martes 16/6 esta el ejemplo del profe para el test del proyecto
    if (productData.sku) {
        const existingProduct = await findProductBySku(sku);
        if (existingProduct) {
            const error = new Error('SKU_EXISTE');
            error.code = 'SKU_EXISTE';
            throw error;
        }
    }
    const newProduct = { ...productData, sku }; // 
        if (!productData.name || productData.stock === undefined || productData.price === undefined) {
            const error = new Error('DATOS_INCOMPLETOS');
            error.code = 'DATOS_INCOMPLETOS';
            throw error;
        }

    // Si el SKU no se proporciona, se genera automáticamente a partir del nombre del producto. Si el SKU se proporciona, se normaliza para mantener un formato consistente. 
    // Luego, se verifica si ya existe un producto con el mismo SKU para evitar duplicados. 
    // Finalmente, se crea el nuevo producto en Firestore y se devuelve el objeto con su id generado y el SKU final.

    const docRef = await addDoc(productsCollection, { ...productData, sku }); // addDoc crea un documento con id automático
    return { id: docRef.id, ...productData, sku }; // Devuelve un objeto con el id generado y el SKU final

    // Agregar calidaciones tanto en update como en create para fijar un formato minimo para los datos del producto como nombre obligatorio, precio positivo, etc. 
    // Esto se puede hacer con una función de validación que se llame antes de crear o actualizar el producto, y que lance errores específicos si los datos no cumplen con los requisitos. 
    
};

export const updateProduct = async (id, productData) => { // Actualiza un documento por su id interno
    const docRef = doc(db, 'products', id); // Referencia al documento específico para utilizar getDoc y updateDoc.
    const existingSnap = await getDoc(docRef); // saco una fotografía del documento antes de actualizarlo para verificar si existe

    if (!existingSnap.exists()) {
        const error = new Error('NOT_FOUND');
        error.code = 'NOT_FOUND';
        throw error;
    }

    const updatedData = { ...productData };

    if (productData.sku) {
        updatedData.sku = normalizeSku(productData.sku);
        const existingProduct = await findProductBySku(updatedData.sku);
        if (existingProduct && existingProduct.id !== id) {
            const error = new Error('SKU_EXISTE');
            error.code = 'SKU_EXISTE';
            throw error;
        }
    }

    await updateDoc(docRef, updatedData); // Aplica los cambios al documento en Firestore
    const updatedSnap = await getDoc(docRef); // Recupera el documento actualizado
    return { id: updatedSnap.id, ...updatedSnap.data() }; // Devuelve el documento actualizado como objeto
};

export const deleteProduct = async (id) => { // Elimina un documento por su id interno
    const docRef = doc(db, 'products', id); // Referencia al documento específico
    await deleteDoc(docRef); // Elimina el documento de Firestore
    return { id }; // Devuelve el id eliminado como confirmación
};