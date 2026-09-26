import { Router } from "express";
import finesController from "./fines.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/restrictTo.js";
import { AccountType } from "../../generated/prisma/enums.js";

const finesRoute = Router()

finesRoute.get("/",authMiddleware,restrictTo(AccountType.ADMIN),finesController.retrieveFines)
finesRoute.get("/:id",authMiddleware,finesController.getMyFines)
finesRoute.post("/:borrowingId",authMiddleware,restrictTo(AccountType.ADMIN),finesController.createFine)


export default finesRoute