import paymentService from "./payment.service.js";
import type { Request, Response } from "express";
import { asyncHandler } from "../../errorHandlers/asyncHandler.js";
import ResponseHandler from "../../utils/ResponseHandler.js";

class PaymentController {
  makePayment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const fineId = req.params.fineId as string;

    const payment = await paymentService.makePayment(userId, fineId);
    return ResponseHandler.success(
      res,
      "Payment Initialized successfully",
      payment,
    );
  });

  verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const reference = req.params.reference as string;

    const payment = await paymentService.verifyPayment(reference);

    return ResponseHandler.success(
      res,
      "Payment verified successfully",
      payment,
    );
  });
}

export default new PaymentController();
