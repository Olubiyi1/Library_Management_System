import { Router } from "express";
import AuthController from "./auth.controller.js";

const authRoute = Router()

authRoute.post("/register",AuthController.registerUser)
authRoute.get("/verify-email",AuthController.verifyUser)
authRoute.post("/login",AuthController.loginUser)
authRoute.post("/forgot-password",AuthController.forgotPassword)
authRoute.patch("/password/reset",AuthController.resetPassword)
