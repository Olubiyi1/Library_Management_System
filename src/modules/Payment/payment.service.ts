import AppError from "../../errorHandlers/appError.js";
import userService from "../Users/user.service.js";
import prisma from "../../config/prisma.js";

class Payment {
  async makePayment(userId: string, fineId: string) {
        await userService.findUserById(userId);

        // check for existing fine
        const exisitingFine = await prisma.fine.findFirst({
            where: {
                id: fineId,
            },
        });

        if (!exisitingFine) {
            throw new AppError("You have no existinf fine", 404);
        }
        if (exisitingFine.userId !== userId) {
            throw new AppError("You are not permitted to pay this fine", 403);
        }

        // check fine status before payment init
        if (exisitingFine.status === "PAID") {
            throw new AppError("This fine has already been paid", 400);
        }
        if (exisitingFine.status === "WAIVED") {
            throw new AppError("This fine has already been waived", 400);
        }

        //   check payment status

        const existingPayment = await prisma.payment.findFirst({
            where: {
                id: fineId,
                status: "PENDING",
            },
        });

        if (existingPayment) {
            throw new AppError("There is already a pending payment for this fine",400);
        }
    }
}

export default new Payment();
