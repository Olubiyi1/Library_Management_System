import type { AccountType, Department, Section } from "../../../generated/prisma/enums.js";

export interface UpdateUserDto{
    firstName: string,
    lastName: string,
    email:string,
    phoneNumber:string,
    section:Section,
    department:Department,
    accountType: AccountType,
    isActive: boolean
}