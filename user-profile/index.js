import express from 'express';
import Redis from 'ioredis';

// .env
const PORT = 8080;
const REDIS_URI = "redis://localhost:6379";

const app = express();
app.use(express.json());

const redis = new Redis(REDIS_URI);

app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ status: "success" });
});

app.get("/user/:id/json", async (req, res) => {
    const userData = await redis.get(`user:${req.params.id}:json`);
    if (userData) {
        res.json(JSON.parse(userData));
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ status: "success" });
});

app.get("/user/:id/hash", async (req, res) => {
    const userData = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json(userData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});