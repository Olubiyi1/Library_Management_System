import {Request} from "express"
import { AccountType } from "../generated/prisma/enums.ts"

export interface AuthRequest extends Request{
    user?:{
        id:String,
        email:String,
        accountType: AccountType
    }
}
