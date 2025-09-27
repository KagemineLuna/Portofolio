// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const orders = await db.collection('orders')
            .find()
            .sort({ createdAt: -1 })
            .toArray();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const order = {
            ...req.body,
            orderNumber: 'ORD' + Date.now(),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('orders').insertOne(order);
        res.status(201).json({
            message: 'Order created successfully',
            orderId: result.insertedId,
            orderNumber: order.orderNumber
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/orders/:id - Update order status
router.put('/:id', async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { status } = req.body;
        
        const result = await db.collection('orders').updateOne(
            { _id: id },
            { $set: { status, updatedAt: new Date() } }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/orders/stats - Get order statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const db = getDB();
        
        const stats = await db.collection('orders').aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    }
                }
            }
        ]).toArray();
        
        const dailyStats = await db.collection('orders').aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();
        
        res.json({
            overview: stats[0] || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 },
            daily: dailyStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;