import type { CreateUserDto } from "./Dto/createUser.dto.js";
import type { User } from "../../generated/prisma/client.js";
import prisma from "../../config/prisma.js";
import Guards from "../../guards/guards.js";
import { createLabel } from "../../utils/lables.js";
import AppError from "../../errorHandlers/appError.js";
import type { UpdateUserDto } from "./Dto/updateUser.dto.js";

const UserServiceLogs = createLabel("USER_SERVICE");
type SafeUser = Omit<User, "password">;

class UserService {
  async getAllUsers() {
    const allUsers = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      omit: {
        password: true,
      },
    });
    return allUsers;
  } 

  async createUser(data: CreateUserDto): Promise<SafeUser> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw (new AppError("User already exists",400));
    }

    const hashedPassword = Guards.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    const { password, ...safeUser } = user;

    UserServiceLogs.info("User successful created");
    return safeUser;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id, isActive: true },
    });

    if(!user){
      UserServiceLogs.warn("User not found")
      return null
    }


    UserServiceLogs.info("User found successfully");
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email, isActive: true },
    });

     if(!user){
      UserServiceLogs.warn("User not found")
      return null
    }

    UserServiceLogs.info("User found successfully");
    return user;
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    await this.findUserById(userId);

    const updatedData = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      omit:{
        password:true
      }
    });

    UserServiceLogs.info(`user ${userId} update successful`);
    return updatedData
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!user) {
      UserServiceLogs.warn("User not found");
      throw new AppError("user not found", 404);
    }

    const deactivatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: false,
      },
    });
    UserServiceLogs.info(
      `user with ${user.id}, email:${user.email} is successfully deleted`,
    );
    return deactivatedUser;
  }
}

export default new UserService();
