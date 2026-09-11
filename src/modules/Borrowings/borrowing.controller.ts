import BorrowingService from "./borrowing.service.js";
import ResponseHandler from "../../utils/ResponseHandler.js";
import type { Request, Response } from "express";
import { asyncHandler } from "../../errorHandlers/asyncHandler.js";

class BorrowingController {

    
  borrowBook = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const bookId = req.params.bookId as string;

    const borrowedBook = await BorrowingService.borrowBook({ userId, bookId });

    return ResponseHandler.success(
      res,
      "Book borrowed successfully",
      borrowedBook,
    );
  });

  returnBook = asyncHandler(async (req: Request, res: Response) => {
    const borrowingId = req.params.borrowingId as string;

    const returnRequest = await BorrowingService.returnBook(borrowingId);

    return ResponseHandler.success(
      res,
      "Return under review, we will notify you when approved",
      returnRequest,
    );
  });


  approveBookReturn = asyncHandler(async (req: Request, res: Response) => {
    const borrowingId = req.params.borrowingId as string;

    const approvedReturn =
      await BorrowingService.approveBookReturn(borrowingId);

    return ResponseHandler.success(
      res,
      "Book return approved successfully",
      approvedReturn,
    );
  });
}

export default new BorrowingController;
