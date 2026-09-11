import config from "../config/config.js";
import { Queue } from "bullmq";

export const bookReturnQueue = new Queue("bookReturnQueue", {
  connection: {
    host: config.redis_host,
    port: config.redis_port,
  },
});