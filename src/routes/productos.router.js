
import { Router } from 'express';

import {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} from '../controllers/productos.controllers.js';
import { validateProductBody } from '../validators/product.validator.js';

// import { 
// getProductos, 
// getProductoById, 
// createProducto,
// updateProducto, 
// deleteProducto
// } from '../controllers/productos.controllers.js'; 
// // también se pueden importar todos juntos como un objeto.

const router = Router();

router.get('/', getProductos);

router.get('/:id', getProductoById);

router.post('/', validateProductBody, createProducto);

router.put('/:id', validateProductBody, updateProducto);

router.delete('/:id', deleteProducto);



export default router; 