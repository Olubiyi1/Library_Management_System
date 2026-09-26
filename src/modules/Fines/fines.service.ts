import prisma from "../../config/prisma.js";
import AppError from "../../errorHandlers/appError.js";
import userService from "../Users/user.service.js";
import { createLabel } from "../../utils/lables.js";
import type { FineReason } from "../../generated/prisma/enums.js";
import { connect } from "node:http2";

const fineLogs = createLabel("FINE_LOGS")

class FineService{


    async getMyFines(userId:string){

        await userService.findUserById(userId)

        const myFines = await prisma.fine.findMany({
            where:{
                userId,
                status:"UNPAID"
            }
        })

        if(myFines.length === 0){
            return "You have no pending fines"
        }

        return myFines;
    }

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

    async createFine(userId:string,borrowingId:string,amount:number,reason:FineReason){
        const existingFine = await prisma.fine.findFirst({
            where:{
                userId:userId,
                borrowingId:borrowingId
            }
        })
        if(existingFine){
            throw new AppError("You have no exisitng fine",400)
        }
        
        const newFine = await prisma.fine.create({
          data:{
                amount,
                reason,
                borrowing:{
                    connect:{
                        id:borrowingId
                    }
                },
                user:{
                    connect:{
                        id:userId
                    }
                }
            
          }
        })
        return newFine;
    }
}

export default new FineService;