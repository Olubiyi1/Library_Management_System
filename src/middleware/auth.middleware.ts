
import jwt from "jsonwebtoken"
import AppError from "../errorHandlers/appError.js";
import Guards, { type AccessTokenPayload } from "../guards/guards.js";
import prisma from "../config/prisma.js";
import { createLabel } from "../utils/lables.js";
import type{ Request,Response,NextFunction } from "express";
import userService from "../modules/Users/user.service.js";

const authLog = createLabel("AUTH")

export const authMiddleware = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{

    try{
        
        // get access token from the cookie sent from controller
        const token = req.cookies?.accessToken

        if(!token){
            next(new AppError("Unauthorized: No token provided", 401));
            return;
        }

        // verify access token
        let decoded:AccessTokenPayload
        try{
        decoded = Guards.verifyAccessToken(token)
        }
        catch(err){
            if(err instanceof jwt.TokenExpiredError){
                next(new AppError("Session expired. Please log in again", 401));
                return;
            }

             next(new AppError("Invalid token. Please log in again", 401));
            return;
        }

        // find user in db
        const user = await userService.findUserById(decoded.id)

        if(!user){
            next (new AppError("User no longer exists", 401))
            return;
        }

        // attach user to request
        req.user={
            id:user.id,
            email:user.email,
            accountType:user.accountType
        }

        authLog.info("User authenticated", { userId: user.id });
        next();
    }
    catch(err){
        next(err)
    }
}