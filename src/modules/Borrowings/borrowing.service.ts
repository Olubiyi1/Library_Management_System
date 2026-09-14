import AppError from "../../errorHandlers/appError.js";
import type { BorrowingDto } from "./dto/borrowing.dto.js";
import userService from "../Users/user.service.js";
import bookService from "../Books/book.service.js";
import prisma from "../../config/prisma.js";
import { createLabel } from "../../utils/lables.js";
import { bookReturnQueue } from "../../queues/bookReturnQueue.js";
import { bookReturnApprovalQueue } from "../../queues/bookReturnApproval.js";
import config from "../../config/config.js";

const borrowingServiceLog = createLabel("BORROWING_SERVICE");

class BorrowingService {
  async borrowBook(data: BorrowingDto) {
    // 1. Check if user exists
    await userService.findUserById(data.userId);

    // 2. Check if book exists
    await bookService.findBook(data.bookId);

    // 3. Start transaction
    const borrowedBook = await prisma.$transaction(async (tx) => {
      const borrowedAt = new Date();

      const dueDate = new Date(borrowedAt);

      dueDate.setDate(dueDate.getDate() + config.borrowing_duration_days);
      // Check availability and reduce available copies
      const result = await tx.book.updateMany({
        where: {
          id: data.bookId,
          availableCopies: {
            gt: 0,
          },
        },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      });

      // No available copy
      if (result.count === 0) {
        throw new AppError("Book not currently available", 400);
      }

      // Create borrowing record
      const borrowing = await tx.borrowing.create({
        data: {
          userId: data.userId,
          bookId: data.bookId,
          borrowedAt,
          dueDate,
        },
      });

      return borrowing;
    });

    return borrowedBook;
  }

  // return book
  async returnBook(borrowingId: string) {
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: borrowingId },
    });

    if (!borrowing) {
      throw new AppError("Borrowing record not found", 404);
    }

    if (borrowing.status === "RETURNED") {
      throw new AppError("Book has already been returned", 400);
    }

    if (borrowing.status === "RETURN_PENDING") {
      throw new AppError("Return request is already pending", 400);
    }

    const pendingReturn = await prisma.borrowing.update({
      where: {
        id: borrowingId,
      },
      data: {
        status: "RETURN_PENDING",
      },
    });

    try {
      await bookReturnQueue.add(
        "book-return",
        {
          borrowingId: borrowing.id,
          userId: borrowing.userId,
          bookId: borrowing.bookId,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
        },
      );

      borrowingServiceLog.info("Return request submitted and pending review");
    } catch (error: any) {
      borrowingServiceLog.error("Failed to queue return notification", error);

      throw new AppError("Return request could not be processed", 500);
    }

    return pendingReturn;
  }
  async approveBookReturn(borrowingId: string) {
    const borrowing = await prisma.borrowing.findUnique({
      where: {
        id: borrowingId,
      },
    });

    if (!borrowing) {
      borrowingServiceLog.warn("Borrowing record not found");
      throw new AppError("Borrowing record not found", 404);
    }

    if (borrowing.status !== "RETURN_PENDING") {
      throw new AppError("This return request is not pending approval", 400);
    }

    // Find the user before the transaction
    const user = await userService.findUserById(borrowing.userId);

    if (!user) {
      borrowingServiceLog.warn("User not found");
      throw new AppError("User not found", 404);
    }

    // Update borrowing and book together
    const approveReturn = await prisma.$transaction(async (tx) => {
      const updatedBorrowing = await tx.borrowing.update({
        where: {
          id: borrowingId,
        },
        data: {
          status: "RETURNED",
          returnedAt: new Date(),
        },
      });

      await tx.book.update({
        where: {
          id: borrowing.bookId,
        },
        data: {
          availableCopies: {
            increment: 1,
          },
        },
      });

      return updatedBorrowing;
    });

    // Notify user after successful transaction
    try {
      await bookReturnApprovalQueue.add(
        "return-approved",
        {
          email: user.email,
          firstName: user.firstName,
          borrowingId: borrowing.id,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
        },
      );

      borrowingServiceLog.info("Return approval notification queued");
    } catch (error: any) {
      borrowingServiceLog.error(
        "Failed to queue return approval notification",
        error,
      );

      throw new AppError(
        "Return approved, but notification could not be queued",
        500,
      );
    }

    borrowingServiceLog.info("Return approved");

    return approveReturn;
  }

 

async renewBook(borrowingId: string) {
   const RENEWAL_EXTENSION_DAYS = 3;
  const borrowing = await prisma.borrowing.findUnique({
    where: {
      id: borrowingId,
    },
  });

  if (!borrowing) {
    borrowingServiceLog.warn("Borrowing record not found");
    throw new AppError("Borrowing record not found", 404);
  }

  if (borrowing.status !== "BORROWED") {
    borrowingServiceLog.warn(
      `Book cannot be renewed. Current status: ${borrowing.status}`
    );

    throw new AppError(
      "Only borrowed books can be renewed",
      400,
    );
  }

  const newDueDate = new Date(borrowing.dueDate);

  newDueDate.setDate(
    newDueDate.getDate() + RENEWAL_EXTENSION_DAYS
  );

  const renewedBorrowing = await prisma.borrowing.update({
    where: {
      id: borrowingId,
    },
    data: {
      dueDate: newDueDate,
    },
  });

  borrowingServiceLog.info(
    `Book borrowing ${borrowingId} renewed successfully. New due date: ${newDueDate.toISOString()}`
  );

  return renewedBorrowing;
}
}

export default new BorrowingService();
