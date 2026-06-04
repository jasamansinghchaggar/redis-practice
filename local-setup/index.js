import express from 'express';
import mongoose from 'mongoose';
import Redis from 'ioredis';

// .env
const PORT = 8080;
const REDIS_URI = "redis://localhost:6379";
const MONGO_URI = "mongodb://localhost:27017/local-setup";

const app = express();
const redis = new Redis(REDIS_URI);
const mongo = mongoose.connect(MONGO_URI);

app.get('/redis', async (req, res) => {
    const response = await redis.ping();
    res.json({ message: response });
});

app.get('/mongo', async (req, res) => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URI);
    }

    res.json({ message: 'MongoDB connection successful', database: mongoose.connection.name });
});


app.listen(PORT, () => {
    console.log('Server is running on http://localhost:8080');
});