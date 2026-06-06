import express from 'express';
import Redis from 'ioredis';

// .env
const PORT = 8080;
const REDIS_URI = "redis://localhost:6379";

const app = express();
app.use(express.json());

const redis = new Redis(REDIS_URI);

const QUEUE_NAME = "email:queue";

app.post("/email", async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject,
        body: req.body.body,
        createdAt: new Date().toISOString()
    }
    await redis.lpush(QUEUE_NAME, JSON.stringify(job));
    res.json({ status: "success" });
});

app.get("/email/process-one", async (req, res) => {
    const jobData = await redis.rpop(QUEUE_NAME);
    const jobs = await redis.lrange(QUEUE_NAME, 0, -1);

    res.json({
        job_data: jobData ? JSON.parse(jobData) : null,
        jobs: jobs.map(job => JSON.parse(job))
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});