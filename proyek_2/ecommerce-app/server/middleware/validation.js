// server/middleware/validation.js
const validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Product name must be at least 2 characters long');
    }
    
    if (!price || isNaN(price) || price < 0) {
        errors.push('Valid price is required');
    }
    
    if (!category || category.trim().length === 0) {
        errors.push('Category is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

const validateOrder = (req, res, next) => {
    const { items, customer, total } = req.body;
    const errors = [];
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push('Order must contain at least one item');
    }
    
    if (!customer || !customer.name || !customer.email) {
        errors.push('Valid customer information is required');
    }
    
    if (!total || isNaN(total) || total <= 0) {
        errors.push('Valid total amount is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

module.exports = { validateProduct, validateOrder };