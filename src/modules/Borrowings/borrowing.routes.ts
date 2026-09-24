import { Router } from "express";
import borrowingController from "./borrowing.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/restrictTo.js";
import { AccountType } from "../../generated/prisma/enums.js";

const borrowingRoute = Router();

borrowingRoute.post("/:bookId",authMiddleware, borrowingController.borrowBook);
borrowingRoute.post("/return/:borrowingId",authMiddleware, borrowingController.returnBook);
borrowingRoute.patch("/return/approve/:borrowingId",authMiddleware,restrictTo(AccountType.ADMIN),borrowingController.approveBookReturn);
borrowingRoute.patch("/renew",authMiddleware,borrowingController.renewBook)
borrowingRoute.get("/history",authMiddleware,borrowingController.retrieveHistory)

export default borrowingRoute;