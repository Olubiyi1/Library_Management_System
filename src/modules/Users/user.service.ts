import type { CreateUserDto } from "./Dto/createUser.dto.js";
import type { User } from "../../generated/prisma/client.js";
import prisma from "../../config/prisma.js";
import Guards from "../../guards/guards.js";
import { createLabel } from "../../utils/lables.js";

const UserServiceLogs = createLabel("USER_SERVICE")
type SafeUser = Omit<User, "password">

class UserService {

    async createUser(data:CreateUserDto):Promise<SafeUser>{

        const existingUser = await prisma.user.findUnique({where:{email:data.email}})
        if(existingUser){
            throw new Error("User already exists")
        }

        const hashedPassword = Guards.hashPassword(data.password)

        const user = await prisma.user.create({
            data:{
                ...data,
                password: hashedPassword
            }
        })
        const {password,...safeUser} = user

        UserServiceLogs.info("User successful created")
        return safeUser
    }

    async findUserById(id:string):Promise<User | null>{
        const userId = await prisma.user.findUnique({where:{id}})
        return userId
    }

    async findUserByEmail(email:string):Promise<User | null>{
        const user = await prisma.user.findUnique({where:{email}})

        return user
    }
    async deleteUser(id:string){
        await prisma.user.delete({where:{id}})
        return;
    }
}

export default new UserService;
