import prisma from "../../config/prisma.js";
import AppError from "../../errorHandlers/appError.js";
import { createLabel } from "../../utils/lables.js";
import bookService from "../Books/book.service.js";
import userService from "../Users/user.service.js";

const reservationServiceLog = createLabel("RESERVATION_SERVICE");

class ReservationService {
  async reserveBook(bookId: string, userId: string) {
    await bookService.findBook(bookId);

    await userService.findUserById(userId);

    const availableBook = await prisma.book.findFirst({
      where: {
        id: bookId,
        availableCopies: {
          equals: 0,
        },
      },
    });

    if (!availableBook) {
      reservationServiceLog.warn("Book is currently available");
      throw new AppError(
        "Book is currently available. You can borrow it instead.",
        400,
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookId,
        dueDate: new Date(),
      },
    });

    reservationServiceLog.info(`book: ${bookId} successful`);

    return reservation;
  }

// cancel reservation
  async cancelReservation(bookId: string, userId: string) {
    await bookService.findBook(bookId);

    await userService.findUserById(userId);

    const reservation = await prisma.reservation.findFirst({
      where: {
        bookId,
        userId,
      },
    });

    if (!reservation) {
      reservationServiceLog.warn("Reservation not found");
      throw new AppError("Reservation not found", 404);
    }

    await prisma.reservation.delete({
      where: {
        id: reservation.id,
      },
    });

    reservationServiceLog.info(`reservation cancelled for book: ${bookId}`);

    return;
  }
}

export default new ReservationService;
