import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

// .env
const PORT = 8080;
const REDIS_URI = "redis://localhost:6379";

const redis = new Redis(REDIS_URI);

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateKey(phone) {
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;
    const otp = generateOTP();

    await redis.set(generateKey(phone), otp, "EX", 30);

    res.json({
        message: "OTP sent successfully",
        otp: otp
    });
});

app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = await redis.get(generateKey(phone));

    if (!storedOtp) {
        res.status(400).json({ message: "OTP expired or not found" });
        return;
    }

    if (storedOtp !== otp) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }

    await redis.del(generateKey(phone));
    res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
    const { phone } = req.params;
    const ttl = await redis.ttl(generateKey(phone));

    res.json({ ttl });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});