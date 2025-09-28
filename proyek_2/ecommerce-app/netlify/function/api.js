// netlify/functions/api.js
// This file *replaces* your original server.js for Netlify deployment

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// !!! Import the Netlify serverless wrapper
const serverless = require('@netlify/next'); 
const { connectDB } = require('../config/database'); // Adjust path as needed

// Import routes
const productRoutes = require('../routes/productRoutes'); // Adjust path
const orderRoutes = require('../routes/orderRoutes');   // Adjust path

const app = express();

// --- Express Setup (Same as your server.js) ---
app.use(cors());
app.use(express.json());

// Note: connectDB() should probably run outside the handler if possible, 
// or be wrapped to ensure a single connection in a serverless environment.
// For simplicity, we'll keep the call here, but be aware of cold-start database connection issues.
connectDB(); 

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check & Root endpoint (Keep these, but adjust the base path in client later)
app.get('/api/health', (req, res) => {
    // ... (your existing health check logic)
    res.json({ 
        status: 'OK', 
        message: 'E-commerce API is running via Netlify Function',
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});

app.get('/', (req, res) => {
    // ... (your existing root logic)
    res.json({ 
        message: '🏪 E-commerce Admin Dashboard API (Netlify Function)',
        // ... (rest of your root response)
    });
});

// Error handling middleware (keep these for internal function errors)
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        // ... (rest of your error response)
    });
});

// 404 handler 
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found in Netlify Function',
        // ... (rest of your 404 response)
    });
});
// ------------------------------------------------

// !!! The Magic: Export the wrapped Express app
// This is what Netlify runs. It listens on the Express app's routes.
exports.handler = serverless(app); 
