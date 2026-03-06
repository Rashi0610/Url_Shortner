import { createClient } from "redis";

console.log("REDIS_URL =", process.env.REDIS_URL);

const redisClient = createClient({
  url: process.env.REDIS_URL,
    socket: process.env.NODE_ENV === "production"
    ? { tls: true }
    : undefined
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

await redisClient.connect();

console.log("Redis connected");

export default redisClient;