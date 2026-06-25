
// CRUD de categorias -- Create, Read, Update, Delete
// Para manejar las rutas de categorías, vamos a crear un nuevo router específico para categorías. 
// Esto nos ayudará a organizar mejor nuestro código y mantener las rutas relacionadas agrupadas.

import { Router } from 'express';
// Importamos el controlador para obtener todas las categorías se puede hacer de forma individual o importarlos todos juntos, dependiendo de cómo estén exportados en el archivo de controladores.
import { getAllCategories } from '../controllers/caregories.controllers.js';
// Importamos los controladores para las operaciones CRUD de categorías todos juntos en una sola linea.
import { getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/caregories.controllers.js'; 

const categoriesRouter = Router();

// Ruta para obtener todas las categorías
categoriesRouter.get('/api/categories', getAllCategories);

// Ruta para obtener una categoría por ID
categoriesRouter.get('/api/categories/:id', getCategoryById);

// Ruta para crear una nueva categoría
categoriesRouter.post('/api/categories', createCategory);

// Ruta para actualizar una categoría existente
categoriesRouter.put('/api/categories/:id', updateCategory);

// Ruta para eliminar una categoría
categoriesRouter.delete('/api/categories/:id', deleteCategory);

//Crud de categorias -- Create, Read, Update, Delete
    


export default categoriesRouter;