// controllers/productos.controllers.js
// Este archivo contiene las funciones que manejan las peticiones HTTP relacionadas con los productos. 
// Estas funciones reciben las solicitudes del cliente, llaman a las funciones del modelo para interactuar con la base de datos y devuelven las respuestas correspondientes al cliente.
// En este caso, cada función corresponde a una ruta específica (GET, POST, PUT, DELETE) y utiliza las funciones del modelo para realizar las operaciones CRUD sobre la colección 'products' en Firestore.


// Importamos la función fetchProducts desde el modelo Product.js para obtener los productos desde Firestore en lugar de usar el array local.
// Esto nos permitirá trabajar con datos reales almacenados en la base de datos en lugar de datos estáticos definidos en el código.
import { fetchProducts, getProductByIdOrSku, createProduct, updateProduct, deleteProduct } from '../models/Product.js'; // Importa las funciones del modelo para CRUD

// Función para obtener TODOS los productos
export const getProductos = async (req, res) => { // Función para GET /productos
    try {
        const products = await fetchProducts(); // Obtiene todos los productos desde Firestore
        res.json(products); // Responde con el array de productos en formato JSON
    } catch (error) {
        console.error(error); // Log del error en servidor
        res.status(500).json({ error: 'Error al obtener productos' }); // Respuesta de error genérico
    }
};

// Función para obtener UN producto por su ID interno o por su SKU de negocio
export const getProductoById = async (req, res) => { // Función para GET /productos/:id
    const identifier = req.params.id; // Puede ser el id de Firestore o el SKU del producto

    try {
        const producto = await getProductByIdOrSku(identifier); // Busca por id interno o por SKU
        if (!producto) { // Si no existe el producto
            return res.status(404).json({ error: 'Producto no encontrado' }); // Devuelve 404
        }
        res.json(producto); // Devuelve el producto encontrado
    } catch (error) {
        console.error(error); // Log del error
        res.status(500).json({ error: 'Error al obtener producto' }); // Respuesta de error
    }
};

// Función para CREAR un nuevo producto
export const createProducto = async (req, res) => { // Función para POST /productos
    try {
        const productData = req.body; // Lee los datos del body de la petición ya validados por el middleware
        const created = await createProduct(productData); // Llama al modelo para crear el documento en Firestore
        res.status(201).json(created); // Responde con 201 Created y el objeto creado
    } catch (error) {
        console.error(error); // Log del error
        if (error.code === 'SKU_EXISTE') {
            return res.status(400).json({ error: 'El SKU ya existe' }); // Responde si el SKU ya está en uso
        }
        res.status(500).json({ error: 'Error al crear producto' }); // Respuesta de error
    }
};

// Función para ACTUALIZAR un producto existente
export const updateProducto = async (req, res) => { // Función para PUT /productos/:id
    const identifier = req.params.id; // Puede ser el id de Firestore o el SKU del producto
    const productData = req.body; // Datos a actualizar ya validados por el middleware

    try {
        const product = await getProductByIdOrSku(identifier); // Resuelve el identificador al id interno si es un SKU
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const updated = await updateProduct(product.id, productData); // Llama al modelo para actualizar por id interno
        res.json(updated); // Responde con el producto actualizado
    } catch (error) {
        console.error(error); // Log del error
        if (error.code === 'SKU_EXISTE') {
            return res.status(400).json({ error: 'El SKU ya existe' }); // Responde si el SKU ya está en uso
        }
        res.status(500).json({ error: 'Error al actualizar producto' }); // Respuesta de error
    }
};

// Función para ELIMINAR un producto
export const deleteProducto = async (req, res) => { // Función para DELETE /productos/:id
    const identifier = req.params.id; // Puede ser el id de Firestore o el SKU del producto

    try {
        const product = await getProductByIdOrSku(identifier); // Resuelve el identificador al id interno si es un SKU
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await deleteProduct(product.id); // Llama al modelo para eliminar por id interno
        res.status(204).send(); // Responde 204 No Content indicando eliminación exitosa
    } catch (error) {
        console.error(error); // Log del error
        res.status(500).json({ error: 'Error al eliminar producto' }); // Respuesta de error
    }
};

