import { Queue } from "bullmq";
import config from "../config/config.js";

export const bookReturnApprovalQueue = new Queue(
  "bookReturnApprovalQueue",
  {
    connection: {
      host: config.redis_host,
      port: config.redis_port,
    },
  }
);