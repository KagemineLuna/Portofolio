// server/controllers/productController.js
const { getDB } = require('../config/database');
const Product = require('../models/Product');

const productController = {
    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const db = getDB();
            const { category, search, page = 1, limit = 10 } = req.query;
            
            let query = {};
            if (category) query.category = category;
            if (search) query.$text = { $search: search };
            
            const products = await db.collection('products')
                .find(query)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .toArray();
                
            const total = await db.collection('products').countDocuments(query);
            
            res.json({
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get single product
    getProductById: async (req, res) => {
        try {
            const db = getDB();
            const { id } = req.params;
            
            const product = await db.collection('products').findOne({ _id: id });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Create new product
    createProduct: async (req, res) => {
        try {
            const db = getDB();
            const product = new Product(req.body);
            
            // Validate product
            const errors = product.validate();
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
            
            const result = await db.collection('products').insertOne(product);
            res.status(201).json({
                message: 'Product created successfully',
                productId: result.insertedId,
                product: { ...product, _id: result.insertedId }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Update product
    updateProduct: async (req, res) => {
        try {
            const db = getDB();
            const { id } = req.params;
            
            const updates = {
                ...req.body,
                updatedAt: new Date()
            };
            
            const result = await db.collection('products').updateOne(
                { _id: id },
                { $set: updates }
            );
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Delete product
    deleteProduct: async (req, res) => {
        try {
            const db = getDB();
            const { id } = req.params;
            
            const result = await db.collection('products').deleteOne({ _id: id });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get product statistics
    getProductStats: async (req, res) => {
        try {
            const db = getDB();
            
            const stats = await db.collection('products').aggregate([
                {
                    $group: {
                        _id: null,
                        totalProducts: { $sum: 1 },
                        totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
                        averagePrice: { $avg: '$price' },
                        lowStock: {
                            $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] }
                        }
                    }
                }
            ]).toArray();
            
            const categoryStats = await db.collection('products').aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]).toArray();
            
            res.json({
                overview: stats[0] || { totalProducts: 0, totalValue: 0, averagePrice: 0, lowStock: 0 },
                categories: categoryStats
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;