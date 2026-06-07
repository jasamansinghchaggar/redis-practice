import { Worker } from 'bullmq';
import { connection } from './queue.js';

const worker = new Worker('email-queue', async job => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(`Job ${job.id} completed`);
}, { connection });

worker.on('completed', job => {
    console.log(`Job ${job.id} has been completed`, job.data, job.name);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err, job.data, job.name);
});