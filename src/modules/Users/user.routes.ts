import userController from "./user.controller.js";
import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import{ AccountType } from "../../generated/prisma/enums.js";
import { restrictTo } from "../../middleware/restrictTo.js";

const userRoute = Router();

userRoute
  .route("/")
  .get(authMiddleware,restrictTo(AccountType.ADMIN),userController.getAllUser)
  .post(userController.createUser);

userRoute
  .route("/:id")
  .get(authMiddleware,restrictTo(AccountType.ADMIN),userController.findUser)
  .patch(authMiddleware,restrictTo(AccountType.ADMIN),userController.updateUser)
  .delete(authMiddleware,restrictTo(AccountType.ADMIN),userController.deleteUser);

export default userRoute;