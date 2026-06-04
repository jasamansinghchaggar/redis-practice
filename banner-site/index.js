import express from 'express';
import Redis from 'ioredis';

// .env
const PORT = 8080;
const REDIS_URI = "redis://localhost:6379";

const app = express();
app.use(express.json());

const redis = new Redis(REDIS_URI);

const BANNER_KEY = 'banner:message';

app.post("/banner", async (req, res) => {
    const { message } = req.body;
    await redis.set(BANNER_KEY, message);
    res.json({ message: 'Banner message updated successfully' });
});

app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNER_KEY);
    res.json({ message });
});

app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({ message: 'Banner message deleted successfully' });
});

app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({ exists: Boolean(exists) });
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:8080');
});