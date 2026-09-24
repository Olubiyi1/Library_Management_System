import { Router } from "express";
import AuthController from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRoute = Router()

authRoute.post("/register",AuthController.registerUser)
authRoute.get("/verify-email/:token",AuthController.verifyUser)
authRoute.post("/login",AuthController.loginUser)
authRoute.post("/forgot-password",AuthController.forgotPassword)
authRoute.patch("/password/reset",AuthController.resetPassword)
authRoute.post("/logout",authMiddleware,AuthController.logoutUser)

export default authRoute;
