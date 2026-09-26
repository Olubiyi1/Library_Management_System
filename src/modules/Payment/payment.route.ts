import paymentController from "./payment.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Router } from "express";

const paymentRoute = Router();

paymentRoute.post(
  "/verify/:reference",
  authMiddleware,
  paymentController.verifyPayment
);

paymentRoute.post(
  "/:fineId",
  authMiddleware,
  paymentController.makePayment
);

export default paymentRoute;