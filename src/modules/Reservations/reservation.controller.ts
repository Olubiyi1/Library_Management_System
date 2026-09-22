import ReservationService from "./reservation.service.js";
import { asyncHandler } from "../../errorHandlers/asyncHandler.js";
import type { Request, Response } from "express";
import ResponseHandler from "../../utils/ResponseHandler.js";

class ReservationController {
  bookReserve = asyncHandler(async (req: Request, res: Response) => {
    const bookId = req.params.bookId as string;
    const userId = req.user.id;

    const result = await ReservationService.reserveBook(userId, bookId);

    return ResponseHandler.success(
      res,
      `book : ${bookId} reservation successful`,
      result,
    );
  });

  bookReservationCancel = asyncHandler(async (req: Request, res: Response) => {
    const bookId = req.params.bookId as string;
    const userId = req.user.id;

    const result = await ReservationService.cancelReservation(bookId, userId);
    return ResponseHandler.success(
      res,
      `book ${bookId} reservation cancelled`,
      result,
    );
  });
}

export default new ReservationController();
