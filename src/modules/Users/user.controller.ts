import userService from "./user.service.js";
import type{ Request,Response } from "express";
import { asyncHandler } from "../../errorHandlers/asyncHandler.js";
import ResponseHandler from "../../utils/ResponseHandler.js";




class UserController{

    getAllUser = asyncHandler(async(_,res:Response)=>{
        const allUsers = await userService.getAllUsers()
        return ResponseHandler.success(res,"all users retrieved",allUsers)
    })

    createUser = asyncHandler(async(req:Request,res:Response)=>{
        const userData = req.body
        const user = await userService.createUser(userData)
        return ResponseHandler.created(res,"User created successfully",user)
    })

    findUser = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
        const user = await userService.findUserById(id)
        return ResponseHandler.success(res,"User found successfully",user)
    })

    updateUser = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
       const {data} = req.body
        const updatedUser = await userService.updateUser(id,data)
        return ResponseHandler.success(res,"user updated successfully",updatedUser)
    })

    deleteUser = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
        const deactivatedUser = await userService.deleteUser(id)
        return ResponseHandler.success(res,"User deactivated successfully",deactivatedUser)
    })
}

export default new UserController;