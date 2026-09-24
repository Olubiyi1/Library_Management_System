import AppError from "../../errorHandlers/appError.js";
import userService from "../Users/user.service.js";
import prisma from "../../config/prisma.js";
import paystackService from "./Paystack/paystack.service.js";

class Payment {
  async makePayment(userId: string, fineId: string) {
    const user = await userService.findUserById(userId);

    if (!user?.email) {
      throw new AppError("User email is required for payment", 400);
    }

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
        fineId,
        status: "PENDING",
      },
    });

    if (existingPayment) {
      throw new AppError(
        "There is already a pending payment for this fine",
        400,
      );
    }

    const payment = await paystackService.initializePayment(
      user.email,
      Number(exisitingFine.amount),
    );

    const newPayment = await prisma.payment.create({
        data:{
            fineId:fineId,
            amount:exisitingFine.amount,
            reference:payment.data.reference
        }
    })

    return{
        payment:newPayment,
        paystack:payment.data
    }
  }
}

export default new Payment();
