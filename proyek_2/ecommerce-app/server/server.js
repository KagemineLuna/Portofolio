// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'E-commerce API is running',
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: '🏪 E-commerce Admin Dashboard API',
        version: '1.0.0',
        description: 'Full-featured admin dashboard for e-commerce management',
        endpoints: {
            products: '/api/products',
            orders: '/api/orders',
            health: '/api/health'
        },
        documentation: 'Check the frontend at http://localhost:3000'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

// 404 handler - FIXED VERSION
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        availableEndpoints: {
            products: '/api/products',
            orders: '/api/orders',
            health: '/api/health'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🛒 E-commerce server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🏠 API root: http://localhost:${PORT}/`);
});