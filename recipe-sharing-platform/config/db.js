const { MongoClient } = require('mongodb');

const connectDB = async () => {
    try {
        const client = new MongoClient('mongodb+srv://anushaelsaanub:Faith@faith.g2t4b.mongodb.net/recipe?retryWrites=true&w=majority&appName=Faith');
        await client.connect();
        const db = client.db('recipe');
        console.log("Connected to MongoDB");

        const recipeCollection = db.collection('recipes'); 
        return db;
    } catch (err) {
        console.error('Database connection failed', err);
        throw err;
    }
};
module.exports = connectDB;