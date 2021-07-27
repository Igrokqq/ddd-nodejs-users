import redis from "redis";
import { Redis } from "redis";
import { authConfig } from "@config/index";

const connectionUrl: string = authConfig.redisConnectionString;
const redisConnection: Redis = redis.createClient(connectionUrl);

redisConnection.on("connect", () => {
  console.log(`[Redis]: Connected to redis server at ${connectionUrl}`);
});

export default redisConnection;
