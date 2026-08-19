import dotenv from "dotenv";
dotenv.config();
import IORedis from "ioredis";

export const redisConnection = new IORedis(
  process.env.REDIS_URL,
  {
    maxRetriesPerRequest: null,
  }
);

redisConnection.on("connect", () => {
  console.log("Redis connecting...");
});

redisConnection.on("ready", () => {
  console.log("Redis ready!");
});

redisConnection.on("error", (error) => {
  console.error("Redis ERROR:", error.message);
});

redisConnection.on("close", () => {
  console.log("Redis connection closed");
});