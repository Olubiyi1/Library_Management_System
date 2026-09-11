import AppError from "../../errorHandlers/appError.js";
import type { BorrowingDto } from "./dto/borrowing.dto.js";
import userService from "../Users/user.service.js";
import bookService from "../Books/book.service.js";
import prisma from "../../config/prisma.js";
import { createLabel } from "../../utils/lables.js";

const borrowingServiceLog = createLabel("BORROWING_SERVICE");

class BorrowingService {
  async borrowBook(data: BorrowingDto) {
    // find if user exist
    const existingUser = await userService.findUserById(data.userId);
    // find if book exist
    const exisitingBook = await bookService.findBook(data.bookId);

    if (!exisitingBook.availability) {
      borrowingServiceLog.info("Book not currently available");
      throw new AppError("Book not currently available", 400);
    }

    const borrowedBook = await prisma.borrowing.create({
      data: {
        userId: data.userId,
        bookId: data.bookId,
      },
    });
    await bookService.updateBook(data.bookId, {
      availability: false,
    });

    return borrowedBook;
  }

  async returnBook(borrowingId: string) {
    // check the borrowed book details
    const borrowedBook = await prisma.borrowing.findUnique({
      where: { id: borrowingId },
    });

    if (!borrowedBook) {
      throw new AppError("Borrowing record not found", 404);
    }

    // check if book has previously be returned
    if (borrowedBook.returnedAt) {
      throw new AppError("Book has already been returned", 400);
    }
    // update returned status
    const returnedBook = await prisma.borrowing.update({
      where: {
        id: borrowingId,
      },
      data: {
        returnedAt: new Date(),
      },
    });

    // update availability
    await bookService.updateBook(borrowedBook.bookId,{availability:true})

    borrowingServiceLog.info("Book successfully returned")
    return returnedBook
  }
}

export default new BorrowingService();
