import userController from "./user.controller.js";
import { Router } from "express";

const userRoute = Router();

userRoute
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

userRoute
  .route("/:id")
  .get(userController.findUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRoute;