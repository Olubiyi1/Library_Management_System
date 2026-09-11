import { Worker } from "bullmq";
import config from "../config/config.js";
import { sendMail } from "../helpers/sendMail.js";

export const bookReturnApprovalWorker = new Worker(
  "bookReturnApprovalQueue",
  async (job) => {
    const { email, firstName, borrowingId } = job.data;

    await sendMail(
      email,
      "Book Return Approved",
      `
        <h1>Book Return Approved</h1>

        <p>Hello ${firstName},</p>

        <p>
          Your request to return the borrowed book has been approved.
        </p>

        <p>
          <strong>Borrowing ID:</strong> ${borrowingId}
        </p>

        <p>
          The book has now been marked as returned.
        </p>
      `
    );
  },
  {
    connection: {
      host: config.redis_host,
      port: config.redis_port,
    },
  }
);