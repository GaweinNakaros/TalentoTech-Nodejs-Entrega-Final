// Este middleware valida el body de la petición para crear y actualizar productos.
// Separa la lógica de validación del controlador, mejorando la mantenibilidad y evitando duplicación.
const SKU_PATTERN = /^[A-Z0-9_-]{3,30}$/i; // Patrón para SKU de negocio válido

export const validateProductBody = (req, res, next) => {
    const { name, price, stock, description, sku } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string') {
        errors.push('name es obligatorio y debe ser un texto');
    }

    if (price == null || typeof price !== 'number') {
        errors.push('price es obligatorio y debe ser un número');
    }

    if (stock == null || typeof stock !== 'number') {
        errors.push('stock es obligatorio y debe ser un número');
    }

    if (!description || typeof description !== 'string') {
        errors.push('description es obligatorio y debe ser un texto');
    }

    if (sku != null) {
        if (typeof sku !== 'string' || !SKU_PATTERN.test(sku.trim())) {
            errors.push('sku debe ser texto y solo puede contener letras, números, guiones bajos o guiones');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};
