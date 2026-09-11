import { Worker } from "bullmq";
import config from "../config/config.js";
import { sendMail } from "../helpers/sendMail.js";

export const bookReturnWorker = new Worker(
  "bookReturnQueue",
  async (job) => {
    const { borrowingId} = job.data;

    await sendMail(
      config.admin_Email,
      "Book Return Request",
      `<h1>Book Return Request</h1>
        <p>A user has requested to return a book.</p>
        <p><strong>Borrowing ID:</strong> ${borrowingId}</p>
        <p><strong>User ID:</strong> ${borrowingId.userId}</p>
        <p><strong>Book ID:</strong> ${borrowingId.bookId}</p>
        <p>Please review this request and approve the return.</p>`
    );
  },
  {
    connection: {
      host: config.redis_host,
      port: config.redis_port,
    },
  }
);