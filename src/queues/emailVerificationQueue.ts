import { Queue } from "bullmq";
import config from "../config/config.js";

export const emailVerificationQueue = new Queue("emailVerificationQueue",{
    connection:{
        host:config.redis_host,
        port:config.redis_port
    }
})