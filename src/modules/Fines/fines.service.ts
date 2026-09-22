import prisma from "../../config/prisma.js";
import AppError from "../../errorHandlers/appError.js";
import userService from "../Users/user.service.js";
import { createLabel } from "../../utils/lables.js";

const fineLogs = createLabel("FINE_LOGS")

class FineService{
    async retrieveFines(userId:string,page:number,limit:number){
       await userService.findUserById(userId)

       const existingFines = await prisma.fine.findMany({
        where:{
            userId:userId,
            status:"UNPAID"
        },
        skip:(page - 1) * limit,
        take:limit
       })
       if(existingFines.length === 0){
        fineLogs.info("you have no existing fines")
        return;
       }
        
        return existingFines;
    }
}

export default new FineService;