import { Worker } from "bullmq";
import config from "../config/config.js";
import { sendMail } from "../helpers/sendMail.js";

export const emailVerificationWorker = new Worker("emailVerificationQueue",
  async (job) => {
    
    const { email, token } = job.data;
    
    const verificationUrl = `http://localhost:5000/api/v1/auth/verify-email/${token}`;;
    await sendMail(
      email,
      "Verify your email",
      `<h1>Verify your email</h1>
        <p>Click the link below to verify your account:</p>
        <a href="${verificationUrl}">Verify my email</a>`
    );
  },
  {
    connection: {
      host: config.redis_host,
      port: config.redis_port
    },
  },
);

emailVerificationWorker.on("active", (job) => {
  console.log(`Job ${job.id} is active`);
});

emailVerificationWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailVerificationWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
});