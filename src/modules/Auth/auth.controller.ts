import type{ Request,Response } from "express";
import userService from "../Users/user.service.js";
import ResponseHandler from "../../utils/ResponseHandler.js";
import { asyncHandler } from "../../errorHandlers/asyncHandler.js";
import AuthService from "./auth.service.js";
import authService from "./auth.service.js";
import type { AuthRequest } from "../../types/express.js";


class AuthController{
    registerUser = asyncHandler(async(req:Request,res:Response)=>{
        const user = await userService.createUser(req.body)
        return ResponseHandler.created(res,"Registration Successful,please check your email to verify your account",user)
    })

    verifyUser = asyncHandler(async(req:Request,res:Response)=>{
        const token = req.params.token as string
        await AuthService.verifyEmail(token)
        return res.redirect("http://localhost:5173/auth/login")
    })

    loginUser = asyncHandler(async(req:Request,res:Response)=>{
        const result = await authService.loginUser(req.body)
        res.cookie("accessToken",result.user.token.accessToken,{
            httpOnly:true,
            secure:true
        })
        res.cookie("refreshToken",result.user.token.refreshToken,{
            httpOnly:true,
            secure:true
        })
        return ResponseHandler.success(res,"Login successful",result)
    })

    forgotPassword = asyncHandler(async(req:Request,res:Response)=>{
        await authService.forgotPassword(req.body);
        return ResponseHandler.success(res,"If an account with that email exists, a password reset email has been sent.",
      null)
    })

    resetPassword = asyncHandler(async(req:Request,res:Response)=>{
        await authService.resetPassword(req.body)
        return ResponseHandler.success(res, "Password reset successful", null)
    })

    logoutUser = asyncHandler(async(req:AuthRequest,res:Response)=>{
        if(!req.user){
            return ResponseHandler.unauthorized(res, "Unauthorized");
        }
        const userId = req.user.id as string
        await authService.logoutUser(userId);
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return ResponseHandler.success(res, "Logout successfully");
  });
}

export default new AuthController;