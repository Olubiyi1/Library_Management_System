import type { CreateUserDto } from "../Users/Dto/createUser.dto.js";
import { createLabel } from "../../utils/lables.js";
import AppError from "../../errorHandlers/appError.js";
import userService from "../Users/user.service.js";
import { hashToken, generateToken } from "../../helpers/token.helpers.js";
import prisma from "../../config/prisma.js";
import { emailVerificationQueue } from "../../queues/emailVerificationQueue.js";
import type { LoginDto } from "./dto/userLoginDto.js";
import Guards from "../../guards/guards.js";
import { sendMail } from "../../helpers/sendMail.js";
import type { ResetPasswordDto } from "./dto/resetPasswordDto.js";


const AuthServiceLog = createLabel("AUTH_SERVICE");
class AuthService {
  async registerUser(data: CreateUserDto) {
    const existingUser = await userService.findUserByEmail(data.email);

    if (existingUser) {
      AuthServiceLog.warn(`user with ${data.email} already exists`);
      throw new AppError(`user with ${data.email} already exists`, 409);
    }

    const user = await userService.createUser(data);

    // generate verification token
    const verificationToken = generateToken();

    // save token to db
    const hashedVerificationToken = hashToken(verificationToken);

    await prisma.verificationToken.create({
      data: {
        token: hashedVerificationToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // send verification token
    try {
      await emailVerificationQueue.add(
        "sendVerificationEmail",
        {
          email: user.email,
          token: verificationToken,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
        },
      );
    } catch (err) {
      await userService.deleteUser(user.id);
      throw new AppError(
        "Email verification service currently unavailable",
        503,
      );
    }
    return user;
  }

  // email verification
  async verifyEmail(token: string) {
    if (!token) {
      throw new AppError("Verification token is required", 400);
    }
    const hashedToken = hashToken(token);

    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: hashedToken,
      },
    });
    if (!verificationToken) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new AppError("token expired,please request a new one", 409);
    }

    // update user verification status
    await prisma.user.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        verifiedAt: new Date(),
      },
    });

    // delete used verification token

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    AuthServiceLog.info("Email verification successful");

    return { message: "Email verification successful" };
  }

  // user login
  async loginUser(data: LoginDto) {
    const existingUser = await userService.findUserByEmail(data.email);

    if (!existingUser) {
      throw new AppError("User doesn't exist", 404);
    }
    const passwordMatch = await Guards.comparePassword(
      data.password,
      existingUser.password,
    );

    if (!passwordMatch) {
      AuthServiceLog.warn("Invalid email or password");
      throw new AppError("Invalid email or password", 400);
    }

    if (!existingUser.verifiedAt) {
      AuthServiceLog.warn("Please verify your email");
      throw new AppError("Please verify your email", 400);
    }

    const { password, ...safeUser } = existingUser;

    const payload = {
      id: safeUser.id,
      email: safeUser.email,
      accountType: safeUser.accountType,
    };

    const accessToken = Guards.createAccessToken(payload);

    const { refreshToken, hashedRefreshToken } =
      Guards.createRefreshToken(payload);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        hashedToken: hashedRefreshToken,
        userId: safeUser.id,
        expiresAt,
      },
    });

    return {
      user: {
        safeUser,
        token: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  async forgotPassword(email: string) {
    const existingUser = await userService.findUserByEmail(email);

    if (!existingUser) {
      AuthServiceLog.warn("Password reset requested for non-existing email");
      return;
    }

    const resetToken = generateToken();

    const hashedPasswordResetToken = hashToken(resetToken);

    await prisma.passwordResetToken.create({
      data: {
        token: hashedPasswordResetToken,
        userId: existingUser.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetLink = `http://localhost:5173/auth/reset-password/${resetToken}`;
    await sendMail(
      existingUser.email,
      "Reset your Password",
      `<p>You requested a password reset.
          <a href="${resetLink}">Click here to reset your password</a>
      </p>`,
    );

    return;
  }

  async resetPassword(data: ResetPasswordDto) {
    const hashedResetToken = hashToken(data.token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: hashedResetToken,
      },
    });
    if (!resetToken) {
      throw new AppError("Invalid or expired reset token", 400);
    }
    if (resetToken.expiresAt < new Date()) {
      throw new AppError("Reset token has expired", 400);
    }
    const hashedPassword =  Guards.hashPassword(data.newPassword);

    // update user's password
    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // delete used reset token
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    AuthServiceLog.info("Password reset successful");

    return{message:"Password reset Successful"}
  }

  async logoutUser(userId:string){
    await prisma.refreshToken.deleteMany({where:{userId}})
  }
}

export default new AuthService;
