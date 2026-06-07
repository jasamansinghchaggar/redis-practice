import express from 'express';
import Redis from 'ioredis';
import { emails } from './src/queue.js';

// .env
const PORT = 8080;
const REDIS_URI = "redis://localhost:6379";

const app = express();
app.use(express.json());

const redis = new Redis(REDIS_URI);


app.post('/welcome-email', async (req, res) => {
    const job = await emails.add('welcome-email', {
        to: req.body.to,
        subject: 'Welcome to our service!',
        body: 'Thank you for signing up. We hope you enjoy our service.',
    },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        });
    res.json({
        message: 'Welcome email job added to the queue',
        jobId: job.id
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});