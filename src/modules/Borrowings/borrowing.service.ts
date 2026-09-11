import AppError from "../../errorHandlers/appError.js";
import type { BorrowingDto } from "./dto/borrowing.dto.js";
import userService from "../Users/user.service.js";
import bookService from "../Books/book.service.js";
import prisma from "../../config/prisma.js";
import { createLabel } from "../../utils/lables.js";
import { bookReturnQueue } from "../../queues/bookReturnQueue.js";
import { bookReturnApprovalQueue } from "../../queues/bookReturnApproval.js";

const borrowingServiceLog = createLabel("BORROWING_SERVICE");

class BorrowingService {
  async borrowBook(data: BorrowingDto) {
    // 1. Check if user exists
    await userService.findUserById(data.userId);

    // 2. Check if book exists
    await bookService.findBook(data.bookId);

    // 3. Start transaction
    const borrowedBook = await prisma.$transaction(async (tx) => {
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
    throw new AppError("This return request is not pending approval",400);
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

    borrowingServiceLog.info(
      "Return approval notification queued",
    );
  } catch (error: any) {
    borrowingServiceLog.error("Failed to queue return approval notification",error);

    throw new AppError("Return approved, but notification could not be queued",500);
  }

  borrowingServiceLog.info("Return approved");

  return approveReturn;
}
}

export default new BorrowingService();
