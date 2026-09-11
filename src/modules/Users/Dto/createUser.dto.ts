import { AccountType,Section,Department } from "../../../generated/prisma/enums.js";

export interface CreateUserDto{
    firstName:string,
    lastName: string,
    email : string,
    password : string,
    phoneNumber: string
    section? :Section,
    department? : Department,
    accountType? : AccountType
}