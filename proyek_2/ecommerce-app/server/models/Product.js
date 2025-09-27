// server/models/Product.js
class Product {
    constructor(productData) {
        this.name = productData.name;
        this.price = productData.price;
        this.description = productData.description;
        this.category = productData.category;
        this.image = productData.image || 'https://via.placeholder.com/150';
        this.stock = productData.stock || 0;
        this.tags = productData.tags || [];
        this.isActive = productData.isActive !== false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    validate() {
        const errors = [];
        if (!this.name || this.name.length < 2) {
            errors.push('Product name must be at least 2 characters long');
        }
        if (!this.price || this.price < 0) {
            errors.push('Price must be a positive number');
        }
        if (!this.category) {
            errors.push('Category is required');
        }
        return errors;
    }
}

module.exports = Product;