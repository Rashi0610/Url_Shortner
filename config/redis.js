import { createClient } from "redis";

console.log("REDIS_URL =", process.env.REDIS_URL);

const redisClient = createClient({
  url: process.env.REDIS_URL,
   socket: {
    tls: true
  }
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

await redisClient.connect();

console.log("Redis connected");

export default redisClient;