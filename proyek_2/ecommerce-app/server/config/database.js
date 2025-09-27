// server/config/database.js
const { MongoClient } = require('mongodb');

let db;
let client;

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        client = new MongoClient(uri);
        
        await client.connect();
        db = client.db('ecommerce');
        console.log('✅ Connected to MongoDB Atlas');
        
        // Create indexes
        await db.collection('products').createIndex({ name: 'text' });
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}

async function closeDB() {
    if (client) {
        await client.close();
    }
}

module.exports = { connectDB, getDB, closeDB };